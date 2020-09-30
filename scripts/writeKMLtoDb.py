from os import listdir
from os.path import isfile, join, abspath, dirname
import sqlite3
from pykml import parser
import pdb
import json

# opens dir assets/kml and reads the files into the database
# stores "INSERT INTO kml(filename, title, raw_kml, coordinates, kml_type) VALUES (?, ?, ?, ?, ?)"
# x = "<Point><coordinates>-71.1663,42.2614,0</coordinates></Point>"
# y = "<LineString><coordinates>-71.1663,42.2614 -71.1667,42.2616</coordinates></LineString>"
# z = "<LineString><coordinates>-71.1663,42.2614 -71.1667,42.2616 -71.1663,42.2614 -71.1667,42.2616</coordinates></LineString>"

gx_namespace = "{http://www.google.com/kml/ext/2.2}"
kml_types = {
  "polygon": "Polygon",
  "linestring": "LineString",
  "point": "Point",
  "track": "Track"
}

def get_child_and_kml_type(root):
  placemark = root.Document.Placemark
  for child in placemark.getchildren():
    for key in kml_types:
      if kml_types[key] in child.tag:
        return (child, kml_types[key])
  return false

def get_coordinates(root, node):
  tag = node.tag
  if kml_types["point"] in tag:
    coords =  [ (node.coordinates.text).split(",") ]
  elif kml_types["polygon"] in tag:
    coords = node.outerBoundaryIs.LinearRing.coordinates.text.strip().split()
  elif kml_types["track"] in tag:
    # https://lxml.de/objectify.html
    # https://lxml.de/api/lxml.etree._Element-class.html
    coords = []
    coord_strings = [ el for el in node.iter(gx_namespace + "coord") ]
    for coords_set in coord_strings:
      coords.append(",".join(coords_set.text.split()))
  elif kml_types["linestring"] in tag:
    return [ (node.coordinates.text).split() ]
  return json.dumps(coords)

def parse_kml_file(filename):
  f = open(join(abspath(dirpath), filename), "rb")
  kml_data = f.read()

  root = parser.fromstring(kml_data)
  placemark = root.Document.Placemark
  title = placemark.name.text
  child, kml_type = get_child_and_kml_type(root)

  coordinates = get_coordinates(root, child) if child is not None else ''

  data = (filename, title, kml_data, coordinates, kml_type)
  # print(data[0], data[1])
  return data

dirpath = './assets/kml';
file_paths = [f for f in listdir(dirpath) if isfile(join(dirpath, f)) and ".kml" in f]

file_content_for_db = map(parse_kml_file, file_paths)

connection = sqlite3.connect("/Users/ivy/gocta1");
connection.enable_load_extension(True)
connection.load_extension("/usr/local/Cellar/libspatialite/4.3.0a_8/lib/mod_spatialite.dylib")

connection.text_factory = str
cursor = connection.cursor()


# stmt = "INSERT INTO kml_data(kml_filename, kml_geometry) VALUES (?, GeomFromKML(?))"
stmt = "INSERT INTO kml(filename, title, raw_kml, coordinates, kml_type) VALUES (?, ?, ?, ?, ?)"
cursor.executemany(stmt, file_content_for_db)
# https://postgis.net/docs/ST_GeomFromKML.html
# https://stackoverflow.com/questions/26074069/using-pykml-to-parse-kml-document
connection.commit()
connection.close()
