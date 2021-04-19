
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Polygon } from 'react-native-maps';
import MarkerComponent from '@components/MarkerComponent';
import markerIcon from '@src/mapMarkerAssetsURI.js';
import { colors } from '@utils/styleUtils';

const PolygonCalloutComponent = (props, ref) => {
  const { 
    polygonData,
    fillColor,
    strokeColor,
    onPress,
    isSelected,
  } = props;

  const markerRef = useRef(null);
  const emptyIcon = markerIcon.empty();
  // const icons = markerIcon.defaultMarker();
  
  const currentFillColor = isSelected ? colors["Eggshell"] : fillColor;

  // console.log(isSelected, currentFillColor, fillColor);
  useImperativeHandle(ref, () => ({
    isSelected: markerRef.current.isSelected,
    openCallout: markerRef.current.openCallout,
    coordinate: polygonData.coordinates[0]
  }));

  const onMyPress = (e) => {
    markerRef.current.openCallout();
    markerRef.current.isSelected = true;
    onPress(e, polygonData);
  }

  return (
    <>
    <MarkerComponent
      markerData={polygonData}
      ref={markerRef}
      ref={(ref) => markerRef.current = ref}
      // imageIcon={icons.default}
      // selectedImageIcon={icons.selected}
      isSelected={isSelected}
      onPress={onMyPress}
      // hidden
    />
    <Polygon
      title={polygonData.name}
      coordinates={polygonData.coordinates}
      fillColor={currentFillColor}
      tappable={true}
      // {...props}
      // zIndex={1}
      onPress={onMyPress}
    />
    </>
  );
}

export default forwardRef(PolygonCalloutComponent);
// export default PolygonCalloutComponent;

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
