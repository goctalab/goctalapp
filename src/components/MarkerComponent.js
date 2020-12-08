import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { PLACE_FIELDS } from '../data/dbUtils';
import { useNavigation } from '@react-navigation/native';
import { getScreenNameFromSiteItem, getRouteNameFromCategory } from '../utils/routeUtils';
import { DETAILS_ROUTE } from '@utils/routeUtils';

const defaultDescription = "need to add a description for this awesome place!";
const READ_MORE_TEXT = "\nRead more"
const MarkerComponent = (props, ref) => {
  const { 
    markerData,
    imageIcon,
    selectedImageIcon,
    pinColor,
    hidden,
    isSelected,
    onPress
  } = props;

  const navigation = useNavigation();

  const placeData = markerData.placeData || {}; // this should always be defined
  const markerRef = useRef(null);
  const coordinate = markerData.coordinates[0];

  const openCallout = () => {
    console.log("open callout", markerData);
    markerRef.current.showCallout();
  }

  const openDetailView = () => {
    // const screen = getScreenNameFromSiteItem(markerData.placeData); //TODO rename since using sites
    const route = getRouteNameFromCategory(markerData.placeData[PLACE_FIELDS.category]);
    debugger
    // navigation.navigate( DETAILS_ROUTE, { screen, params: { id: placeData.rowid, title: placeData[PLACE_FIELDS.title], from_map: true }});
    navigation.navigate( DETAILS_ROUTE, { id: placeData.rowid, title: placeData[PLACE_FIELDS.title], from_map: true });
  }

  const truncate = (str) => (str) ? str.substr(0, str.indexOf('.') + 1) :  "";
  
  useImperativeHandle(ref, () => ({
    openCallout,
    coordinate
  }));
  
  const onMyPress = (e) => { 
    // console.log("onMyPress", markerRef.current, e.nativeEvent);
    if (typeof(onPress) !== "function") {
      return true;
    }
    onPress(e, markerData);
  };

  return (
    <Marker
      id={markerData.filename}
      pinColor={pinColor}
      coordinate={coordinate}
      image={ isSelected ? selectedImageIcon || imageIcon : imageIcon }
      style={ hidden ? styles.hidden : {} }
      ref={(ref) => markerRef.current = ref }
      onPress={onMyPress}
    >
      <Callout tooltip onPress={openDetailView}>
        <View style={styles.callout}>
          <Text style={{ fontFamily: 'Tajawal_500Medium', fontSize: 18, marginBottom: 8 }}>{placeData[PLACE_FIELDS.title]}</Text>
          <Text style={{ fontFamily: 'Raleway_400Regular', fontSize: 14 }}>
            { truncate(placeData[PLACE_FIELDS.description]) || defaultDescription}
          </Text>
          <Text style={{ marginVertical: 2, textAlign: 'right', fontFamily: 'Tajawal_500Medium', fontSize: 14 }}>
            { READ_MORE_TEXT }
          </Text> 
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
