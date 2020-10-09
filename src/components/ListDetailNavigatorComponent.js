import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Button } from 'react-native';
import DetailViewComponent from '@components/DetailViewComponent';
import ListViewComponent from '@components/ListViewComponent';
import { HOME_ROUTE, getRouteNameFromKMLItem, getListViewTitle } from '@utils/routeUtils';
import { PLACE_FIELDS } from '@data/dbUtils';
import { colors, headerStyles } from '@utils/styleUtils';
import FIcon from 'react-native-vector-icons/Feather';
const backIcon = <FIcon name="chevron-left" size={30} color="#FFF" />;

// import { useFonts } from 'expo-font';
// import { Tajawal_700Bold } from '@expo-google-fonts/tajawal';
// import { Montserrat_900Black } from '@expo-google-fonts/montserrat';

const ListDetailsStack = createStackNavigator();

export default function({ navigation, route, listItems=[] }) {
  // let [ fontsLoaded ] = useFonts({
  //   Montserrat_900Black,
  //   Tajawal_700Bold
  // });

  return (
    <ListDetailsStack.Navigator>
        <ListDetailsStack.Screen 
          name={route.name} 
          options={{
            title: getListViewTitle(route),  // TODO: title
            headerLeft: () => (
              <Button
                onPress={() => {
                  navigation.navigate(HOME_ROUTE);
                  navigation.toggleDrawer();
                }}
                title="Back"
                icon={backIcon}
              />),
            ...headerStyles
          }}>
        { props =>  <ListViewComponent {...props} listItems={listItems} />}
        </ListDetailsStack.Screen>
        { listItems.map((item, i) => {
            const routeName = getRouteNameFromKMLItem(item);
            // console.log("route name", routeName);
            return (<ListDetailsStack.Screen
                      key={item[PLACE_FIELDS.filename]}
                      name={routeName}
                      component={DetailViewComponent}
                      options={{ 
                        title: item[PLACE_FIELDS.title],
                        headerStyle: {
                          backgroundColor: '#f4511e',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                          fontWeight: 'bold',
                        }
                      }}
                      initialParams={{ id: item.rowid, filename: item[PLACE_FIELDS.filename] }} >
                    </ListDetailsStack.Screen>)
          })
        }
      </ListDetailsStack.Navigator>
  );
}

const styles = StyleSheet.create({});

// https://reactnavigation.org/docs/hello-react-navigation/#passing-additional-props
// const memoized =  React.memo(ListDetailNavigatorComponent);
///export default memoized;
