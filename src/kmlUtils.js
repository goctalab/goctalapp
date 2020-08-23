import { Asset } from 'expo-asset';
import xml2js from 'react-native-xml2js';
import * as FileSystem from 'expo-file-system';

const KML_INVALID_TYPE = "Invalid";

export const KML_TYPES = {
  Polygon: "Polygon",
  Point: "Point",
  Polyline: "Polyine",
  Track: "Track"
};

const _findDoc = (kmlJson) => kmlJson.kml.Document[0];

async function getLocalUri(path) {
  let localUri;
  await Asset.loadAsync(KML_DATA[path]);
  const asset = Asset.fromModule(KML_DATA[path]);
  localUri = asset.localUri;
  return localUri;
};

export const getCoordinatesFromKMLPath = async function(asset, path) {
  let localUri = asset.localUri || await getLocalUri(path);
  if (!localUri) {
    return [];
  }
  return getCoordinatesFromKMLAsset(localUri);
}

async function getCoordinatesFromKMLAsset(localUri) {
  const data = await FileSystem.readAsStringAsync(localUri);
  return readKML(data);
}

const getKMLType= (kmlJson) => {
  const Document = _findDoc(kmlJson);

  let kmlType = KML_INVALID_TYPE;

  if (Document.Placemark) {
    if (Document.Placemark[0].Polygon) {
      kmlType = KML_TYPES.Polygon;
    } else if (Document.Placemark[0].LineString) {
      kmlType = KML_TYPES.Polyline;
    } else if (Document.Placemark[0].Point) {
      kmlType = KML_TYPES.Point;
    } else if (Document.Placemark[0]['gx:Track']) {
      kmlType = KML_TYPES.Track;
    }
  } else {
    console.log("no Placemark found in KML", kmlJson);
  }
  return kmlType;
}

const getCoordinatesField = (kmlJson, type) => {
  const placemark = _findDoc(kmlJson).Placemark[0];
  switch (type) {
    case KML_TYPES.Polygon:
      return placemark.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0];
    case KML_TYPES.Point:
      return placemark.Point[0].coordinates[0];
    case KML_TYPES.Polyline:
      return placemark.LineString[0].coordinates[0];
    case KML_TYPES.Track:
      const gxCoordArray = placemark['gx:Track'][0]['gx:coord'];
      return gxCoordArray.map((val) => val.split(" ").join(",")).join(" ");
    default:
      return "";
  }
}

export function readKML(data) {
  let coordinates = [], name, type;
  xml2js.parseString(data, (err, result) => {
    if (!err) {
      const kmlJson = JSON.parse(JSON.stringify(result));
      type = getKMLType(kmlJson); // yo
      name =  _findDoc(kmlJson).Placemark[0].name[0];
      coordinates = processCoordinates(getCoordinatesField(kmlJson, type));
    }
  });
  return {
    name,
    type,
    coordinates: (type === KML_TYPES.Point) ? coordinates[0] : coordinates
  }
}

function processCoordinates(coordinatesField) {
  if (!coordinatesField) {
    return [];
  }
  coordsStr = coordinatesField.trim().split(" ");

  const c =  coordsStr.reduce((coordinatesArr, currentStr) => {
    const coords = currentStr.split(","); 
    coordinatesArr.push({
      latitude: parseFloat(coords[1]),
      longitude: parseFloat(coords[0]) // ignore z coord...
    });
    return coordinatesArr;
  }, []);
  return c;
}
