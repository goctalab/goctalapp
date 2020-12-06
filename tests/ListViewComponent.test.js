import TestRenderer from 'react-test-renderer';
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
  }
];

describe("ListViewComponent", () => {

  describe("configureOnPress", () => {
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
    it("returns touchable feedback link with onPress attached", () => {

    });
  });

  describe("ListViewComponent", () => {
    it("renders a scroll view with links that correspond to each item", () => {

    });
  })
})
