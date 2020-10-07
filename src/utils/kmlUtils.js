import { Asset } from 'expo-asset';
import xml2js from 'react-native-xml2js';
import * as FileSystem from 'expo-file-system';

const KML_INVALID_TYPE = "Invalid";

export const KML_TYPES = {
  Polygon: "Polygon",
  Point: "Point",
  Polyline: "Polyline",
  Track: "Track"
};

const _findDoc = (kmlJson) => kmlJson.kml.Document[0];

/**
* @param String path of the resource
* @description loads the asset in the app
* @return localUri of asset
* @unused
*/
async function _getLocalUri(path) {
  let localUri;
  await Asset.loadAsync(KML_DATA[path]);
  const asset = Asset.fromModule(KML_DATA[path]);
  localUri = asset.localUri;
  return localUri;
};

/**
* @description loads the kml asset at the particular path and returns the
* coordinates, if localUri isnt present, gets the localUrl
* @param Object asset asset - for expo, could be unloaded
* @param String path - path where the asset lives
* @return Object { coordinates, type }
* @unused
*/

export const getCoordinatesFromKMLPath = async function(asset, path) {
  let localUri = asset.localUri || await _getLocalUri(path);
  if (!localUri) {
    return [];
  }
  return _readKMLAsset(localUri);
}

/**
* @description reads the file async from local uri and processes the kml
* @param String localUri - uri where the kml asset lives in the app
* @return Object { coordinates, type }
* @unused
*/
async function _readKMLAsset(localUri) {
  const data = await FileSystem.readAsStringAsync(localUri);
  return readKML(data);
}

/**
* @description gets the KML_TYPE of the json to classify in the app
* @param json - json of the kml file 
* @return KML_TYPE
* @unused
*/
const getKMLType = (kmlJson) => {
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

/**
* @description finds the coordinates file of the json based on type
* @param kmlJson
* @param type KML_TYPE
* @returns the field in the json where the coordinates live
* @unused
*/
const _getCoordinatesField = (kmlJson, type) => {
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

/**
* @description gets the type name and coordinates of the kml data
*   and returns it in an object
* @param data - file data from readAsync
* @return { name, type, coordinates }
* @unused
*/
export function readKML(data) {
  let coordinates = [], name, type;
  xml2js.parseString(data, (err, result) => {
    if (!err) {
      const kmlJson = JSON.parse(JSON.stringify(result));
      type = getKMLType(kmlJson); // yo
      name =  _findDoc(kmlJson).Placemark[0].name[0];
      coordinates = processCoordinates(_getCoordinatesField(kmlJson, type));
    }
  });
  return {
    name,
    type,
    coordinates: (type === KML_TYPES.Point) ? coordinates[0] : coordinates
  }
}

/**
 * @desciption given coordinate field from database, parses them into
 * an array of coordinate arrays
 * @param {String} coordinatesString json from db
 */
export function processCoordinates(coordinatesString) {
  const cArray = JSON.parse(coordinatesString);
  const allCoordinatesObjects = cArray.reduce((coordinatesArr, el) => {
    let coords = el;
    if (typeof(el) !== typeof([])) {
      coords = el.split(",");
    }
    coordinatesArr.push({
      latitude: parseFloat(coords[1]),
      longitude: parseFloat(coords[0]) // ignore z coord...
    });
    return coordinatesArr;
  }, []);
  return allCoordinatesObjects;
}
