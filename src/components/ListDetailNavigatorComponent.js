import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Button } from 'react-native';
import DetailViewComponent from '@components/DetailViewComponent';
import ListViewComponent from '@components/ListViewComponent';
import { HOME_ROUTE, getRouteNameFromKMLItem, getListViewTitle } from '@utils/routeUtils';
import { PLACE_FIELDS } from '@data/dbUtils';
import { colors, headerStyles } from '@utils/styleUtils';
import FIcon from 'react-native-vector-icons/Feather';


const backIcon = <FIcon name="chevron-right" size={10} color="#FFF" />;
const ListDetailsStack = createStackNavigator();

export default function({ navigation, route, listItems=[] }) {

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
                color="white"
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
                        title: "", // item[PLACE_FIELDS.title],
                        ...headerStyles
                      }}
                      initialParams={{
                        id: item.rowid, 
                        filename: item[PLACE_FIELDS.filename] 
                      }} >
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
