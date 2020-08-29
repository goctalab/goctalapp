
import React from 'react';
// import ListViewComponent from '@components/ListViewComponent';
import DetailViewComponent from '@components/DetailViewComponent';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Button } from 'react-native';
import ListViewComponent from './ListViewComponent';
import * as RootNavigation from '../RootNavigation';

const Stack = createStackNavigator();
const listItems = [
  { title: "Main House", component: DetailViewComponent },
  { title: "Rock Garden", component: DetailViewComponent },
  { title: "Batan Ruin", component: DetailViewComponent },
  { title: "Tombo's Piscina", component: DetailViewComponent },
  { title: "Taller", component: DetailViewComponent },
  { title: "Coffee Farm", component: DetailViewComponent },
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
        { listItems.map((item) => {
          return (<Stack.Screen key={item.title} name={item.title} component={DetailViewComponent}>
            {/* <TouchableWithoutFeedback
              onPress={() => props.navigation.navigate('Home')}
              {...props}>
              <Text style={styles.item}>{item.title}</Text>
            </TouchableWithoutFeedback> */}
          </Stack.Screen>)}
        )}
      </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
});
