import { PLACE_CATEGORIES } from '@utils/placesUtils';

export const HOME_ROUTE = "home";
export const POI_ROUTE = "pointsOfInterest";
export const FLORA_FAUNA_ROUTE = "floraFauna";
export const TREKS_ROUTE = "treks";
export const FARM_ROUTE = "farm";
export const DETAILS_ROUTE = "details";

export function getListViewTitle(route) {
  switch (route.name) {
    case HOME_ROUTE:
      return "Map";
    case FLORA_FAUNA_ROUTE:
      return "Flora and Fauna";
    case TREKS_ROUTE:
      return "Paths and Trails";
    case POI_ROUTE:
      return "Points of Interest";
    case FARM_ROUTE:
      return "Experimental Farm";
    default:
      return "Home";
  }
}


/**
 * @description creates a unique route name for the item
 * @param {Object} item from the data base
 * @return {String}
 */
export const getScreenNameFromSiteItem = (item) => `${item.filename}_${item.rowid}`;
export const getRouteNameFromCategory = (cat) => {
  switch (cat) {
    case PLACE_CATEGORIES.pointOfInterest:
      return POI_ROUTE;
    case PLACE_CATEGORIES.flora:
    case PLACE_CATEGORIES.fauna:
      return FLORA_FAUNA_ROUTE;
    case PLACE_CATEGORIES.fauna:
      return TREKS_ROUTE;
    case PLACE_CATEGORIES.farm:
      return FARM_ROUTE;
    default:
      return HOME_ROUTE;
  }
}


