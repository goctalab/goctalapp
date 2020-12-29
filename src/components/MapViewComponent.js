import React, { useState, useContext, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useMapContext, MapContext } from "@components/MapContextProvider";
import { PlacesContext } from "@components/PlacesContextProvider";
import * as RootNavigation from '@components/RootNavigation';
import MenuComponent from '@components/MenuComponent';
import { mapStyle, mapStyle_00, colors } from '@utils/styleUtils';

import * as MapViewInteractions from "@components/MapView/Interactions";
import * as MapViewLayers from "@components/MapView/Layers";

import { selectedMarkerParam } from '@components/DetailViewComponent';

const menuIcon = <Icon name="bars" size={30} color="#FFF" />;

const mapOverlayCoordinates = [
  { 
    longitude: -77.89770174815041,
    latitude: -6.054473497588077 + .00001 // adjustar un poco
  },
  { 
    longitude: -77.89645032241788,
    latitude: -6.055485813090427
  }
];

// const mapOverlayRegion = mapOverlayCoordinates.map((coordObject) => {
//   const { latitude, longitude } = coordObject;
//   return [ latitude, longitude ];
// });

const bldgOverlayResource = require("@assets/layers/rough_map_layer_edifcio-01.png");
// const bldgOverlayURI = Asset.fromModule(bldgOverlayResource).uri;

const LAYER_TYPES = {
  Places: "Places", 
  Regions: "Regions", 
  // Bldgs: "Bldgs",
  Paths: "Paths"
};
const layerMenuItems = Object.keys(LAYER_TYPES);

// const ALTO_GLAB = { longitude: -77.89661099999999, latitude: -6.055215999999999 }
// const BATAN = { longitude: -77.89718338255179, latitude: -6.05487980193391 }
const CENTER_START_COORDINATES = { longitude: -77.89741388888889, latitude: -6.055380555555556 };
const DELTA = 0.0019;


const getRegionWithCoordinate = (coordinate) => {
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    latitudeDelta: DELTA,
    longitudeDelta: DELTA,
  }
};

export default function({ route, navigation }) {
  const params = route.params;
  // console.log("RENDERING MAP WITH ROUTE", route);

  const { mapData: mapContextData } = useMapContext();
  // const { mapData: mapContextData } = useContext(MapContext);
  
  const { placesData: placesContextData } = useContext(PlacesContext);

  const [ layersDeselected, setLayersDeselected ] = useState([]);
  const [ mapData, setMapData ] = useState({ markers: [], polygons: [], polylines: []});
  const [ selectedMapItem, setSelectedMapItem ] = useState(null);
  
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // console.log("going to call parse with", mapContextData);
    const data = MapViewInteractions.parseMapData(mapContextData, placesContextData);
    setMapData(data);
  }, [ mapContextData, placesContextData ]);

  useEffect(() => {
    if (params && params[selectedMarkerParam]) {
      MapViewInteractions.openMarker(params.selected_marker, markersRef);
    }
  }, [ params ]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      console.log("getCurrentLocation");
      navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
    });
  };

  const resetUserLocation = () => {
    return getCurrentLocation().then(position => {
      if (position) {
        MapViewInteractions.centerMap(getRegionWithCoordinate(position.coords), mapRef);
      }
    });
  }
 
  const onMapItemClick = (e, mapItemData) => {
    setSelectedMapItem(mapItemData);
    // console.log(mapItemData, mapItemData.coordinates[0]);
    MapViewInteractions.centerMap(getRegionWithCoordinate(mapItemData.coordinates[0]), mapRef);
  }  

  const onMenuItemClicked = (allSelectedOptions) => {
    // console.log("onMenuItemClicked", allSelectedOptions);
    setLayersDeselected(allSelectedOptions);
  }
      
  const isLayerShown = (layerType) => !layersDeselected.includes(layerType);

  // TODO do we need this?
  const getInitialRegion = () => {
    return {
      latitude: CENTER_START_COORDINATES.latitude,
      longitude: CENTER_START_COORDINATES.longitude,
      latitudeDelta: DELTA,
      longitudeDelta: DELTA
    }
  }

  return (
    <View style={styles.viewContainer} >
      <TouchableOpacity style={styles.logoBtn} 
        onPress={resetUserLocation}>
        <Image 
          style={styles.logo}
          source={require('@assets/img/logo.png')}
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[ styles.flexRow, styles.drawerControl ]}
        onPress={() => RootNavigation.openDrawer()}>
          { menuIcon }
      </TouchableOpacity>

      <MenuComponent
        onMenuOptionClicked={onMenuItemClicked}
        menuOptions={layerMenuItems}
      />
      <MapView.Animated
        showsUserLocation
        followsUserLocation
        loadingEnabled
        showsMyLocationButton
        provider={PROVIDER_GOOGLE}
        mapType="hybrid"
        // mapType={Platform.OS == "android" ? "standard" : "standard"}
        initialRegion={getInitialRegion()}
        style={styles.map} 
        customMapStyle={mapStyle_00}
        maxZoomLevel={21} // docs say 20
        ref={mapRef}
        zIndex={0} // necessary for Android
      >

        { isLayerShown(LAYER_TYPES.Regions) && 
          MapViewLayers.renderPolygons(mapData.polygons) } 
        {/* { true && 
          <MapView.Overlay 
            image={bldgOverlayURI}
            bounds={mapOverlayRegion}
            // style={{ position: 'absolute', zIndex: 25 }} // , zIndex: '5'
            // zIndex={13} no z index seems to work on apple
          /> } */}
        { isLayerShown(LAYER_TYPES.Paths) && 
          MapViewLayers.renderPolylines(mapData.polylines) }
        
        { isLayerShown(LAYER_TYPES.Places) && 
          MapViewLayers.renderMarkers(mapData.markers, markersRef, selectedMapItem, onMapItemClick) }
        
      </MapView.Animated>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1
  },
  logoBtn: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 25,
    right: 15,
    zIndex: 2,
  },
  logo: {
    backgroundColor: 'transparent',
    width: 50,
    height: 50,
    resizeMode: 'contain'
  },
  drawerControl: {
    position: 'absolute',
    top: 20,
    left: 15,
    padding: 5,
    zIndex: 2
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  // noCallout: {
  //   backgroundColor: "transparent"
  // }
});

