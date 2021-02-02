
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Polyline } from 'react-native-maps';
import MarkerComponent from '@components/MarkerComponent';
import markerIcon from '@src/mapMarkerAssetsURI.js';
import { colors } from '@utils/styleUtils';

const PolylineCalloutComponent = (props, ref) => {
  const { 
    polylineData,
    strokeColor,
    strokeWidth,
    onPress,
    isSelected
  } = props;

  // const [ isSelectedState, setIsSelected ] = useState(isSelected);
  const markerRef = useRef(null);
  const emptyIcon = markerIcon.empty();
  const icons = markerIcon.defaultMarker();
  
  const currentStrokeColor = isSelected ? colors["Liver Dogs"] : strokeColor;

  // console.log('isSelected', polylineData.filename, isSelected, currentStrokeColor);
  useImperativeHandle(ref, () => ({
    openCallout: markerRef.current.openCallout,
    coordinate: polylineData.coordinates[0]
  }));

  const onMyPress = (e) => {
    markerRef.current.openCallout();
    markerRef.current.isSelected = true;
    onPress(e, polylineData);
  }
 
  return (
    <>
    <MarkerComponent
      markerData={polylineData}
      ref={markerRef}
      ref={(ref) => markerRef.current = ref}
      // imageIcon={emptyIcon}
      imageIcon={icons.default}
      selectedImageIcon={icons.selected}
      isSelected={isSelected}
      onPress={(e) => { 
        onPress(e, polylineData);
      }}
      // hidden
    />
    <Polyline
      title={polylineData.name}
      coordinates={polylineData.coordinates}
      strokeColor={currentStrokeColor}
      strokeWidth={strokeWidth}
      tappable={true}
      // {...props}
      onPress={onMyPress}
    />
    </>
  );
}

export default forwardRef(PolylineCalloutComponent);
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
