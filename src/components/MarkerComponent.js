import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { PLACE_FIELDS } from '../data/dbUtils';

const defaultDescription = "need to add a description for this awesome place!";

const MarkerComponent = (props, ref) => {
  const { 
    markerData,
    imageIcon,
    pinColor,
    hidden
  } = props;

  const placeData = markerData.placeData || {}; // this should always be defined
  const markerRef = useRef(null);
  const coordinate = markerData.coordinates[0];

  const openCallout = () => {
    console.log("open callout", markerData);
    markerRef.current.showCallout();
  }

  useImperativeHandle(ref, () => ({
    openCallout,
    coordinate
  }));

  return (
    <Marker
      id={markerData.filename}
      pinColor={pinColor}
      coordinate={coordinate}
      image={imageIcon}
      style={ hidden ? styles.hidden : {} }
      ref={(ref) => markerRef.current = ref }
    >
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={{ fontFamily: 'Tajawal_500Medium', fontSize: 18, marginBottom: 8 }}>{placeData[PLACE_FIELDS.title]}</Text>
          <Text style={{ fontFamily: 'Raleway_400Regular', fontSize: 14 }}>{placeData[PLACE_FIELDS.description] || defaultDescription}</Text>
          {/* <TouchableHighlight /> */}
        </View>
      </Callout>
    </Marker>
  );
}

export default forwardRef(MarkerComponent);

const styles = StyleSheet.create({
  hidden: {
    opacity: 0
  },
  callout: {
    backgroundColor: 'rgba(255, 255, 255, .75)',
    padding: 12,
    marginHorizontal: 40,
    maxWidth: 250,
    borderRadius: 5,
    borderWidth: 5,
    // position: 'absolute',
    // zIndex: 20,
    borderColor: 'rgba(255, 255, 255, .25)',
  }
});
