import React, { Component } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
  
import MapView, {
  PROVIDER_GOOGLE,
  UrlTile,
  LocalTile,
  Marker,
  Polyline,
  Animated,
  AnimatedRegion,
  Overlay } from 'react-native-maps';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import haversine from 'haversine';
import { mapStyle1 } from './mapStyle';
import { Asset } from 'expo-asset';

//const tilesPath = `${docDir}/tiles/tiles/{z}_{x}_{y}.png`;
const imageTileResource = require("./tiles/tile01.png")
const imageURI = Asset.fromModule(imageTileResource).uri;


export default class MapViewContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: 0,
      longitude: 0,
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
      }
    }
  }

  calcDistance(newLatLon) {
    return haversine(this.state.prevLatLon, newLatLon) || 0;
  }

  getMapRegion = () => {
    // console.log(this.state);
    return new AnimatedRegion({
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    })
  }

  //https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
  componentDidMount() {
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

  render() {
    return (
      <MapView.Animated
        showsUserLocation
        followsUserLocation
        loadingEnabled
        // mapType="hybrid"
        // mapType={Platform.OS == "android" ? "none" : "standard"}
        // or initialRegion?
        region={this.getMapRegion()}
        provider={ PROVIDER_GOOGLE }
        style={styles.mapStyle} 
        customMapStyle={mapStyle1}
      >

      {/* <Polyline
        coordinates={this.state.routeCoordinates}
        strokeWidth={5}
        strokeColor="#FFF" />
      <Marker.Animated ref={ marker => { this.marker = marker; } }
        // coordinate={{ latitude: -16, longitude: -70 }}
        coordinate={ this.state.coordinate }
      /> */}
      {/* https://gitmemory.com/issue/react-native-community/react-native-maps/2088/471427151 */}
      {/* <UrlTile urlTemplate={imageURI} zIndex={-1}  /> */}

      <Overlay 
        image={imageURI}
        //image="https://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
        bounds={[[-6.05, -77.89],[-6.06, -77.92]]} />

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
