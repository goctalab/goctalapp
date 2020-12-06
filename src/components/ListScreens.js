import { useContext } from 'react';
import { PlacesContext } from '@components/PlacesContextProvider';
import { PLACE_CATEGORIES, groupPlacesByType } from '@utils/placesUtils';
import ListDetailNavigatorComponent from '@components/ListDetailNavigatorComponent';

/**
 * @description gets the component fed with the array of data we want from the context
 * @param {String} categoriesForScreen corresponds to the placeType 
 * of array we want from the PlacesContext 
 * @param {object} props 
 * @returns the screen component which is List with Detail
 */
const getScreen = (categoriesForScreen, props) => {
  const { placesData } = useContext(PlacesContext);
  const placesByCategory = groupPlacesByType(placesData);
 
  if (!Array.isArray(categoriesForScreen)) {
    categoriesForScreen = [ categoriesForScreen ];
  }
  const listItems = categoriesForScreen.reduce((data, cat) =>
    placesByCategory[cat] ? data.concat(placesByCategory[cat]) : data, []
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



