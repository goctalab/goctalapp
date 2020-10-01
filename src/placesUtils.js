export const PLACE_TYPES = {
  pointsOfInterest : "place_of_interest",
  path: "path",
  trek: "trek",
  flora: "flora",
  fauna: "fauna",
  floraFauna: "floraFauna"
};

export const groupPlacesByType = (places) => places.reduce((grpData, place) => {
  if (!grpData[place.type]) {
    grpData[place.type] = [];
  }
  switch(place.type) {
    case PLACE_TYPES.pointsOfInterest:
      grpData[PLACE_TYPES.pointsOfInterest].push(place);
      break;
    case PLACE_TYPES.flora:
      grpData[PLACE_TYPES.floraFauna].push(place);
      break;
    case PLACE_TYPES.fauna:
      grpData[PLACE_TYPES.floraFauna].push(place);
      break;
    case PLACE_TYPES.trek:
      grpData[PLACE_TYPES.trek].push(place);
      break;
    case PLACE_TYPES.path:
      grpData[PLACE_TYPES.path].push(place);
      break;
  }
  return grpData;
}, {});
