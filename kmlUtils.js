import { Asset } from 'expo-asset';
import xml2js from 'react-native-xml2js';
import * as FileSystem from 'expo-file-system';
import KML_Data from './mapData_processed';

export const KML_TYPES = {
  Polygon: "Polygon",
  Point: "Point"
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
  if (!_findDoc(kmlJson).Placemark){
    console.log("this wasnt valid", kmlJson);
    return "NOPE";
  }

  return (_findDoc(kmlJson).Placemark && _findDoc(kmlJson).Placemark[0].Polygon) ? KML_TYPES.Polygon : KML_TYPES.Point;
}

const getCoordinatesField = (kmlJson) => _findDoc(kmlJson).Placemark[0].Polygon ?
  _findDoc(kmlJson).Placemark[0].Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0] :
  _findDoc(kmlJson).Placemark[0].Point[0].coordinates[0];

export function readKML(data) {
  let coordinates = [], name, type;
  xml2js.parseString(data, (err, result) => {
    if (!err) {
      const kmlJson = JSON.parse(JSON.stringify(result));
      type = getKMLType(kmlJson); // yo
      name =  _findDoc(kmlJson).Placemark[0].name[0];
      coordinates = processCoordinates(getCoordinatesField(kmlJson));
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
