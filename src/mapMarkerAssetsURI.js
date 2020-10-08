import { Asset } from 'expo-asset';

export default {
  "alto_glab.kml": () => {
    const assetResource = require("@assets/img/mapMarkers/alto_glab.png");
    return  Asset.fromModule(assetResource).uri;
  },
  "taller.kml": () => {
    const assetResource = require("@assets/img/mapMarkers/taller.png");
    return Asset.fromModule(assetResource).uri;
  },
  "defaultMarker": () => {
    const assetResource = require("@assets/img/mapMarkers/snake_eye_marker.png");
    return Asset.fromModule(assetResource).uri;
  }
}
