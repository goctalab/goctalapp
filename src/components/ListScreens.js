
import React, { useContext, useState, useEffect } from 'react';
import { PlacesContext } from '@src/PlacesContextProvider';
import { PLACE_TYPES } from '@src/placesUtils';

import ListDetailNavigatorComponent from '@components/ListDetailNavigatorComponent';

export function PointsOfInterestScreen(props) {
  const { placesData } = useContext(PlacesContext);
  //const [ listItems, setListItems ] = useState([]);
  
  // useEffect(() => {
  //   setListItems(placesData[PLACE_TYPES.pointsOfInterest]);
  // }, [ placesData ]);

  const listItems = placesData[PLACE_TYPES.pointsOfInterest];

  return ListDetailNavigatorComponent({listItems, ...props});
}

export function FloraFaunaScreen(props) {
  const { placesData } = useContext(PlacesContext);
  
  const listItems = placesData[PLACE_TYPES.floraFauna];
  debugger
  return ListDetailNavigatorComponent({listItems, ...props});
}



