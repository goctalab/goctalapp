
import React from 'react';

const { Component } = require('react');
const { View, Animated } = require('react-native');

// https://github.com/react-native-maps/react-native-maps/issues/2918

class MockMapView extends Component {
  render() {
    return <View>{this.props.children}</View>;
  }
}

class MockMarker extends Component {
  render() {
    return <View>{this.props.children}</View>;
  }
}

MockMarker.showCallout = () => {};

class MockAnimated extends Component {
  render() {
    return <Animated.View>{this.props.children}</Animated.View>;
  }
}

class MockAnimatedRegion extends Component {
  render() {
    return <Animated.View>{this.props.children}</Animated.View>;
  }
}

const mockMapTypes = {
  STANDARD: 0,
  SATELLITE: 1,
  HYBRID: 2,
  TERRAIN: 3,
  NONE: 4,
  MUTEDSTANDARD: 5,
};

MockMapView.Animated = MockAnimated;
MockMapView.AnimatedRegion = MockAnimatedRegion;

module.exports =  {
  __esModule: true,
  default: MockMapView,
  Marker: MockMarker,
  Callout: MockMapView,
  // Animated: MockOverlay,
  MAP_TYPES: mockMapTypes,
  PROVIDER_DEFAULT: 'default',
  PROVIDER_GOOGLE: 'google',
};
