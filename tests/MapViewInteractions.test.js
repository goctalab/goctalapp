import * as MarkerComponentModule from '@components/MarkerComponent';
import { forwardRef } from 'react';
// jest.mock("../src/components/MarkerComponent");

import * as MapViewInteractions from '@components/MapView/Interactions';
import markers from './mockMarkers';


// jest.mock('../src/components/MarkerComponent', () => {
//   const { forwardRef } = require('react');
//   const Mock = jest.fn().mockImplementation(() => console.log("MOCK"));

//   return jest.fn().mockImplementation(() => {
//     return {
//       __esModule: true,
//       default: forwardRef(Mock), // forwardRef
//       MC: Mock
//     }
//   })
// });


describe("map and marker behavior", () => {
  
  // Map Interactions
  it("renderMarkers generates MarkerComponents for every kml point", () => {
    // const spy = jest.spyOn(MarkerComponentModule, "MC");
    // MarkerComponentModule.MC = jest.fn();
    // MarkerComponentModule.default = forwardRef(jest.fn());

    // console.log("dude", MarkerComponentModule, MarkerComponentModule.MC);
    // MapViewInteractions.renderMarkers(markers, { current: {} }, null, jest.fn());
    // expect(MarkerComponentModule.default.render).toHaveBeenCalledTimes(markers.length);
  });


});

