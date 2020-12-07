import TestRenderer from 'react-test-renderer';
import { ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import { DETAILS_ROUTE } from '@utils/routeUtils';
import ListViewComponent, { DetailViewLink, configureOnPress }
  from '@components/ListViewComponent';

const navigation = {
  navigate: jest.fn()
}

const route = "details_route_name";

const items = [
  { 
    title: "A Title 1",
    rowid: 1,
    filename: "deck.kml"
  },
  {
    title: "A Title 2",
    rowid: 2,
    filename: "pond.kml"
  },
  {
    title: "A Title 3",
    rowid: 3,
    filename: "other_site.kml"
  }
];

describe("ListViewComponent", () => {
  describe("configureOnPress creates a navigation callback fn for each list item and", () => {
    it("returns a function", () => {
      expect(typeof configureOnPress()).toEqual("function");
    });

    it("returns a fn that calls navigator with expected params", () => {
      const onPress = configureOnPress(navigation, route, items[0]);
      onPress();
      expect(navigation.navigate).toBeCalledWith(route,
        { title: items[0].title, id: items[0].rowid, filename: items[0].filename})
    });
  });

  describe("DetailViewLink", () => {

    let testRenderer;
    let onPress = () => { return true };
      
    beforeAll(() => {
      testRenderer = TestRenderer.create(
        <DetailViewLink item={items[1]} index={1} onPress={onPress} />
      );
    });

    afterAll(() => {
      testRenderer = null;
      onPress = null;
    });

    it("returns touchable feedback link with title text of item", () => {
      const testInstance = testRenderer.root;
      expect(testInstance.props.onPress).toBe(onPress);
      expect(testInstance.findByType(Text).props.children).toEqual(items[1].title);
    });

    it("returns touchable feedback link with onPress attached", () => {
      const testInstance = testRenderer.root;
      expect(testInstance.props.onPress).toBe(onPress);
    });
  });


  describe("ListViewComponent", () => {
    it("renders a scroll view with links that correspond to each item", () => {
      const testRenderer = TestRenderer.create(<ListViewComponent listItems={items} navigation={navigation} />);
      const instance = testRenderer.root;

      const touchableLinks = instance.findAllByType(TouchableWithoutFeedback);
      expect(touchableLinks.length).toBe(items.length);
    });
  })
})
