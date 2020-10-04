import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Button } from 'react-native';
import DetailViewComponent from '@components/DetailViewComponent';
import ListViewComponent from '@components/ListViewComponent';
import { HOME_ROUTE } from '@src/routeUtils';

const ListDetailsStack = createStackNavigator();

export default function ({ navigation, route, listItems=[] }) {
  // console.log("route name", route.name); // category como flora y fauna, points of interest
  return (
    <ListDetailsStack.Navigator>
        <ListDetailsStack.Screen name={route.name} options={{
          headerLeft: () => (
            <Button
              onPress={() => {
                navigation.navigate(HOME_ROUTE);
                navigation.toggleDrawer();
              }}
              title="< Back"
            />)
        }}>
        { props =>  <ListViewComponent {...props} listItems={listItems} />}
        </ListDetailsStack.Screen>
        { listItems.map((item, i) => {
            console.log("route name", `${item.kml_file}_${item.rowid}`);
            return (<ListDetailsStack.Screen
                      key={item.kml_file}
                      name={`${item.kml_file}_${item.rowid}`} // get routename helper?
                      component={DetailViewComponent}
                      options={{ title: item.title }}
                      initialParams={{ id: item.id }} >
                    </ListDetailsStack.Screen>)
          })
        }
      </ListDetailsStack.Navigator>
  );
}

const styles = StyleSheet.create({});
