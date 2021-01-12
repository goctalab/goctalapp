import React from 'react';
import TestRenderer from 'react-test-renderer';
import { markersProcessed as markers, markersProcessed  } from './mockMarkers.js';
import MarkerComponent from '@components/MarkerComponent';
import { Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { DETAILS_ROUTE } from '@utils/routeUtils';

jest.unmock('react-native-maps');

// jest.requireActual('react-native-maps');

describe("MarkerComponent", () => {
  it("calls the onPress callback with proper marker info when a marker is clicked", () => {
    const onPress = jest.fn().mockImplementation((e, markerData) => {});

    let tr; 
    const e = {};
    TestRenderer.act(() => {
      tr = TestRenderer.create(<MarkerComponent 
      markerData={markers[0]}
      isSelected={false}
      onPress={onPress}
    />)});

    tr.root.children[0].props.onPress(e);
    expect(onPress).toHaveBeenCalledWith(expect.anything(), markers[0]);
  });

  it.only("calls detail view with appropriate data when a callout is clicked", () => {
    const onPress = jest.fn().mockImplementation((e, markerData) => {});
    const navigation = useNavigation();
    const navigateSpy = jest.spyOn(navigation, "navigate");
    const marker = markers[0];
    const { placeData } = marker;

    TestRenderer.act(() => {
      tr = TestRenderer.create(<MarkerComponent 
      markerData={marker}
      isSelected={false}
      onPress={onPress}
    />)});

    const callout = tr.root.findByType(Callout);
    callout.props.onPress();
    expect(navigateSpy).toHaveBeenCalledWith(DETAILS_ROUTE, { id: placeData.rowid, title: placeData.title, from_map: true })
  });
});
