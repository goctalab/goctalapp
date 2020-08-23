import React, { Component } from 'react';
import { Dimensions, Platform, StyleSheet, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MenuComponent from './MenuComponent';
import placeInformation from './placesOfInterest';

import { mapStyle_00 } from './mapStyle';
import { Asset } from 'expo-asset';

import haversine from 'haversine';
import { getCoordinatesFromKMLPath, KML_TYPES } from './kmlUtils';
import KML_DATA from './mapData_processed';

//const tilesPath = `${docDir}/tiles/tiles/{z}_{x}_{y}.png`;
import { mapOverlayCoordinates } from './mapData';

const mapOverlayRegion = mapOverlayCoordinates.map((coordObject) => {
  const { latitude, longitude } = coordObject;
  return [ latitude, longitude ];
});

const dronePicOverlayResource = require("../assets/layers/rough_map_drone_foto_rotated-01.png");
const droneImageOverlayURI = Asset.fromModule(dronePicOverlayResource).uri;

const pathsOverlayResource = require("../assets/layers/rough_map_layer_paths-01.png");
const pathsOverlayURI = Asset.fromModule(pathsOverlayResource).uri;

const bldgOverlayResource = require("../assets/layers/rough_map_layer_edifcio-01.png");
const bldgOverlayURI = Asset.fromModule(bldgOverlayResource).uri;

const imageTileResource = require("../assets/tiles/tile01.png");
const imageURI = Asset.fromModule(imageTileResource).uri;

const layerMenuItems = Object.keys(KML_TYPES);

const arrayPlaces = [
  { name: "NE", coordinates: { latitude: -6.054429423257089, longitude: -77.89648004531624}},
  { name: "NW", coordinates: { latitude: -6.054299248256771, longitude: -77.89811561864342}},
  { name: "SW", coordinates: { latitude: -6.055420387530083, longitude: -77.89803066932026}},
  { name: "SE", coordinates: { latitude: -6.055457543168768, longitude: -77.89663650604342}},
];

export default class MapViewContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNavOpen: false,
      layersDeselected: [], 
      latitude: arrayPlaces[0].coordinates.latitude,
      longitude: arrayPlaces[0].coordinates.longitude,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLon: {},
      coordinate: {
        latitude: 0,
        longitude: 0,
      },
      polygons: [],
      markers: [],
      polylines: []
    }
    this.onNavClicked = this.onNavClicked.bind(this);
    this.onNavItemClicked = this.onNavItemClicked.bind(this);
  }

  calcDistance(newLatLon) {
    return haversine(this.state.prevLatLon, newLatLon) || 0;
  }

  getMapRegion = () => {
    // console.log(this.state);
    return new MapView.AnimatedRegion({
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: -0.001,
      longitudeDelta: -0.001
    })
  }

  onMarkerPress(e) {
    console.log('marker press', e.target.title);
  }

  onNavClicked() {
    const isNavOpen = !this.state.isNavOpen;
    this.setState({ isNavOpen });
  }

  onNavItemClicked(kmlType, shouldHide) {
    const layers = this.state.layersDeselected;
    if (!shouldHide) {
      const index = layers.indexOf(kmlType);
      layers.splice(index, 1);
    } else {
      layers.push(kmlType);
    }
    const layersDeselected = Array.from(new Set(layers));
    this.setState({ layersDeselected });
  }

  isLayerShown = (layerType) => !this.state.layersDeselected.includes(layerType);

  getInitialRegion = () => {
    return {
      latitude: -6.055,
      longitude: -77.8971,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }
  }

  async setKMLState() {
    const markerData = [],
      polygonData = [],
      polylineData = [],
      filenames = Object.keys(KML_DATA);

    await Promise.all(filenames.map(async (path) => {
      const asset = Asset.fromModule(path);
      const data = await getCoordinatesFromKMLPath(asset, path);
      if (data.type === KML_TYPES.Polygon) {
        polygonData.push(data);
      } else if (data.type === KML_TYPES.Point) {
         markerData.push(data);
      } else {
        polylineData.push(data); // KML_TYPE Polyline and Track
      }
    }));

    this.setState({ 
      markers: markerData,
      polygons: polygonData,
      polylines: polylineData
    });
  }


  //https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
  componentDidMount() {
    this.setKMLState();

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const {
          coordinate,
          routeCoordinates,
          distanceTravelled
        } = this.state;

        const {
          latitude,
          longitude
        } = position.coords;

        const newCoordinate = {
          latitude,
          longitude
        };

        if (Platform.OS === "android") {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(
              newCoordinate,
              500
            );
          } 
        } else {
          // coordinate.timing(newCoordinate).start();
        }

        this.setState({
          latitude,
          longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          distanceTravelled: distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLon: newCoordinate
        });
      },
      (err) => console.log(err),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

  //https://github.com/react-native-community/react-native-maps/pull/2011/files
  adjustMap = (e) => {
    // console.log("on kml ready", e.nativeEvent);
    this.map.fitToElements(true);
    return e.nativeEvent;
  }

  renderMarkers() {
    const pinColors = ["#FFC0C0", "#FF0000", "#00FF00", "#0000FF","#FFC0C0", "#FF0000", "#00FF00", "#0000FF", ];
    const markerData = arrayPlaces.concat(this.state.markers);
    const markers = (markerData).map((place, i) =>
      <MapView.Marker
        key={`${i}-${i}`}
        pinColor={pinColors[i % pinColors.length]}
        coordinate={place.coordinates}
        title={place.name}
        description="Testing"
      >
        <MapView.Callout tooltip>
          <View style={styles.callout}>
            <Text>{place.name}</Text>
            <Text>{ placeInformation[{place.name}]  Descriptions of some sort</Text>
          </View>
        </MapView.Callout>
      </MapView.Marker>
    );
    return markers;
  }

  renderPolygons() {
    const fillColors = ["rgba(0, 200, 0, 0.25)", "rgba(0, 0, 200, 0.25)", "rgba(100, 0, 100, 0.25)"];
    
    const polys = (this.state.polygons).map((polygonObj, i) =>
      <MapView.Polygon
        key={`${i}-${i}`}
        title={polygonObj.name}
        coordinates={polygonObj.coordinates}
        fillColor={fillColors[i % fillColors.length]}
        strokeColor="rgba(0,0,0,0.5)"
        strokeWidth={2}
      />
    );
    return polys;
  }

  renderPolylines() {
    const fillColors = ["rgba(255, 255, 0, 0.85)", "rgba(173, 255, 47, 0.85)", "rgba(255, 255, 0, 0.85)"];

    const polylines = (this.state.polylines).map((polylineObj, i) =>
      <MapView.Polyline
        key={`${i}-${i}`}
        coordinates={polylineObj.coordinates}
        fillColor={fillColors[i % fillColors.length]}
        strokeColor="rgba(0,0,0,0.5)"
        strokeWidth={3}
      />
    );
    return polylines;
  }

  render() {
    return (
      <View>
        <MapView.Animated
          showsUserLocation
          followsUserLocation
          loadingEnabled
          provider={ PROVIDER_GOOGLE }
          mapType="hybrid"
          // mapType={Platform.OS == "android" ? "none" : "standard"}
          initialRegion={this.getInitialRegion()}
          region={this.getMapRegion()}
          style={styles.mapStyle} 
          customMapStyle={mapStyle_00}
          maxZoomLevel={21} // docs say 20
          ref={ref => {
            this.map = ref;
          }}
          onMarkerPress={this.markerPressed}
        >
          { this.isLayerShown(KML_TYPES.Point) && 
            this.renderMarkers() }
          { this.isLayerShown(KML_TYPES.Polygon) && 
            this.renderPolygons() }
          { this.isLayerShown(KML_TYPES.Polyline) && 
            this.renderPolylines() }

          <MapView.Overlay 
            image={bldgOverlayURI}
            bounds={mapOverlayRegion} />
        </MapView.Animated>

        <MenuComponent
          onMenuClick={this.onNavClicked}
          onItemClicked={this.onNavItemClicked}
          selectedOptions={this.state.layersDeselected}
          menuOptions={layerMenuItems}
          isOpen={this.state.isNavOpen}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 50,
  },
  // noCallout: {
  //   backgroundColor: "transparent"
  // },
  callout: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5
  }
});
