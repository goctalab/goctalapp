import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import * as RootNavigation from '@components/RootNavigation';
import * as Permissions from 'expo-permissions';

import { useFonts } from 'expo-font';
import { Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';
import { 
  Montserrat_300Light, 
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_600SemiBold,
  Montserrat_900Black } from '@expo-google-fonts/montserrat';
import { Raleway_400Regular } from '@expo-google-fonts/raleway';
import { colors, drawerStyles } from '@utils/styleUtils';

import MapViewComponent from '@components/MapViewComponent';
import { FloraFaunaScreen,
  PointsOfInterestScreen,
  TreksScreen,
  FarmScreen
} from '@components/ListScreens';

import { MapContextProvider } from '@components/MapContextProvider';
import { PlacesContextProvider } from '@components/PlacesContextProvider';

import dbUtils from '@data/dbUtils';
import * as ROUTES  from '@utils/routeUtils';
import { getListViewTitle } from '@utils/routeUtils';

// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DrawerNavStack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function(props) {
  const [ mapData, setMapData ] = useState([]);
  const [ placesData, setPlacesData ] = useState([]);

  let [ fontsLoaded ] = useFonts({
    Montserrat_300Light, 
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_900Black,
    Montserrat_700Bold,
    Tajawal_700Bold,
    Tajawal_500Medium,
    Raleway_400Regular
  });

  //https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
  useEffect(() => {
    askPermissions();
    initDb();
  }, [props]);


  async function askPermissions() {
    const { status } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    console.log("asked perms", status);
    if (status !== 'granted') {
      alert('Ooops, You have not enabled location permissions.');
    } else {
      
    }
  }

  async function initDb() {
    await dbUtils.init();
    dbUtils.getAllKML((kml) => {
      setMapData(kml);
    });
    dbUtils.getAllPlaces((places) => {
      setPlacesData(places);
    });
  }

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <MapContextProvider state={ mapData }>
      <NavigationContainer initialRouteName="Details" ref={ RootNavigation.navigationRef }>
        <View style={ styles.container }>
          <PlacesContextProvider state={ placesData }>
            <Drawer.Navigator
              initialRouteName={ROUTES.HOME_ROUTE}
              drawerContentOptions={{
                activeTintColor: colors["Brandy"],
                inactiveTintColor: colors["Eggshell"],
                activeBackgroundColor: colors["Eggshell"],
                itemStyle: { marginVertical: 10 },
                labelStyle: { fontFamily: 'Montserrat_600SemiBold' },
              }}
              drawerStyle={drawerStyles}
              screenOptions={({ navigation } ) => ({
                headerLeft: () => (
                  <DrawerButton onPress={() => navigation.toggleDrawer()} />
                )
              })}>
              <DrawerNavStack.Screen 
                name={ROUTES.HOME_ROUTE}
                options={({ route }) => ({ title: getListViewTitle(route) })}
                component={ MapViewComponent } />
              <DrawerNavStack.Screen
                name={ROUTES.POI_ROUTE}
                options={({ route }) => ({ title: getListViewTitle(route) })}
                component={ PointsOfInterestScreen }
              />
              <DrawerNavStack.Screen 
                name={ROUTES.TREKS_ROUTE}
                options={({ route }) => ({ title: getListViewTitle(route) })}
                component={ TreksScreen }
              />
              <DrawerNavStack.Screen 
                name={ROUTES.FLORA_FAUNA_ROUTE}
                options={({ route }) => ({ title: getListViewTitle(route) })}
                component={ FloraFaunaScreen }
              />
              {/* <DrawerNavStack.Screen 
                name={ROUTES.FARM_ROUTE}
                options={({ route }) => ({ title: getListViewTitle(route) })}
                component={ FarmScreen }
              /> */}
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
