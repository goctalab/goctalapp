const defaultAssetExts = require("metro-config/src/defaults/defaults").assetExts;

// https://stackoverflow.com/questions/55484740/how-to-append-extension-in-metro-config-js-for-metro-bundler
module.exports = {
    resolver: {
        assetExts: [
            ...defaultAssetExts,
            'kml',
            'xml',
            'db'
        ]
    }
};
