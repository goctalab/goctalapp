import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { PLACE_FIELDS } from '../data/dbUtils';
import { useNavigation } from '@react-navigation/native';
// import { getScreenNameFromSiteItem, getRouteNameFromCategory } from '../utils/routeUtils';
import { DETAILS_ROUTE } from '@utils/routeUtils';
import markerAssetsURI from '@src/mapMarkerAssetsURI';

const defaultDescription = "need to add a description for this awesome place!";
const READ_MORE_TEXT = "\nRead more"
// const truncate = (str, max) => (str) ? str.substr(0, Math.min(str.length, max)) : "";

const truncate = (str, max) => {
  if (!str) {
    return "";
  } else if (str.length < max) {
    return str;
  }
  const description = [];
  const words = str.split(" ");
  for (let i = 0, total = 0; i < words.length; i++) {
    if (total < max) {
      description.push(words[i]);
      total += words[i].length;
    } else {
      description.push("...");
      break;
    }
  }
  return description.join(" ");
}

// testing so exporting this way
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

  const defaultMarkerIcons = markerAssetsURI.defaultMarker();
  const defaultIcon = defaultMarkerIcons.default;
  const defaultSelectedIcon = defaultMarkerIcons.selected;

  // const defaultIcon = (markerAssetsURI["taller.kml"]()).default;
  // const defaultSelectedIcon = (markerAssetsURI["taller.kml"]()).selected;

  const placeData = markerData.placeData || {}; // this should always be defined
  const markerRef = useRef(null);
  const coordinate = markerData.coordinates[0];

  const openCallout = () => {
    // console.log("open callout", markerData);
    markerRef.current.showCallout();
  }

  const openDetailView = () => {
    // const screen = getScreenNameFromSiteItem(markerData.placeData); //TODO rename since using sites
    // const route = getRouteNameFromCategory(markerData.placeData[PLACE_FIELDS.category]);
    // navigation.navigate( DETAILS_ROUTE, { screen, params: { id: placeData.rowid, title: placeData[PLACE_FIELDS.title], from_map: true }});
    navigation.navigate( DETAILS_ROUTE, { id: placeData.rowid, title: placeData[PLACE_FIELDS.title], from_map: true });
  }

  const MAX = 100;
 
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
      // image={ isSelected ? (selectedImageIcon || defaultSelectedIcon) : (imageIcon || defaultIcon) }
      // icon={ imageIcon }
      // image={require('@assets/img/mapMarkers/snake_eye_marker_dark.png')}
      style={ hidden ? styles.hidden : {} }
      ref={(ref) => markerRef.current = ref }
      onPress={onMyPress}
    >
      <View>
        <Image source={ isSelected ? 
          (selectedImageIcon || defaultSelectedIcon) : ( imageIcon || defaultIcon) }
          style={imageIcon ? styles.customIcon : styles.defaultIcon }
        />
      </View>
      <Callout tooltip onPress={openDetailView} style={styles.callout}>
        <View style={styles.calloutContent}>
          <Text style={{ fontFamily: 'Tajawal_500Medium', fontSize: 18, marginBottom: 8 }}>{placeData[PLACE_FIELDS.title]}</Text>
          <Text style={{ fontFamily: 'Raleway_400Regular', fontSize: 14 }}>
            { truncate(placeData[PLACE_FIELDS.description], MAX) || defaultDescription}
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
    marginBottom: 10,
    minWidth: 250,
    maxWidth: 400,
    borderRadius: 5,
    borderWidth: 5,
    // position: 'absolute',
    // zIndex: 20,
    borderColor: 'rgba(255, 255, 255, .25)',
  },
  customCallout: {
    marginBottom: -10
  }, 
  calloutContent: {
    width: "100%",
  },
  iconView: {},
  customIcon: {
    transform: [{ scaleX: .5 }, { scaleY: .5 }],
    alignSelf: 'flex-end',
    bottom: '-25%'
  },
  defaultIcon: {
    width: 30,
    height: 20
  }
});
