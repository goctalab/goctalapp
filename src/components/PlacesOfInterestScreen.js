
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Button } from 'react-native';
import ListViewComponent from '@components/ListViewComponent';
import DetailViewComponent from '@components/DetailViewComponent';

const Stack = createStackNavigator();
const listItems = [
  { route: "Main House", component: DetailViewComponent, params: { title: "Main House", id: 1} },
  { route: "Succulent Garden", component: DetailViewComponent, params: { title: "Succulent Garden + Sight Seeing Rock ", id: 4 } },
  { route: "Batan Ruin", component: DetailViewComponent, params: { title: "Ancient Ruin + Orquids", id: 33} },
  { route: "Tombo's Piscina", component: DetailViewComponent, params: { title: "🐕 Tombo's Pond", id: 44}},
  { route: "Taller", component: DetailViewComponent, params: { title: "Art Workshop ",id: 445} },
  { route: "Seed banks", component: DetailViewComponent, params: { title: "Seed banks", id: 153} },
  { route: "Vegetable Garden Steps", component: DetailViewComponent, params: { title: "Vegetable Garden Steps", id: 153} },
  { route: "Chilli Garden", component: DetailViewComponent, params: { title: "Chilli Garden", id: 153} },
  { route: "Sangre de Grado Tree", component: DetailViewComponent, params: { title: "Sangre de Grado Tree", id: 153} },
  { route: "Deck", component: DetailViewComponent, params: { title: "Deck", id: 153} },
  { route: "Terrace Pizza", component: DetailViewComponent, params: { title: "Terrace + Pizza Oven", id: 153} },
  { route: "Eliconias", component: DetailViewComponent, params: { title: "Eliconias", id: 153} },
  { route: "Pajuro Trees", component: DetailViewComponent, params: { title: "Pajuro Trees", id: 153} },
]; 

export default function PlacesOfInterestScreen(props) {

  const { navigation, route } = props;
  return (
    <Stack.Navigator>
        <Stack.Screen name={route.name} options={{
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

const styles = StyleSheet.create({});
