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
