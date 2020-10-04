
import { useContext } from 'react';
import { PlacesContext } from '@src/PlacesContextProvider';
import { PLACE_TYPES } from '@src/placesUtils';

import ListDetailNavigatorComponent from '@components/ListDetailNavigatorComponent';

/**
 * @description gets the component fed with the array of data we want from the context
 * @param {String} placeTypeKey corresponds to the placeType 
 * of array we want from the PlacesContext 
 * @param {object} props 
 * @returns the screen component which is List with Detail
 */
const getScreen = (placeTypeKey, props) => {
  const { placesData } = useContext(PlacesContext);
  const listItems = placesData[placeTypeKey];
  return ListDetailNavigatorComponent({ listItems, ...props});
}

/**
 * @description named screen exports
 */
export const PointsOfInterestScreen = (props) => getScreen(PLACE_TYPES.pointsOfInterest, props);
export const FloraFaunaScreen = (props) => getScreen(PLACE_TYPES.floraFauna, props);



