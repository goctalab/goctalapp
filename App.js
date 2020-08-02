import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View, TouchableOpacity, Switch, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, Animated, AnimatedRegion } from 'react-native-maps';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import haversine from 'haversine';

export default class App extends Component  {
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
    console.log(this.state);
    return new AnimatedRegion({
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    })
  }

  async askPermissions() {
    const { status, expires, permissions } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    if (status !== 'granted') {
      alert('Hey! You have not enabled selected permissions');
    }
  }

  //https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
  componentDidMount() {
    this.askPermissions();

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
            // this.marker._component.animateMarkerToCoordinate(
            //   newCoordinate,
            //   500
            // );
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
    console.log("yoooo", this.state.coordinate);
    return (
      <View style={styles.container}>
        <Text>GoctaLapp</Text>
        <StatusBar style="auto" />
        <MapView.Animated
          showsUserLocation
          followsUserLocation
          loadingEnabled
          mapType="hybrid"
          // or initialRegion?
          region={this.getMapRegion()}
          provider={PROVIDER_GOOGLE}
          style={styles.mapStyle} 
        >
          <Polyline
            coordinates={this.state.routeCoordinates}
            strokeWidth={5}
            strokeColor="#FFF" />
          <Marker.Animated ref={ marker => { this.marker = marker; } }
            // coordinate={{ latitude: -16, longitude: -70 }}
            coordinate={ this.state.coordinate }
          />
        </MapView.Animated>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  }
});
