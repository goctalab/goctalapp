
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function DetailViewComponent({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to map view"
        onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
