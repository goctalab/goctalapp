import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
// import { useFonts } from 'expo-font';
// import { Tajawal_700Bold } from '@expo-google-fonts/tajawal';
// import {
//   Montserrat_300Light,
//   Montserrat_400Regular } from '@expo-google-fonts/montserrat';

const defaultDescription = "need to add a description for this awesome place!";

const MarkerComponent = (props, ref) => {
  const { 
    markerData,
    imageIcon,
    pinColor
  } = props;

  const markerRef = useRef(null);
  const coordinate = markerData.coordinates[0];

  // useFonts({
  //   Tajawal_700Bold,
  //   Montserrat_300Light,
  //   Montserrat_400Regular
  // });

  useImperativeHandle(ref, () => ({
    openCallout: () => {
      markerRef.current.showCallout();
    },
    coordinate
  }));

  return (
    <Marker
      id={markerData.filename}
      pinColor={pinColor}
      coordinate={coordinate}
      title={markerData.title}
      description={markerData.description || defaultDescription }
      image={imageIcon}
      ref={markerRef}
    >
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={{ fontFamily: 'Tajawal_700Bold', fontSize: 18, marginBottom: 8 }}>{markerData.title}</Text>
          <Text style={{ fontFamily: 'Raleway_400Regular', fontSize: 14 }}>{markerData.description || defaultDescription}</Text>
          {/* <TouchableHighlight /> */}
        </View>
      </Callout>
    </Marker>
  );
}

export default forwardRef(MarkerComponent);

const styles = StyleSheet.create({
  callout: {
    backgroundColor: 'rgba(255, 255, 255, .75)',
    padding: 12,
    marginHorizontal: 40,
    maxWidth: 250,
    borderRadius: 5,
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, .25)',
  }
});
