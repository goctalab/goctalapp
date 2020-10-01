import React, { useState, useEffect } from 'react';

export const PlacesContext = React.createContext({ trek: [] })

export const PlacesContextProvider = (props) => {
  const initState = props.state || {};
  const [ placesData, setState ] = useState(initState);

  // https://medium.com/@justintulk/react-anti-patterns-props-in-initial-state-28687846cc2e
  useEffect(() => {
    setState(initState);
  },[ props.state ]);

  return (
    <PlacesContext.Provider value={{ placesData }}>
      { props.children }
    </PlacesContext.Provider>
  )
}
