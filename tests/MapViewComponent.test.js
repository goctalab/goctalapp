import React from 'react';
import TestRenderer from 'react-test-renderer';
import * as MapViewInteractions from '@components/MapView/Interactions';
import * as MapViewLayers from '@components/MapView/Layers';
import MapViewComponent, { getOnMapItemClick, parseMapData } from '@components/MapView/MapViewComponent';
import * as MapContextModule from '@components/MapContextProvider';
import markers from './mockMarkers.js';
import navigation from '@react-navigation/native';

jest.mock('react-native-vector-icons/Feather', () => {
  const { View } = require('react-native');
  const { Component } = require('react');

  class MockIcon extends Component {
    render() {
      return <View>{this.props.children}</View>;
    }
  }
  return {
    __esModule: true,
    default: MockIcon
  }
});

jest.mock('react-native-vector-icons/FontAwesome', () => {
  const { View } = require('react-native');
  const { Component } = require('react');

  class MockIcon extends Component {
    render() {
      return <View>{this.props.children}</View>;
    }
  }
  return {
    __esModule: true,
    default: MockIcon
  }
});

const route = {
  params: {}
}

describe("MapViewComponent", () => {

  let useContextSpy;
  
  beforeEach( () => {
    useContextSpy = jest.spyOn(MapContextModule, "useMapContext").mockImplementation(
      () => {
        return { mapData: markers }
      }
    );
  });

  afterEach(() => {
    useContextSpy.mockReset();
  } );
  
  it("calls renderMarkers for every kml point from the context", () => {
    jest.spyOn(MapViewLayers, 'renderMarkers').mockImplementation(() => {});
  
    TestRenderer.act(
      () => { TestRenderer.create(<MapViewComponent route={{}} navigation={navigation} />) }
    );
    const mapData = parseMapData(markers);
    // last called to wait for context and useEffect to be called
    expect(MapViewLayers.renderMarkers).toHaveBeenLastCalledWith(
      mapData.markers,
      expect.anything(), 
      null,
      expect.anything());

    MapViewLayers.renderMarkers.mockRestore();
  });
  
  it.only("calls openMarker to show callout when it receives marker params on map load", () => {
    jest.spyOn(MapViewInteractions, 'openMarker').mockImplementation(() => {});
    jest.spyOn(MapViewLayers, 'renderMarkers').mockImplementation(() => {});

    const route_marker = {
      params: { selected_marker: markers[0].filename }
    }
    TestRenderer.act(
      () => { TestRenderer.create(<MapViewComponent route={route_marker} navigation={navigation} />) }
    );
    expect(MapViewInteractions.openMarker).toHaveBeenCalled();
    MapViewInteractions.openMarker.mockRestore();
    MapViewLayers.renderMarkers.mockRestore();
  });

  it("sets appropriate marker as selected in onMapItemClick", () => {
    const setSelectedMarkerState = jest.fn();
    const onMapItemClickHandler = getOnMapItemClick(setSelectedMarkerState, { current: { animateToRegion: () => {} } });
    onMapItemClickHandler({}, markers[1]);
    expect(setSelectedMarkerState).toHaveBeenCalledWith(markers[1]);
  });
});

describe("Layers function tests", () => {
  describe("renderMarkers", () => {
    it("generates MarkerComponents for every kml point with markerData as props", () => {
      const markerArray = MapViewLayers.renderMarkers(markers, { current: {} }, null, jest.fn());
      expect(markerArray.length).toBe(markers.length);
      expect(markerArray[0].props.markerData).toEqual(markers[0]);
      expect(markerArray[1].props.markerData).toEqual(markers[1]);
    });
  
    it("sets the correct marker as selected", () => {
      const markerArray = MapViewLayers.renderMarkers(markers, { current: {} }, { rowid: markers[1].rowid }, jest.fn());
      expect(markerArray[0].props.isSelected).toEqual(false);
      expect(markerArray[1].props.isSelected).toEqual(true);
    });
  });
  describe("renderPolygons", () => {});
});
