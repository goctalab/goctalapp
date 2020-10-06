import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, Platform, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Asset } from 'expo-asset';
import { MapContext } from "@src/MapContextProvider";
import { KML_FIELDS } from "@data/dbUtils";

import MenuComponent from '@components/MenuComponent';
import MarkerComponent from '@components/MarkerComponent';
import { mapStyle_00 } from '../mapStyle';

import { processCoordinates, KML_TYPES } from '@src/kmlUtils';
import { mapOverlayCoordinates } from '@data/mapData'

import * as RootNavigation from '/src/RootNavigation';
import Icon from 'react-native-vector-icons/FontAwesome';
const menuIcon = <Icon name="bars" size={30} color="#FFF" />;

const logoResource = require("@assets/img/logo.png");
const logoURI = Asset.fromModule(logoResource).uri;

const mapOverlayRegion = mapOverlayCoordinates.map((coordObject) => {
  const { latitude, longitude } = coordObject;
  return [ latitude, longitude ];
});

const bldgOverlayResource = require("@assets/layers/rough_map_layer_edifcio-01.png");
const bldgOverlayURI = Asset.fromModule(bldgOverlayResource).uri;

const LAYER_TYPES = {
  Places: "Places", 
  Regions: "Regions", 
  Bldgs: "Bldgs",
  Paths: "Paths"
};
const layerMenuItems = Object.keys(LAYER_TYPES);

const arrayPlaces = [
  { name: "NE", coordinates: [{ latitude: -6.054429423257089, longitude: -77.89648004531624}]},
  { name: "NW", coordinates: [{ latitude: -6.054299248256771, longitude: -77.89811561864342}]},
  { name: "SW", coordinates: [{ latitude: -6.055420387530083, longitude: -77.89803066932026}]},
  { name: "SE", coordinates: [{ latitude: -6.055457543168768, longitude: -77.89663650604342}]},
];

export default MapViewContainer = function(props) {

  const [ layersDeselected, setLayersDeselected ] = useState([]);
  const [ mapData, setMapData ] = useState({ markers: [], polygons: [], polylines: []});
  const { mapData: allMapData } = useContext(MapContext);

  useEffect(() => {
    parseMapData(allMapData);
  }, [allMapData]);

  const getMapRegion = () => {
    return new MapView.AnimatedRegion({
      latitude: arrayPlaces[0].coordinates[0].latitude,
      longitude: arrayPlaces[0].coordinates[0].longitude,
      latitudeDelta: -0.001,
      longitudeDelta: -0.001
    })
  }

  const onMarkerPress = (e) => {
    console.log("on marker press:", e.target.title);
  }

  const onNavItemClicked = (kmlType, allSelectedOptions) => {
    // console.log(allSelectedOptions)
    setLayersDeselected(allSelectedOptions);
  }

  const isLayerShown = (layerType) => !layersDeselected.includes(layerType);

  const getInitialRegion = () => {
    return {
      latitude: -6.055,
      longitude: -77.8971,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }
  }

  const parseMapData = (mapData) => {
    if (!mapData || mapData.length === 0) {
      return;
    }
    const markerData = [],
      polygonData = [],
      polylineData = [];

    mapData.forEach((data, i) => {
      const object = { 
        name: data[KML_FIELDS.filename],
        coordinates: processCoordinates(data[KML_FIELDS.coordinates]),
        type: data[KML_FIELDS.type]
      };
      // const coords = JSON.parse(data.coordinates);
      if (data[KML_FIELDS.type] === KML_TYPES.Polygon) {
        polygonData.push(object);
      } else if (data[KML_FIELDS.type] === KML_TYPES.Point) {
         markerData.push(object);
      } else {
        polylineData.push(object); // KML_TYPE Polyline and Track
      }
    });
    setMapData({
      markers: markerData,
      polygons: polygonData,
      polylines: polylineData
    });
  }

  const renderMarkers = function(markerData=[]) {
    // arrayPlaces.concat(markerData)

    return (markerData).map((placeData, i) => {
      let imageIcon;
      // TODO redo marker images
      if (placeData.name === "+ALTO GLAB") {
        const assetResource = require("@assets/img/BNGLW1.png");
        imageIcon = Asset.fromModule(assetResource).uri;
      } else if (placeData.name === "012") {
        const assetResource = require("@assets/img/WSHP.png");
        imageIcon = Asset.fromModule(assetResource).uri;
      }
      if (imageIcon) {
        // debugger
      }
      return <MarkerComponent
        key={`${i}-${i}`}
        // pinColor={pinColors[i % pinColors.length]}
        pinColor="#FFC0C0"
        markerData={placeData}
        imageIcon={imageIcon}
      />
    });
  }

  const renderPolygons = function(polygonData=[]) {
    return (polygonData).map((polygonObj, i) => {
      if (i !== 1) { // TODO blocking other regions for now
        return;
      }
      return <MapView.Polygon
        key={`${i}-${i}`}
        title={polygonObj.name}
        coordinates={polygonObj.coordinates}
        fillColor={"rgba(0, 200, 0, 0.0)"}
        strokeColor="white"
        strokeWidth={2}
      />
    });
  }

  const renderPolylines = function(polylinesData=[]) {
    const fillColors = ["rgba(255, 255, 0, 0.85)", "rgba(173, 255, 47, 0.85)", "rgba(255, 255, 0, 0.85)"];

    return polylinesData.map((polylineObj, i) =>
      <MapView.Polyline
        key={`${i}-${i}`}
        coordinates={polylineObj.coordinates}
        fillColor={fillColors[i % fillColors.length]}
        strokeColor="rgba(0,0,0,0.5)"
        strokeWidth={3}
      />
    );
  }

  return (
    <View style={styles.viewContainer} >

      <Image style={styles.logo} source={require('@assets/img/logo.png')} />

      <TouchableOpacity 
        style={[ styles.flexRow, styles.menuControl ]}
        onPress={() => RootNavigation.openDrawer()}>
          { menuIcon }
      </TouchableOpacity>

      <MenuComponent
        onMenuOptionClicked={onNavItemClicked}
        menuOptions={layerMenuItems}
      />
      <MapView.Animated
        showsUserLocation
        followsUserLocation
        loadingEnabled
        provider={ PROVIDER_GOOGLE }
        // mapType="hybrid"
        mapType={Platform.OS == "android" ? "none" : "standard"}
        initialRegion={getInitialRegion()}
        region={getMapRegion()}
        style={styles.map} 
        customMapStyle={mapStyle_00}
        maxZoomLevel={21} // docs say 20
        ref={ref => {
          mapRef = ref;
        }}
        onMarkerPress={onMarkerPress} >

        { isLayerShown(LAYER_TYPES.Places) && 
          renderMarkers(mapData.markers) }
        { isLayerShown(LAYER_TYPES.Regions) && 
          renderPolygons(mapData.polygons) }
        { isLayerShown(LAYER_TYPES.Paths) && 
          renderPolylines(mapData.polylines) }
        { isLayerShown(LAYER_TYPES.Bldgs) && 
          <MapView.Overlay 
            image={bldgOverlayURI}
            bounds={mapOverlayRegion} /> }

      </MapView.Animated>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1
  },
  logo: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 25,
    right: 15,
    zIndex: 2,
    width: 50,
    height: 50,
    resizeMode: 'contain'
  },
  menuControl: {
    position: 'absolute',
    top: 20,
    left: 15,
    padding: 5,
    zIndex: 2
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  // noCallout: {
  //   backgroundColor: "transparent"
  // }
});
