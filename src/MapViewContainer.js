import React, { Component } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { mapStyle_00 } from './mapStyle';
import { Asset } from 'expo-asset';

import haversine from 'haversine';
import { getCoordinatesFromKMLPath, KML_TYPES } from './kmlUtils';
import KML_DATA from './mapData_processed';

//const tilesPath = `${docDir}/tiles/tiles/{z}_{x}_{y}.png`;
const imageTileResource = require("../assets/tiles/tile01.png");
const imageURI = Asset.fromModule(imageTileResource).uri;


const arrayPlaces = [
  { name: "NE", coordinates: { latitude: -6.054429423257089, longitude: -77.89648004531624}},
  { name: "NW", coordinates: { latitude: -6.054299248256771, longitude: -77.89811561864342}},
  { name: "SW", coordinates: { latitude: -6.055420387530083, longitude: -77.89803066932026}},
  { name: "SE", coordinates: { latitude: -6.055457543168768, longitude: -77.89663650604342}},
];

export default class MapViewContainer extends Component {
  constructor(props) {
    super(props);

    // this.onKmlReady = this.onKmlReady.bind(this);
    // this.readXml = this.readXml.bind(this);

    this.state = {
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
      markers: []
    }
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
      filenames = Object.keys(KML_DATA);

    await Promise.all(filenames.map(async (path) => {
      const asset = Asset.fromModule(path);
      const data = await getCoordinatesFromKMLPath(asset, path);
      data.type === KML_TYPES.Polygon ? polygonData.push(data) : markerData.push(data)
    }));

    this.setState({ markers: markerData, polygons: polygonData });
  }

  async setMarkers() {
    // open asset directory and get files
    // file by file
    const path = "./assets/kml/TNQ1alto2ha.kml";
    const asset = Asset.fromModule(path);
    const markerData = await getCoordinatesFromKMLPath(asset, path);
    this.setState({ markers: [ markerData ] });
  }

  async setPolygons() {
    const path = "./assets/kml/GLperimetro.kml";
    const asset = Asset.fromModule(path);
    const polygonData = await getCoordinatesFromKMLPath(asset, path);
    this.setState({ polygons: [ polygonData ] });
  }

  //https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
  componentDidMount() {

    // this.setMarkers();
    // this.setPolygons();
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

  render() {
    return (
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
      >
        {this.renderMarkers()}
        {this.renderPolygons()}
        {/* <MapView.Marker.Animated ref={ marker => { this.marker = marker; } }
          // coordinate={{ latitude: -16, longitude: -70 }}
          coordinate={ { latitude: -6.0, longitude: -77.89 } } /> */}
        {/* <MapView.Polyline
          coordinates={this.state.routeCoordinates}
          strokeWidth={5}
          strokeColor="#FFF" />
        /> */}
        {/* https://gitmemory.com/issue/react-native-community/react-native-maps/2088/471427151 */}
        {/* <UrlTile urlTemplate={imageURI} zIndex={-1}  /> */}
        {/* <MapView.Overlay 
          image={imageURI}
          //image="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
          bounds={[[-6.0, -77.89],[-6.06, -77.92]]} /> */}
      </MapView.Animated>);
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  }
});
