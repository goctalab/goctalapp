import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppLoading } from 'expo';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import * as RootNavigation from '@components/RootNavigation';

import MapViewComponent from '@components/MapViewComponent';
import { FloraFaunaScreen,
  PointsOfInterestScreen,
  TreksScreen,
  FarmScreen
} from '@components/ListScreens';
import DetailViewComponent from '@components/DetailViewComponent';


const Drawer = createDrawerNavigator();

const DrawerSectionStack = createStackNavigator();

const MapStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={ROUTES.HOME_ROUTE}
        options={({ route }) => ({ headerShown: false, title: getListViewTitle(route) })}
        component={ MapViewComponent } />
      <Stack.Screen 
        name="Details"
        component={ DetailViewComponent }
        initialParams={{
          id: 0 // TODO change this to empty object?
        }} 
      />
    </Stack.Navigator>
  )
};

export default function() {

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

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer initialRouteName="Details" ref={ RootNavigation.navigationRef }>
      <View style={ styles.container }>
        <Drawer.Navigator
          initialRouteName={ ROUTES.HOME_ROUTE }
          drawerContentOptions={{
            activeTintColor: colors["Brandy"],
            inactiveTintColor: colors["Eggshell"],
            activeBackgroundColor: colors["Eggshell"],
            itemStyle: { marginVertical: 10 },
            labelStyle: { fontFamily: 'Montserrat_600SemiBold' },
          }}
          drawerStyle={ drawerStyles }
          screenOptions={({ navigation } ) => ({
            headerLeft: () => (
              <DrawerButton onPress={() => navigation.toggleDrawer()} />
            )
          })}>
          <DrawerSectionStack.Screen 
            name={ ROUTES.HOME_ROUTE }
            options={({ route }) => ({ title: getListViewTitle(route) })}
            component={ MapStack } />
          <DrawerSectionStack.Screen
            name={ ROUTES.POI_ROUTE }
            options={({ route }) => ({ title: getListViewTitle(route) })}
            component={ PointsOfInterestScreen }
          />
          <DrawerSectionStack.Screen 
            name={ ROUTES.TREKS_ROUTE }
            options={({ route }) => ({ title: getListViewTitle(route) })}
            component={ TreksScreen }
          />
          <DrawerSectionStack.Screen 
            name={ ROUTES.FLORA_FAUNA_ROUTE }
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
      </View>
    </NavigationContainer>
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
