import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View} from 'react-native';
import MapViewContainer from './components/MapViewContainer';
import * as Permissions from 'expo-permissions';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default class App extends Component  {
  constructor(props) {
    super(props);
  }

  async askPermissions() {
    console.log("asking");
    const { status } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    console.log(status);
    if (status !== 'granted') {
      alert('Hey! You have not enabled selected permissions');
    }
  }

  //https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
  componentDidMount() {
    this.askPermissions();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>GoctaLapp</Text>
        <StatusBar style="auto" />
        <MapViewContainer />
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
});
