import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import * as RootNavigation from '@src/RootNavigation';
import * as Permissions from 'expo-permissions';

import MapViewContainer from '@components/MapViewContainer';
import { FloraFaunaScreen,
  PointsOfInterestScreen,
  TreksScreen,
  FarmScreen
} from '@components/ListScreens';

import { MapContextProvider } from './MapContextProvider';
import { PlacesContextProvider } from './PlacesContextProvider';

import dbUtils from '@data/dbUtils';
import { groupPlacesByType } from '@src/placesUtils';
import * as ROUTES from '@src/routeUtils';

// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DrawerNavStack = createStackNavigator();
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
  }, [props]);

  return (
    <MapContextProvider state={ mapData }>
      <NavigationContainer initialRouteName="Details" ref={ RootNavigation.navigationRef }>
        <View style={ styles.container }>
          <PlacesContextProvider state={ placesData }>
            <Drawer.Navigator
              initialRouteName={ROUTES.HOME_ROUTE}
              screenOptions={({ navigation } ) => ({
                headerLeft: () => (
                  <DrawerButton onPress={() => navigation.toggleDrawer()} />
                )
              })}>
              <DrawerNavStack.Screen 
                name={ROUTES.HOME_ROUTE}
                options={{ title: "🗺️ Map" }}
                component={ MapViewContainer } />
              <DrawerNavStack.Screen
                name={ROUTES.POI_ROUTE}
                options={{ title: "📍 Points of Interest" }}
                component={ PointsOfInterestScreen }
              />
              <DrawerNavStack.Screen 
                name={ROUTES.TREKS_ROUTE}
                options={{ title: "🥾 Treks" }}
                component={ TreksScreen }
              />
              <DrawerNavStack.Screen 
                name={ROUTES.FLORA_FAUNA_ROUTE}
                options={{ title: "🌺 Flora y Fauna" }}
                component={ FloraFaunaScreen }
              />
              <DrawerNavStack.Screen 
                name={ROUTES.FARM_ROUTE}
                options={{ title: "🌱 Experimental Farm" }}
                component={ FarmScreen }
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
