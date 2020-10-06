
import { useContext } from 'react';
import { PlacesContext } from '@src/PlacesContextProvider';
import { PLACE_CATEGORIES } from '@src/placesUtils';

import ListDetailNavigatorComponent from '@components/ListDetailNavigatorComponent';

/**
 * @description gets the component fed with the array of data we want from the context
 * @param {String} placeCategoriesForScreen corresponds to the placeType 
 * of array we want from the PlacesContext 
 * @param {object} props 
 * @returns the screen component which is List with Detail
 */
const getScreen = (placeCategoriesForScreen, props) => {
  const { placesData } = useContext(PlacesContext);

  if (!Array.isArray(placeCategoriesForScreen)) {
    placeCategoriesForScreen = [ placeCategoriesForScreen ];
  }
  const listItems = placeCategoriesForScreen.reduce((data, key) =>
    placesData[key] ? data.concat(placesData[key]) : data, []
  );
  return ListDetailNavigatorComponent({ listItems, ...props});
}

/**
 * @description named screen exports
 */
export const PointsOfInterestScreen = (props) => getScreen(PLACE_CATEGORIES.pointOfInterest, props);
export const FloraFaunaScreen = (props) => getScreen([PLACE_CATEGORIES.flora, PLACE_CATEGORIES.fauna], props);
export const TreksScreen = (props) => getScreen([PLACE_CATEGORIES.trek, PLACE_CATEGORIES.fauna], props);
export const FarmScreen = (props) => getScreen(PLACE_CATEGORIES.pointOfInterest, props);



