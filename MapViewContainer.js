import React, { Component } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { mapStyle1 } from './mapStyle';
import { Asset } from 'expo-asset';

import haversine from 'haversine';
import { getCoordinatesFromKMLPath } from './kmlUtils';

//const tilesPath = `${docDir}/tiles/tiles/{z}_{x}_{y}.png`;
const imageTileResource = require("./assets/tiles/tile01.png");
const imageURI = Asset.fromModule(imageTileResource).uri;

// const parser = new xml2js.Parser();

// const KML_FILE = 'file:///Users/ivy/Projects/Gocta/app/goctalapp/tiles/GLperimetro.kml';
// const KML_FILE = "https://pastebin.com/raw/2KqceR7N";


const arrayPlaces = [
  { name: "NE", coordinate: { latitude: -6.054429423257089, longitude: -77.89648004531624}},
  { name: "NW", coordinate: { latitude: -6.054299248256771, longitude: -77.89811561864342}},
  { name: "SW", coordinate: { latitude: -6.055420387530083, longitude: -77.89803066932026}},
  { name: "SE", coordinate: { latitude: -6.055457543168768, longitude: -77.89663650604342}},
];

// const polygonCoords = arrayPlaces.map((p) => p.coordinate);
const polygonCoords = [
  { latitude: -6.05569, longitude: -77.8971846},
  { latitude: -6.05559, longitude: -77.8971846},
  { latitude: -6.05569, longitude: -77.8971846},
  { latitude: -6.05559, longitude: -77.8971846},
]
const polygonCoordsLarge = [
  { latitude: 0, longitude: 20},
  { latitude: 0, longitude: 0},
  { latitude: 20, longitude: 0},
  { latitude: 20, longitude: 20},
];

export default class MapViewContainer extends Component {
  constructor(props) {
    super(props);

    // this.onKmlReady = this.onKmlReady.bind(this);
    // this.readXml = this.readXml.bind(this);

    this.state = {
      latitude: arrayPlaces[0].coordinate.latitude,
      longitude: arrayPlaces[0].coordinate.longitude,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLon: {},
      // coordinate: new AnimatedRegion({
      //   latitude: 0,
      //   longitude: 0,
      // })
      coordinate: {
        latitude: 0,
        longitude: 0,
      },
      polygonCoords: []
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

  async setPolygonCoordinates() {
    const path = "./assets/kml/GLperimetro.kml";
    const asset = Asset.fromModule(path);
    const polygonCoords = await getCoordinatesFromKMLPath(asset, path);
    this.setState({ polygonCoords });
  }

  //https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
  componentDidMount() {

    this.setPolygonCoordinates();

    // const kml = reader.parseSync(kmlResource);
    // const xq = XmlQuery(kml);
    // const coordinates = xq.find('Placemark').find('Point').find('coordinates');
    // console.log("coords xml", coordinates);
    //const xml = new XMLParser().parseFromString(kmlAsset);

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

  getPolygonCoords() {
    console.log(this.state.polygonCoords);
    return this.state.polygonCoords;
  }

  mapMarkers() {
    const pinColors = ["#FFC0C0", "#FF0000", "#00FF00", "#0000FF"];
    const markers = (arrayPlaces).map((place, i) =>
      <MapView.Marker
        key={`${i}-${i}`}
        pinColor={pinColors[i]}
        coordinate={place.coordinate}
        title={place.name}
        description="Testing"
      >
      </MapView.Marker>
    );
    return markers;
  }

  render() {
    return (
      <MapView.Animated
        showsUserLocation
        followsUserLocation
        loadingEnabled
        mapType="hybrid"
        // mapType={Platform.OS == "android" ? "none" : "standard"}
        // or initialRegion?
        ref={ref => {
          this.map = ref;
        }}
        // region={this.getMapRegion()}
        initialRegion={this.getInitialRegion()}
        // kmlSrc={KML_FILE}
        // onKmlReady={this.adjustMap}
        provider={ PROVIDER_GOOGLE }
        style={styles.mapStyle} 
        customMapStyle={mapStyle1}
        maxZoomLevel={20}
      >
        {this.mapMarkers()}
        <MapView.Polygon
          coordinates={this.getPolygonCoords()}
          fillColor="rgba(0, 200, 0, 0.5)"
          strokeColor="rgba(0,0,0,0.5)"
          strokeWidth={2}
        />
         <MapView.Polygon
          coordinates={polygonCoordsLarge}
          fillColor="rgba(0, 200, 0, 0.5)"
          strokeColor="rgba(0,0,0,0.5)"
          strokeWidth={2}
        />
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
    </MapView.Animated>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  }
});
