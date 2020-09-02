
import React from 'react';
// import ListViewComponent from '@components/ListViewComponent';
import DetailViewComponent from '@components/DetailViewComponent';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Button } from 'react-native';
import ListViewComponent from './ListViewComponent';
import * as RootNavigation from '../RootNavigation';

const Stack = createStackNavigator();
const listItems = [
  { route: "Main House", component: DetailViewComponent, params: { title: "Main House", id: 1} },
  { route: "Rock Garden", component: DetailViewComponent, params: { title: "Rock Garden", id: 2} },
  { route: "Batan Ruin", component: DetailViewComponent, params: { title: "Batan Ruin", id: 33} },
  { route: "Tombo's Piscina", component: DetailViewComponent, params: { title: "🐕 Tombo's Piscina", id: 44}},
  { route: "Taller", component: DetailViewComponent, params: { title: "Taller",id: 445} },
  { route: "Coffee Farm", component: DetailViewComponent, params: { title: "Coffee Farm", id: 153} },
]; 

export default function PlacesOfInterestScreen(props) {
  const { navigation } = props;
  return (
    <Stack.Navigator>
        <Stack.Screen name={props.route.name} options={{
          headerLeft: () => (
            <Button
              onPress={() => {
                navigation.navigate("Home");
                navigation.toggleDrawer();
              }}
              title="< Back"
            />)
        }}>
        { props =>  <ListViewComponent {...props} listItems={listItems} />}
        </Stack.Screen>
        { listItems.map((item, index) => {
            return (<Stack.Screen
                      key={item.route}
                      name={item.route}
                      component={DetailViewComponent}>
                    </Stack.Screen>)
          })
        }
      </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
});
