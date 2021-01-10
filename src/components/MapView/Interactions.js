export const openMarker = (selectedMarker, mapRef) => {
  if (!(selectedMarker && selectedMarker.openCallout)) {
   return;
  }
  console.log(`selected marker ${selectedMarker}`);
  centerMap(getRegionWithCoordinate(selectedMarker.coordinate), mapRef);
  selectedMarker.openCallout();
}

const onMapItemClick = (e, mapItemData, setState) => {
  setState(mapItemData);
  // console.log(mapItemData, mapItemData.coordinates[0]);
  MapViewInteractions.centerMap(mapItemData.coordinates[0], mapRef);
}  

export const centerMap = (coordinate, mapRef) => {
  const region = getRegionWithCoordinate(coordinate);
  // console.log("centering", region, mapRef);
  mapRef.current.animateToRegion(region, 300);
}

const CENTER_START_COORDINATES = { longitude: -77.89741388888889, latitude: -6.055380555555556 };
const DELTA = 0.0019;

const getRegionWithCoordinate = (coordinate) => {
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    latitudeDelta: DELTA,
    longitudeDelta: DELTA,
  }
};

 // TODO do we need this?
 export const getInitialRegion = () => {
  return {
    latitude: CENTER_START_COORDINATES.latitude,
    longitude: CENTER_START_COORDINATES.longitude,
    latitudeDelta: DELTA,
    longitudeDelta: DELTA
  }
}

