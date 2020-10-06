import { PLACE_FIELDS } from '@data/dbUtils';

export const PLACE_CATEGORIES = {
  pointsOfInterest : "point_of_interest",
  path: "path",
  trek: "trek",
  flora: "flora",
  fauna: "fauna",
  floraFauna: "floraFauna" // maybe unnecesary
};

export const groupPlacesByType = (places) => places.reduce((grpData, place) => {
  if (!grpData[place[PLACE_FIELDS.category]]) {
    grpData[place[PLACE_FIELDS.category]] = [];
  }

  switch(place[PLACE_FIELDS.category]) {
    case PLACE_CATEGORIES.pointsOfInterest:
      grpData[PLACE_CATEGORIES.pointsOfInterest].push(place);
      break;
    case PLACE_CATEGORIES.flora:
      grpData[PLACE_CATEGORIES.flora].push(place);
      break;
    case PLACE_CATEGORIES.fauna:
      grpData[PLACE_CATEGORIES.fauna].push(place);
      break;
    case PLACE_CATEGORIES.trek:
      grpData[PLACE_CATEGORIES.trek].push(place);
      break;
    case PLACE_CATEGORIES.path:
      grpData[PLACE_CATEGORIES.path].push(place);
      break;
  }
  return grpData;
}, {});
