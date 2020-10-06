// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export const HOME_ROUTE = "home";
export const POI_ROUTE = "pointsOfInterest";
export const FLORA_FAUNA_ROUTE = "floraFauna";
export const TREKS_ROUTE = "treks";
export const FARM_ROUTE = "farm";

export function getListViewTitle(route) {

  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  
  // const routeName = getFocusedRouteNameFromRoute(route) ?? HOME_ROUTE;
  
  switch (route.name) {
    case HOME_ROUTE:
      return "🗺️ Map";
    case FLORA_FAUNA_ROUTE:
      return '🌺 Flora y Fauna';
    case TREKS_ROUTE:
      return "🥾 Treks";
    case POI_ROUTE:
      return "📍 Points of Interest";
    case FARM_ROUTE:
      return "🌱 Experimental Farm";
    default:
      return "Home";
  }
}


/**
 * @description creates a unique route name for the item
 * @param {Object} item from the data base
 * @return {String}
 */
export const getRouteNameFromKMLItem = (item) => `${item.filename}_${item.rowid}`;


