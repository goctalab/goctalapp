import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import DetailViewComponent, { goToMapTitle } from '@components/DetailViewComponent';
import dbUtils from '@data/dbUtils';
import { HOME_ROUTE } from '@utils/routeUtils';

describe("DetailViewComponent", () => {

  const description = "banana filter for water";
  const title = "Banana Filter";
  const id = 10;
  const filename =  "test_site.kml";

  dbUtils.getDetailsForPlace = jest.fn().mockImplementation((callback) => {
    callback({ description })
  });

  const navigation = {
    navigate: jest.fn(),
    goBack: jest.fn()
  }

  const params = {
    id,
    title,
    filename,
    from_map: false
  }

  let testRenderer;

  it("renders the title and description", () => {
    TestRenderer.act(
      () => { 
        testRenderer = TestRenderer.create(<DetailViewComponent route={{ params }} navigation={navigation} />);
      }
    );
    const testInstance = testRenderer.root;
    const [ titleEl, descriptionEl, ...els ] = testInstance.findAllByType(Text);
    expect(titleEl.props.children).toEqual(title);
    expect(descriptionEl.props.children).toEqual(description);
  });

  describe("Go to Map View link", () => {

    it("renders when not in map view", () => {
      testRenderer = TestRenderer.create(<DetailViewComponent route={{ params }} navigation={navigation} />);
      const testInstance = testRenderer.root;
      expect(() => {
        testInstance.findByProps({ title: goToMapTitle });
      }).not.toThrow();
    });

    it("does not render when from map view", () => {
      const params_map = {
        ...params,
        from_map: true
      };

      testRenderer = TestRenderer.create(<DetailViewComponent route={{ params: params_map }} navigation={navigation} />);
      const testInstance = testRenderer.root;
      expect(() => testInstance.findByProps({ title: goToMapTitle })).toThrow();
    });

    it("click on link opens map view dtail", () => {
      testRenderer = TestRenderer.create(<DetailViewComponent route={{ params }} navigation={navigation} />);
      const testInstance = testRenderer.root;
      const button = testInstance.findByProps({ title: goToMapTitle });
      button.props.onPress();
      expect(navigation.navigate).toHaveBeenCalledWith(HOME_ROUTE, { selected_marker: filename });
    });
  });

});

