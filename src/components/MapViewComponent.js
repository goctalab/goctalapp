import React, { useState, useContext, useEffect, useRef } from 'react';
import { Dimensions, Platform, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Asset } from 'expo-asset';
import { MapContext } from "@components/MapContextProvider";
import { PlacesContext } from "@components/PlacesContextProvider";
import * as RootNavigation from '@components/RootNavigation';

import MenuComponent from '@components/MenuComponent';
import MarkerComponent from '@components/MarkerComponent';
import PolygonCalloutComponent from '@components/PolygonCalloutComponent';

import { KML_FIELDS, PLACE_FIELDS } from "@data/dbUtils";
import { processCoordinates, KML_TYPES } from '@utils/kmlUtils';
import { mapStyle_00, colors } from '@utils/styleUtils';
import markerAssetsURI from '@src/mapMarkerAssetsURI';

import Icon from 'react-native-vector-icons/FontAwesome';
const menuIcon = <Icon name="bars" size={30} color="#FFF" />;

const logoResource = require("@assets/img/logo.png");
// const logoURI = Asset.fromModule(logoResource).uri;

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

// const ALTO_GLAB = { longitude: -77.89661099999999, latitude: -6.055215999999999 }
// const BATAN = { longitude: -77.89718338255179, latitude: -6.05487980193391 }
const CENTER_START_COORDINATES = { longitude: -77.89741388888889, latitude: -6.055380555555556 };
const DELTA = 0.0019;

