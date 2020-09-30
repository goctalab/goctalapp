import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

import placeInformation from '@data/placesOfInterest';

const defaultDescription = "need to add a description for this awesome place!";

export default function(props) {
  const { 
    markerData,
    imageIcon,
    pinColor
  } = props;

  return (
    <Marker
      pinColor={pinColor}
      coordinate={markerData.coordinates[0]}
      title={markerData.name}
      description={markerData.description || defaultDescription }
      image={imageIcon}
    >
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={{ fontSize: 16, marginBottom: 8 }}>{markerData.name}</Text>
          <Text style={{ fontSize: 14 }}>{ placeInformation[markerData.name] || defaultDescription }</Text>
          {/* <TouchableHighlight /> */}
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  callout: {
    backgroundColor: "white",
    //borderRadius: 5,
    padding: 12,
    marginHorizontal: 40,
    maxWidth: 300,
  }
});
