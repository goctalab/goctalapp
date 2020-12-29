import { KML_FIELDS, PLACE_FIELDS } from "@data/dbUtils";
import { processCoordinates, KML_TYPES } from '@utils/kmlUtils';

export const isMapItemSelected = (id, selectedMapItem) => !!(selectedMapItem && selectedMapItem.rowid === id);

export const openMarker = (selectedMarker, markersRef) => {
  const marker = markersRef.current[selectedMarker];
  if (marker && marker.openCallout) {
    console.log(`selected marker ${selectedMarker}`);
    centerMap(getRegionWithCoordinate(marker.coordinate), mapRef);
    marker.openCallout();
  }
}

export const centerMap = (region, mapRef) => {
  console.log("centering", region, mapRef);
  mapRef.current.animateToRegion(region, 300);
} 

// TODO tranfer this to a context ?
export const parseMapData = (mapData=[], placesData=[]) => {
  const markerData = [],
    polygonData = [],
    polylineData = [];

  mapData.forEach((data) => {
    
    // see if there is a place description entry for our thing
    // places and kml have filenames in common
    const placeData = (placesData.find((place) => place[PLACE_FIELDS.filename] === data[KML_FIELDS.filename]))
      || {};
    
    const mapObject = { 
      [KML_FIELDS.filename]: data[KML_FIELDS.filename],
      coordinates: processCoordinates(data[KML_FIELDS.coordinates]),
      rowid: data.rowid, // TODO improve rowid hardcode
      type: data[KML_FIELDS.type],
      placeData
    };

    if (data[KML_FIELDS.type] === KML_TYPES.Polygon) {
      polygonData.push(mapObject);
    } else if (data[KML_FIELDS.type] === KML_TYPES.Point) {
      //const markerObject = { ...mapObject, ...placeData }; 
      markerData.push(mapObject);
    } else {
      polylineData.push(mapObject); // KML_TYPE Polyline and Track
    }
  });
  return {
    markers: markerData,
    polygons: polygonData,
    polylines: polylineData
  };
}