export default MapViewContainer = function({ route }) {

  const params = route.params;

  const [ layersDeselected, setLayersDeselected ] = useState([]);
  const [ mapData, setMapData ] = useState({ markers: [], polygons: [], polylines: []});
  const { mapData: mapContextData } = useContext(MapContext);
  const { placesData: placesContextData } = useContext(PlacesContext);
  
  
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    parseMapData(mapContextData, placesContextData);
  }, [ mapContextData, placesContextData ]);

  useEffect(() => {
    if (params && params.selected_marker) {
      console.log('select this marker');
      openMarker(params.selected_marker);
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
        console.log("centering on user dot");
        centerMap(getRegionWithCoordinate(position.coords));
      }
    });
  }
  
  const getMapRegion = () => new MapView.AnimatedRegion(getInitialRegion());
 
  // TODO we need this?
  const onMarkerClick = (e) => {
    console.log("hello", e, e.nativeEvent);
    const item = e.nativeEvent;
    centerMap(getRegionWithCoordinate(item.coordinate));
  }

  const getRegionWithCoordinate = (coordinate) => {
    return {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: DELTA,
      longitudeDelta: DELTA,
    }
  };

  const openMarker = (selectedMarker) => {
    const marker = markersRef.current[selectedMarker];
    if (marker && marker.openCallout) {
      centerMap(getRegionWithCoordinate(marker.coordinate));
      marker.openCallout();
    }
  }

  const centerMap = (region) => {
    mapRef.current.animateToRegion(region, 300);
  } 

  const onMenuItemClicked = (allSelectedOptions) => {
    // console.log(allSelectedOptions)
    console.log("onMenuItemClicked", allSelectedOptions);
    setLayersDeselected(allSelectedOptions);
  }

  const isLayerShown = (layerType) => {
    debugger
    const isLayerShown = !layersDeselected.includes(layerType);
    console.log(layerType, "shown ?", isLayerShown);
    return isLayerShown;
  }

  // TODO do we need this?
  const getInitialRegion = () => {
    return {
      latitude: CENTER_START_COORDINATES.latitude,
      longitude: CENTER_START_COORDINATES.longitude,
      latitudeDelta: DELTA,
      longitudeDelta: DELTA
    }
  }

  const parseMapData = (mapData=[], placesData=[]) => {
    const markerData = [],
      polygonData = [],
      polylineData = [];

    mapData.forEach((data) => {
      
      // see if there is a place description entry for our thing
      const placeData = (placesData.find((place) => place[PLACE_FIELDS.filename] === data[KML_FIELDS.filename]))
        || {};
      
      const mapObject = { 
        [KML_FIELDS.filename]: data[KML_FIELDS.filename],
        coordinates: processCoordinates(data[KML_FIELDS.coordinates]),
        type: data[KML_FIELDS.type],
        placeData
      };

      if (data[KML_FIELDS.type] === KML_TYPES.Polygon) {
        polygonData.push(mapObject);
      } else if (data[KML_FIELDS.type] === KML_TYPES.Point) {
        //const markerObject = { ...mapObject, ...placeData }; 
        markerData.push(mapObject);
      } else {
        polylineData.push(mapObject); // KML_TYPE Polyline and Track
      }
    });
    setMapData({
      markers: markerData,
      polygons: polygonData,
      polylines: polylineData
    });
  }

  const renderMarkers = function(markerData=[]) {
    return (markerData).map((data, i) => {
      const filename = data[KML_FIELDS.filename];
      const getIcon = markerAssetsURI[filename] || markerAssetsURI.defaultMarker;
      const icon = getIcon();

      return <MarkerComponent
        key={`${i}-${i}`}
        // pinColor={pinColors[i % pinColors.length]}
        pinColor="#FFC0C0"
        markerData={data}
        imageIcon={icon}
        ref={(ref) => markersRef.current[filename] = ref} // store in ref to access by filename and open
      />
    });
    
  }

  const renderPolygons = function(polygonData=[]) {
    return (polygonData).map((polygonObj, i) => {

      if (Object.keys(polygonObj.placeData).length) {
        return <PolygonCalloutComponent
          key={`${i}-${i}`}
          polygonData={polygonObj}
          fillColor={mapColors[polygonObj.filename] || mapColors.polygon.fillColor}
          strokeWidth={2}
          strokeColor={colors["Liver Dogs"]}
          // zIndex={1}
          // onPress={(e) => console.log(e, e.nativeEvent, "press region")}
        />
      }
      return <MapView.Polygon
        key={`${i}-${i}`}
        title={polygonObj.name}
        coordinates={polygonObj.coordinates}
        fillColor={mapColors[polygonObj.filename] || mapColors.polygon.fillColor}
        strokeWidth={0}
        tappable={true}
        // zIndex={1}
        onPress={(e) => console.log(e, e.nativeEvent, "press region")}
      />
    });
  }

  const renderPolylines = function(polylinesData=[]) {
    return polylinesData.map((polyline, i) => {
      return <MapView.Polyline
        key={`${i}-${i}`}
        coordinates={polyline.coordinates}
        strokeColor={mapColors.paths.strokeColor}
        strokeWidth={mapColors.paths.strokeWidth}
        zIndex={10}
        // lineJoin="meter"
        // lineCap="butt"
        // meterLimit="5"
        // zIndex={2}
      />
    }
    );
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
      {/* <MapView.Animated
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
        ref={mapRef}
        onMarkerPress={onMarkerClick} ></MapView.Animated> */}
      <MapView.Animated
        showsUserLocation
        followsUserLocation
        loadingEnabled
        showsMyLocationButton
        provider={PROVIDER_GOOGLE}
        // mapType="hybrid"
        mapType={Platform.OS == "android" ? "none" : "standard"}
        initialRegion={getInitialRegion()}
        region={getMapRegion()}
        style={styles.map} 
        customMapStyle={mapStyle_00}
        maxZoomLevel={21} // docs say 20
        ref={mapRef}
        zIndex={0} // necessary for Android
        onMarkerPress={onMarkerClick} >

        { isLayerShown(LAYER_TYPES.Regions) && 
          renderPolygons(mapData.polygons) } 
        { isLayerShown(LAYER_TYPES.Bldgs) && 
          <MapView.Overlay 
            image={bldgOverlayURI}
            bounds={mapOverlayRegion}
            // style={{ position: 'absolute', zIndex: 25 }} // , zIndex: '5'
            // zIndex={13} no z index seems to work on apple
          /> }
        { isLayerShown(LAYER_TYPES.Paths) && 
          renderPolylines(mapData.polylines) }
        
        { isLayerShown(LAYER_TYPES.Places) && 
          renderMarkers(mapData.markers) }
        
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


const mapColors = {
  polygon: {
    fillColor: colors["May Green"]
  },
  "PozoBirding.kml": colors["Middle Blue"],
  "Crops.kml": colors["Android Green"],
  "Andenes.kml": colors["Dark Olive Green"],
  paths: {
    strokeColor: 'rgba(242,232,207,.5)',
    strokeWidth: 3
  }
}