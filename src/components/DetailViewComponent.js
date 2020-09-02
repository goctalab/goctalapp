
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function DetailViewComponent({route, navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen {route.params.id}</Text>
      <Button
        title="Go to map view"
        onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
