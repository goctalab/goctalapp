
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Button } from 'react-native';
import dbUtils from '@data/dbUtils';
import { HOME_ROUTE } from '@utils/routeUtils';
// import { CommonActions, NavigationAction, NavigationContainer, StackActions } from '@react-navigation/native';
// import { StackActions } from '@react-navigation/native';
// import { HeaderBackButton } from '@react-navigation/stack'

export const goToMapTitle = "Go to map view";
export const selectedMarkerParam = "selected_marker";

export default function DetailViewComponent({ route, navigation }) {

  const [ description, setDescription ] = useState("Loading...");
  const { id, title, filename, from_map } = route.params;

  useEffect(() => {
    dbUtils.getDetailsForPlace((data) => {
      if (!data) { // todo more elegant way?
        return;
      }
      const { description } = data;
      setDescription(description);
    }, id);
  }, [id]);

  /* seems unnecessary now 
  // but need to investigate
  useLayoutEffect(() => {
    if (!from_map) {
      return;
    }
    navigation.setOptions({
      headerLeft: () => (
        <Button onPress={() => { 
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: HOME_ROUTE }]
            })
          );
          // navigation.reset({
          //   index: 0,
          //   routes: [{ name: HOME_ROUTE }],
          // });
          // navigation.dispatch(StackActions.replace(HOME_ROUTE));
          // navigation.dispatch(CommonActions.reset())
         }} title="Close" />
      )
    });
  }, [route]);
  */

  const newLineDescription = (description.replace(/(?:\\\\[rn])+/g, ' \n'));
  return (
    <View style={{ flex: 1,
      alignItems: 'center',
      // justifyContent: 'top',  
      padding: 30,
      paddingHorizontal: 50 }}>
      <Text style={{ fontSize: 25, marginBottom: 24, textAlign: 'center' }}>{title}</Text>
      <Text style={{ fontSize: 18 }}>{newLineDescription}</Text>
      { !from_map &&
        <Button
          title={goToMapTitle}
          onPress={() => {  
            navigation.goBack(); // to pop the list view when we are here, better option like reset?
            console.log("Clicked on go to map view with options", HOME_ROUTE, { [selectedMarkerParam]: filename });
            navigation.navigate(HOME_ROUTE, { [selectedMarkerParam]: filename } )
          }}
        />
      }
    </View>
  );
}
