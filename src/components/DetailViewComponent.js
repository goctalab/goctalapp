
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import dbUtils from '@data/dbUtils';
import { HOME_ROUTE } from '@src/routeUtils';

export default function DetailViewComponent({ route, navigation }) {

  const [ description, setDescription ] = useState("Loading...");
  const { id, title } = route.params;
 
  // db call
  useEffect(() => {
    dbUtils.getDetailsForPlace((data) => {
      const { description } = data;
      setDescription(description);
    }, id);
  });

  return (
    <View style={{ flex: 1,
      alignItems: 'center',
      justifyContent: 'top',
      padding: 30,
      paddingHorizontal: 50 }}>
      <Text style={{ fontSize: 25, marginBottom: 24, textAlign: 'center' }}>{title}</Text>
      <Text style={{ fontSize: 18,  textAlign: 'justify' }}>{description}</Text>
      <Button
        title="Go to map view"
        onPress={() => navigation.navigate(HOME_ROUTE)} />
    </View>
  );
}
