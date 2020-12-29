import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import * as Permissions from 'expo-permissions';

import { MapContextProvider } from '@components/MapContextProvider';
import { PlacesContextProvider } from '@components/PlacesContextProvider';

import dbUtils from '@data/dbUtils';
import MainView from './MainView';

export default function(props) {
  const [ mapData, setMapData ] = useState([]);
  const [ placesData, setPlacesData ] = useState([]);

  //https://medium.com/quick-code/react-native-location-tracking-14ab2c9e2db8
  useEffect(() => {
    askPermissions();
    initDb();
  }, [props]);


  async function askPermissions() {
    const { status } = await Permissions.askAsync(
      Permissions.LOCATION
    );
    console.log("asked perms", status);
    if (status !== 'granted') {
      alert('Ooops, You have not enabled location permissions.');
    } else {
      
    }
  }

  async function initDb() {
    await dbUtils.init();
    dbUtils.getAllKML((kml) => {
      setMapData(kml);
    });
    dbUtils.getAllPlaces((places) => {
      setPlacesData(places);
    });
  }

  return (
    <MapContextProvider state={ mapData }>
       <PlacesContextProvider state={ placesData }>
          <MainView />
      </PlacesContextProvider>
    </MapContextProvider>
  );
}
