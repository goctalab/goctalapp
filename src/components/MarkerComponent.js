import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

const defaultDescription = "need to add a description for this awesome place!";

const MarkerComponent = (props, ref) => {
  const { 
    markerData,
    imageIcon,
    pinColor
  } = props;

  const markerRef = useRef(null);
  const coordinate = markerData.coordinates[0];

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
          <Text style={{ fontSize: 16, marginBottom: 8 }}>{markerData.title}</Text>
          <Text style={{ fontSize: 14 }}>{markerData.description || defaultDescription}</Text>
          {/* <TouchableHighlight /> */}
        </View>
      </Callout>
    </Marker>
  );
}

export default forwardRef(MarkerComponent);

const styles = StyleSheet.create({
  callout: {
    backgroundColor: "white",
    //borderRadius: 5,
    padding: 12,
    marginHorizontal: 40,
    maxWidth: 300,
  }
});
