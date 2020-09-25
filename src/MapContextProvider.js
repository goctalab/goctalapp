import React, { useState, useEffect } from 'react';

export const MapContext = React.createContext([{ testMarker: "testing" }])

export const MapContextProvider = (props) => {
  const initState = props.state || [];
  const [ state, setState ] = useState([]);

  // https://medium.com/@justintulk/react-anti-patterns-props-in-initial-state-28687846cc2e
  useEffect(() => {
    setState(initState);
  },[ props.state ]);

  console.log(initState);

  return (
    <MapContext.Provider value={{ mapData: state }}>
      { props.children }
    </MapContext.Provider>
  )
}
