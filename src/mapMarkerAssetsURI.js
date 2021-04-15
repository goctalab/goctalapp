import { Asset } from 'expo-asset';

export default {
  "Deck.kml": () => {
    const assetResource = require("@assets/img/mapMarkers/deck.png");
    const defaultIconUri = Asset.fromModule(assetResource).uri;
    return { default: assetResource, selected: assetResource };
  },
  "succulentgarden.kml": () => {
    const assetResource = require("@assets/img/mapMarkers/suculentas.png");
    const defaultIconUri = Asset.fromModule(assetResource).uri;
    return { default: assetResource, selected: assetResource };
  },
  "alto_glab.kml": () => {
    const assetResource = require("@assets/img/mapMarkers/alto_glab.png");
    const defaultIconUri = Asset.fromModule(assetResource).uri;
    return { default: assetResource, selected: assetResource };
  },
  "taller.kml": () => {
    const assetResource = require("@assets/img/mapMarkers/taller.png");
    // const defaultIconUri = Asset.fromModule(assetResource).uri;
    return { default: assetResource, selected: assetResource };
  },
  "defaultMarker": () => {
    const assetResource = require("@assets/img/mapMarkers/snake_eye_marker_dark.png");
    const selectedAssetResource = require("@assets/img/mapMarkers/snake_eye_marker.png");
    return { default: assetResource, selected: selectedAssetResource };
  },
  "empty": () => {
    const assetResource = require("@assets/img/mapMarkers/empty.png");
    return assetResource;
  }
}
