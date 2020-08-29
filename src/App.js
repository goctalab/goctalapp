import * as Permissions from 'expo-permissions';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import * as RootNavigation from './RootNavigation';

import MapViewContainer from '@components/MapViewContainer';

import Icon from 'react-native-vector-icons/FontAwesome';
const menuIcon = <Icon name="bars" size={30} color="#900" />;

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
        component={DetailsScreen}
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
    console.log(RootNavigation);
    return (
      <NavigationContainer initialRouteName="Details" ref={RootNavigation.navigationRef}>
        <View style={styles.container}>
          <TouchableOpacity 
            style={[ styles.flexRow, styles.menuControl ]}
            onPress={ () => RootNavigation.openDrawer() }>
              {menuIcon}
          </TouchableOpacity>
          <Drawer.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={ MapScreen } />
          </Drawer.Navigator>
        </View>
      </NavigationContainer>
    );
  }
}

// console.log("width", Dimensions.get('window').width);

const styles = StyleSheet.create({
  menuControl: {
    position: "absolute",
    zIndex: 2,
    top: 50,
  },
  container: {
    flex: 1,
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
