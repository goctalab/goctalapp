import React from 'react';
import TestRenderer from 'react-test-renderer';
import * as MapViewInteractions from '@components/MapView/Interactions';
import * as MapViewLayers from '@components/MapView/Layers';
import MapViewComponent from '@components/MapViewComponent';
import * as MapContextModule from '@components/MapContextProvider';
import markers from './mockMarkers.js';

// TODO move to mocks
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

const navigation = {
  navigate: jest.fn()
}

const route = {
  params: {}
}

describe("MapViewComponent", () => {

  let useContextSpy;
  
  beforeEach( () => {
    useContextSpy = jest.spyOn(MapContextModule, "useMapContext").mockImplementation(
      () => {
        // console.log("calling fake useMapContext",  { mapData: markers });
        return { mapData: markers }
      }
    );
  });

  // beforeEach(() => {
  //   useContextSpy = jest.spyOn(React, "useContext").mockImplementation(
  //     () => {
  //       console.log("calling fake useMapContext",  { mapData: markers });
  //       return { mapData: markers }
  //     }
  //   );
  // });

  afterEach(() => {
    useContextSpy.mockReset();
  } );

  // kml data test
  // more reason to break this part out into a context or somethin
  // describe("layer menu behavior", () => {
  // });

  describe("map and marker behavior", () => {

    it("calls renderMarkers for every kml point from the context", () => {
      MapViewLayers.renderMarkers = jest.fn().mockImplementation(() => {});
      TestRenderer.act(
        () => { TestRenderer.create(<MapViewComponent route={{}} navigation={navigation} />) }
      );
      const md = MapViewInteractions.parseMapData(markers);
      // last called to wait for context and useEffect to be called
      expect(MapViewLayers.renderMarkers).toHaveBeenLastCalledWith(
        md.markers,
        expect.anything(), 
        null,
        expect.anything());
      MapViewLayers.renderMarkers.mockRestore();
    });

    it("opens the correct callout when it receives marker params", () => {
      // set up the map
      useContextSpy.mockReturnValue({ mapData: markers });
      MapViewInteractions.openMarker = jest.fn().mockImplementation(() => {});
      MapViewLayers.renderMarkers = jest.fn().mockImplementation(() => {});

      const route_marker = {
        params: { selected_marker: markers[0].filename }
      }
      TestRenderer.act(
        () => { TestRenderer.create(<MapViewComponent route={route_marker} navigation={navigation} />) }
      );
      expect(MapViewInteractions.openMarker).toHaveBeenCalled();
   });
    
    it("sets appropriate marker as selected in onMapItemClick", () => {
      // MapViewComponent
    });
  });

});
