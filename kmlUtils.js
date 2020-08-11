import { Asset } from 'expo-asset';
import xml2js from 'react-native-xml2js';
import * as FileSystem from 'expo-file-system';

const klms = {
  "./assets/kml/GLperimetro.kml": require("./assets/kml/GLperimetro.kml")
}

const _findDoc = (xmlJson) => xmlJson.kml.Document[0];

// const _localUri = (path) => Asset.fromModule(require(path)).localUri;

async function getLocalUri(path) {
  let localUri;
  await Asset.loadAsync(klms[path]);
  const asset = Asset.fromModule(klms[path]);
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

export function readKML(data) {
  let coordinates = [];
  xml2js.parseString(data, (err, result) => {
    if (!err) {
      const kmlJson = JSON.parse(JSON.stringify(result));
      coordinates = processCoordinates(kmlJson);
    }
  });
  return coordinates;
}

function processCoordinates(xmlJson) {
  let coordsStr = _findDoc(xmlJson).Placemark[0].Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates;
  
  if (!coordsStr) {
    return [];
  }

  coordsStr = coordsStr[0].trim().split(" ");

  const c =  coordsStr.reduce((coordinatesArr, currentStr) => {
    const coords = currentStr.split(","); 
    coordinatesArr.push({
      latitude: parseFloat(coords[1]),
      longitude: parseFloat(coords[0]) // ignore z coord...
    });
    return coordinatesArr;
  }, []);
  console.log(c);
  return c;
}
