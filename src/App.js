import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import * as Permissions from 'expo-permissions';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import * as RootNavigation from './RootNavigation';

import MapViewContainer from '@components/MapViewContainer';

import Icon from 'react-native-vector-icons/FontAwesome';
import PlacesofInterestScreen from '@components/PlacesOfInterestScreen';
import ListViewComponent from '@components/ListViewComponent';
import FloraFaunaScreen from './components/FloraFaunaScreen';

import { MapContextProvider } from './MapContextProvider';


import dbUtils from '@data/dbUtils';

const menuIcon = <Icon name="bars" size={30} color="#FFF" />;

// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MapScreen(props) {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      <Stack.Screen name="Map" component={ MapViewContainer } />
      <Stack.Screen
        name="Details"
        component={ DetailsScreen }
        options={{ title: 'Location Deets' }} />
    </Stack.Navigator>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to map view"
        onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

export default class App extends Component  {
  constructor() {
    super();
    this.state = {
      kmlData: []
    }
  }
  async askPermissions() {
    const { status } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    console.log("asked perms", status);
    if (status !== 'granted') {
      alert('Hey! You have not enabled selected permissions');
    }
  }

  async initDb() {
    await dbUtils.init();
    dbUtils.getAllKML((kml) => {
      console.log("calling all callbacks yo after fetching KML");
      this.setState({ mapData: kml })
    });
      // .then(
      //   (kml) => this.setState({ mapData: kml }),
      //   (err) => {});
    // const places = dbUtils.getAllPlaces();
  }

  //https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
  componentDidMount() {
    this.askPermissions();
    this.initDb();
  }

  render() {
    return (
      <MapContextProvider state={this.state.mapData}>
        <NavigationContainer initialRouteName="Details" ref={RootNavigation.navigationRef}>
          <View style={styles.container}>
            <Drawer.Navigator
              initialRouteName="Home" 
              screenOptions={({ navigation } ) => ({
                headerLeft: () => (
                  <DrawerButton onPress={() => navigation.toggleDrawer()} />
                )
              })}>
              <Stack.Screen name="Home" component={ MapViewContainer } />
              <Stack.Screen name="📍 Places of Interest"
                component={ PlacesofInterestScreen }
              />
              <Stack.Screen name="🥾 Treks" component={ DetailsScreen } />
              <Stack.Screen name="🌺 Flora y Fauna" component={ FloraFaunaScreen } />
              <Stack.Screen name="🌱 Experimental Farm" component={ DetailsScreen } />
              <Stack.Screen name="About" component={ DetailsScreen } />
            </Drawer.Navigator>
          </View>
        </NavigationContainer>
      </MapContextProvider>
    );
  }
}

// console.log("width", Dimensions.get('window').width);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
