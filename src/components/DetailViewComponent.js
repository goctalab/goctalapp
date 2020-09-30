
import React from 'react';
import { View, Text, Button } from 'react-native';
import placesData from '@data/placesOfInterest';

export default function DetailViewComponent({ route, navigation }) {
  const text = placesData[route.params.id] || placesData[0];
 
  // db call

  return (
    <View style={{ flex: 1,
      alignItems: 'center',
      justifyContent: 'top',
      padding: 30,
      paddingHorizontal: 50 }}>
      <Text style={{ fontSize: 25, marginBottom: 24, textAlign: 'center' }}>{route.params.title}</Text>
      <Text style={{ fontSize: 18,  textAlign: 'justify' }}>{text}</Text>
      <Button
        title="Go to map view"
        onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
