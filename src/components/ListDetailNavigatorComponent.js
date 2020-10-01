import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Button } from 'react-native';
import DetailViewComponent from '@components/DetailViewComponent';
import ListViewComponent from '@components/ListViewComponent';

const Stack = createStackNavigator();


export default function ({ navigation, route, listItems=[] }) {
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
        { listItems.map((item, i) => {
            return (<Stack.Screen
                      key={item.title}
                      name={`${item.title}${i}`}
                      component={DetailViewComponent}>
                    </Stack.Screen>)
          })
        }
      </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
