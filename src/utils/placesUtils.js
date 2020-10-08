import { PLACE_FIELDS } from '@data/dbUtils';

/**
 * @description categories that map to category in the db
 */
export const PLACE_CATEGORIES = {
  pointOfInterest: "point_of_interest",
  path: "path",
  trek: "trek",
  flora: "flora",
  fauna: "fauna"
};

export const groupPlacesByType = (places) => places.reduce((grpData, place) => {
  if (!grpData[place[PLACE_FIELDS.category]]) {
    grpData[place[PLACE_FIELDS.category]] = [];
  }

  switch(place[PLACE_FIELDS.category]) {
    case PLACE_CATEGORIES.pointOfInterest:
      grpData[PLACE_CATEGORIES.pointOfInterest].push(place);
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
