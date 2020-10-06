export const HOME_ROUTE = "home";
export const POI_ROUTE = "pointsOfInterest";
export const FLORA_FAUNA_ROUTE = "floraFauna";
export const TREKS_ROUTE = "treks";
export const FARM_ROUTE = "farm";

/**
 * @description creates a unique route name for the item
 * @param {Object} item from the data base
 * @return {String}
 */
export const getRouteNameFromKMLItem = (item) => `${item.filename}_${item.rowid}`;


