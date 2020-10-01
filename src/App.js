import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import * as RootNavigation from './RootNavigation';
import * as Permissions from 'expo-permissions';

import MapViewContainer from '@components/MapViewContainer';
import { FloraFaunaScreen, PointsOfInterestScreen } from '@components/ListScreens';
import { MapContextProvider } from './MapContextProvider';
import { PlacesContextProvider } from './PlacesContextProvider';

import dbUtils from '@data/dbUtils';
import { PLACE_TYPES, groupPlacesByType } from './placesUtils';

// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function(props) {
  const [ mapData, setMapData ] = useState([]);
  const [ placesData, setPlacesData ] = useState({});

  async function askPermissions() {
    const { status } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    console.log("asked perms", status);
    if (status !== 'granted') {
      alert('Hey! You have not enabled selected permissions!');
    }
  }

  async function initDb() {
    await dbUtils.init();
    dbUtils.getAllKML((kml) => {
      setMapData(kml);
    });
    dbUtils.getAllPlaces((places) => {
      const groupedPlaces = groupPlacesByType(places);
      setPlacesData(groupedPlaces);
    });
  }

  //https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
  useEffect(() => {
    askPermissions();
    initDb();
  });

  console.log("place types", placesData[PLACE_TYPES.pointsOfInterest]);
  return (
    <MapContextProvider state={ mapData }>
      <NavigationContainer initialRouteName="Details" ref={ RootNavigation.navigationRef }>
        <View style={ styles.container }>
          <PlacesContextProvider state={ placesData }>
            <Drawer.Navigator
              initialRouteName="Home" 
              screenOptions={({ navigation } ) => ({
                headerLeft: () => (
                  <DrawerButton onPress={() => navigation.toggleDrawer()} />
                )
              })}>
              <Stack.Screen name="Home" component={ MapViewContainer } />
              <Stack.Screen name="📍 Points of Interest"
                  component={ PointsOfInterestScreen }
              />
              <Stack.Screen name="🥾 Treks" 
                component={ PointsOfInterestScreen }
              />
              <Stack.Screen name="🌺 Flora y Fauna"
                component={ FloraFaunaScreen }
              />
              <Stack.Screen name="🌱 Experimental Farm"
                component={ FloraFaunaScreen }
              />
              {/* <Stack.Screen name="About"
                component={ ListDetailNavComponent }
                initialParams={{ listItems: trekListItems }} /> */}
            </Drawer.Navigator>
          </PlacesContextProvider>
        </View>
      </NavigationContainer>
    </MapContextProvider>
  );
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
