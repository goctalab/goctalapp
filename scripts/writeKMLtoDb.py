from os import listdir
from os.path import isfile, join, abspath, dirname, expanduser
import sqlite3
from pykml import parser
import pdb
import json
import argparse

parser = argparse.ArgumentParser(description='Import csv data into the db.')
parser.add_argument('kml_dirpath', metavar='D', type=str,
                   help='a path to the folder with kml files')
parser.add_argument('--db', type=str,
                   help='location of the db file')

args = parser.parse_args()

DATA_TABLE = 'kml';
dirpath = args.kml_dirpath;
DB = args.db if args.db else expanduser('~/gocta1.db');

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

def drop_create_table(cursor):
  stmt = "DROP TABLE IF EXISTS {}".format(DATA_TABLE)
  cursor.execute(stmt)
  cursor.execute("CREATE TABLE kml(filename varchar(50), title varchar(100), raw_kml varchar(10000), coordinates varchar(10000), kml_type varchar(30));

if not path.exists(dirpath):
  print("kml directory doesn't exist");
  sys.exit()

connection = sqlite3.connect(DB);
# connection.enable_load_extension(True)
# connection.load_extension("/usr/local/Cellar/libspatialite/4.3.0a_8/lib/mod_spatialite.dylib")

connection.text_factory = str
cursor = connection.cursor()

resp = raw_input("Would you like to CLEAR ALL previous data in the table first? YES/n");
if resp == "YES":
  drop_create_table(cursor)

file_paths = [f for f in listdir(dirpath) if isfile(join(dirpath, f)) and ".kml" in f]
file_content_for_db = map(parse_kml_file, file_paths)
# stmt = "INSERT INTO kml_data(kml_filename, kml_geometry) VALUES (?, GeomFromKML(?))"
stmt = "INSERT INTO kml(filename, title, raw_kml, coordinates, kml_type) VALUES (?, ?, ?, ?, ?)"
cursor.executemany(stmt, file_content_for_db)
# https://postgis.net/docs/ST_GeomFromKML.html
# https://stackoverflow.com/questions/26074069/using-pykml-to-parse-kml-document

connection.commit()
connection.close()
print("Done");
sys.exit()
