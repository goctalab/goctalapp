
import React from 'react';
import MapView from 'react-native-maps';
import MarkerComponent from '@components/MarkerComponent';
import PolygonCalloutComponent from '@components/PolygonCalloutComponent';
import PolylineCalloutComponent from '@components/PolylineCalloutComponent';
import { KML_FIELDS } from "@data/dbUtils";
import markerAssetsURI from '@src/mapMarkerAssetsURI';
import { colors } from '@utils/styleUtils';

export const isMapItemSelected = (id, selectedMapItem) => !!(selectedMapItem && selectedMapItem.rowid === id);

export const renderMarkers = function(markerData=[], markersRef, selectedMapItem, onMapItemClick) {
  return (markerData).map((data, i) => {
    const filename = data[KML_FIELDS.filename];
    const getIcon = markerAssetsURI[filename] || markerAssetsURI.defaultMarker;
    const icons = getIcon();
    return <MarkerComponent
      key={`${i}-${i}`}
      markerData={data}
      imageIcon={icons.default}
      selectedImageIcon={icons.selected} 
      isSelected={isMapItemSelected(data[KML_FIELDS.id], selectedMapItem)} // TODO rowid or id
      onPress={onMapItemClick}
      ref={(ref) => {
        markersRef.current[filename] = ref;
      }} // store in ref to access by filename and open
    />
  });
}

export const renderPolygons = function(polygonData=[], markersRef, selectedMapItem, onMapItemClick) {
  return (polygonData).map((polygonObj, i) => {

    // if its a polygon with place information
    if (Object.keys(polygonObj.placeData).length) {
      // TODO refactor
      return <PolygonCalloutComponent
        key={`${i}-${i}`}
        polygonData={polygonObj}
        ref={(ref) => {
          // console.log("ref from polygon", ref);
          markersRef.current[polygonObj.filename] = ref;
        }}
        fillColor={mapColors[polygonObj.filename] || mapColors.polygon.fillColor}
        strokeWidth={2}
        strokeColor={colors["Liver Dogs"]}
        isSelected={isMapItemSelected(polygonObj[KML_FIELDS.id], selectedMapItem)} // TODO ?
        onPress={onMapItemClick}
      />
        // zIndex={1}
        // onPress={(e) => console.log(e, e.nativeEvent, "press region")}
    }
    return <MapView.Polygon
      key={`${i}-${i}`}
      title={polygonObj.name}
      coordinates={polygonObj.coordinates}
      fillColor={mapColors[polygonObj.filename] || mapColors.polygon.fillColor}
      strokeWidth={0}
      // ref={(ref) => {
      //   console.log("ref from polygon 2", ref);
      //   markersRef.current[polygonObj.filename] = ref;
      // }}
      // zIndex={1}
    />
  });
}

export const renderPolylines = function(polylinesData=[], markersRef, selectedMapItem, onMapItemClick) {
  // ('polylines', polylinesData);
  return polylinesData.map((polyline, i) => {
    if (Object.keys(polyline.placeData).length) {
      const isSelected = isMapItemSelected(polyline[KML_FIELDS.id], selectedMapItem);
      return <PolylineCalloutComponent
        key={`${i}-${i}`}
        polylineData={polyline}
        ref={(ref) => {
          // console.log("ref from polygon", ref);
          markersRef.current[polyline.filename] = ref;
        }}
        strokeColor={mapColors[polyline.filename] || mapColors.paths.strokeColor}
        strokeWidth={2}
        isSelected={isSelected} // TODO ?
        onPress={onMapItemClick}
      />
        // zIndex={1}
        // onPress={(e) => console.log(e, e.nativeEvent, "press region")}
    }
    // const strokeColor = (polyline.filename.indexOf("agrofo") > -1) ?
    //   colors["Lapis Lazuli"] :
    //   mapColors.paths.strokeColor;
    return <MapView.Polyline
      key={`${i}-${i}`}
      coordinates={polyline.coordinates}
      strokeColor={mapColors.paths.strokeColor}
      strokeWidth={mapColors.paths.strokeWidth}
      zIndex={10}
      // lineJoin="meter"
      // lineCap="butt"
      // meterLimit="5"
      // zIndex={2}
    />
  }
  );
}


const mapColors = {
  polygon: {
    fillColor: 'rgba(106, 153, 78, .3)' // colors["May Green"]
  },
  "PozoBirding.kml": colors["Middle Blue"],
  "Crops.kml": colors["Android Green"],
  "Andenes.kml": colors["Dark Olive Green"],
  paths: {
    strokeColor: 'rgba(242,232,207,.5)',
    strokeWidth: 3
  }
}
