export const openMarker = (selectedMarker, mapRef) => {
  if (!(selectedMarker && selectedMarker.openCallout)) {
   return;
  }
  console.log(`selected marker ${selectedMarker}`);
  centerMap(getRegionWithCoordinate(selectedMarker.coordinate), mapRef);
  selectedMarker.openCallout();
}

export const centerMap = (coordinate, mapRef) => {
  const region = getRegionWithCoordinate(coordinate);
  // console.log("centering", region, mapRef);
  mapRef.current.animateToRegion(region, 300);
}

export const CENTER_START_COORDINATES = { longitude: -77.89741388888889, latitude: -6.055380555555556 };
export const DELTA = 0.0019;

const getRegionWithCoordinate = (coordinate) => {
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    latitudeDelta: DELTA,
    longitudeDelta: DELTA,
  }
};

export const getInitialRegion = () => {
  return {
    latitude: CENTER_START_COORDINATES.latitude,
    longitude: CENTER_START_COORDINATES.longitude,
    latitudeDelta: DELTA,
    longitudeDelta: DELTA
}
}

