
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Polygon } from 'react-native-maps';
import MarkerComponent from '@components/MarkerComponent';


const PolygonCalloutComponent = (props, ref) => {
  const { 
    polygonData,
    fillColor
  } = props;

  const markerRef = useRef(null);

  return (
    <>
    <MarkerComponent
      markerData={polygonData}
      ref={markerRef}
      ref={(ref) => markerRef.current = ref}
      hidden
    />
    <Polygon
      title={polygonData.name}
      coordinates={polygonData.coordinates}
      fillColor={fillColor}
      tappable={true}
      {...props}
      // zIndex={1}
      onPress={(e) => {
        console.log(e, e.nativeEvent, "press region will open callout");
        markerRef.current.openCallout();
      }}
    />
    </>
  );
}

export default forwardRef(PolygonCalloutComponent);

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
