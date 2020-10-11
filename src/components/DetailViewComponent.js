
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Button } from 'react-native';
import dbUtils from '@data/dbUtils';
import { HOME_ROUTE } from '@utils/routeUtils';

export default function DetailViewComponent({ route, navigation }) {

  const [ description, setDescription ] = useState("Loading...");
  const { id, title, filename, from_map } = route.params;
 
  // db call
  useEffect(() => {
    dbUtils.getDetailsForPlace((data) => {
      const { description } = data;
      setDescription(description);
    }, id);
  });

  useLayoutEffect(() => {
    if (!from_map) {
      return;
    }
    navigation.setOptions({
      headerLeft: () => (
        <Button onPress={() => { navigation.navigate(HOME_ROUTE) }} title="Close" />
      )
    });
  }, [route]);

  const newLineDescription = (description.replace(/(?:\\\\[rn])+/g, ' \n'));
  return (
    <View style={{ flex: 1,
      alignItems: 'center',
      justifyContent: 'top',  
      padding: 30,
      paddingHorizontal: 50 }}>
      <Text style={{ fontSize: 25, marginBottom: 24, textAlign: 'center' }}>{title}</Text>
      <Text style={{ fontSize: 18 }}>{newLineDescription}</Text>
      { !from_map && <Button
        title="Go to map view"
        onPress={() => navigation.navigate(HOME_ROUTE, { selected_marker: filename } )} /> }
    </View>
  );
}
