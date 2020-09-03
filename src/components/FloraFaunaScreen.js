import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Button } from 'react-native';
import DetailViewComponent from '@components/DetailViewComponent';
import ListViewComponent from './ListViewComponent';
import * as RootNavigation from '../RootNavigation';

const Stack = createStackNavigator();

const listItems = [
  { route: "Orchids", component: DetailViewComponent, params: { title: "Orchids", id: 2} },
  { route: "Sangre de Grado Tree", component: DetailViewComponent, params: { title: "Sangre de Grado Tree", id: 153} },
  { route: "Eliconias", component: DetailViewComponent, params: { title: "Eliconias", id: 153} },
  { route: "Pajuro Trees", component: DetailViewComponent, params: { title: "Pajuro Trees", id: 153} },
]


export default function FloraFaunaScreen(props) {
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

const styles = StyleSheet.create({});
