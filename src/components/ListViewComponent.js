
import React from 'react';
import { ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet } from 'react-native';
import { PLACE_FIELDS } from '@data/dbUtils';
import { colors } from '@utils/styleUtils';
import { DETAILS_ROUTE } from '@utils/routeUtils';


export function DetailViewLink(props) {
  const { item, index, onPress } = props;
  return (<TouchableWithoutFeedback
    style={styles.item}
    key={index}
    onPress={onPress}>
    <Text style={[styles.item, styles.text]}>{item[PLACE_FIELDS.title]}</Text>
  </TouchableWithoutFeedback>)
}

export function configureOnPress(navigation, route, item) {
  const params = {
    title: item[PLACE_FIELDS.title],
    id: item.rowid,
    filename: item[PLACE_FIELDS.filename]
  };

  return (() => {
    // console.log("navigating", route, params);
    navigation.navigate(route, params)
  })
}

function ListViewComponent(props) {
  const { navigation, listItems } = props;

  const detailViewLinks = listItems.map((item, index) => {
    const onPress = configureOnPress(navigation, DETAILS_ROUTE, item);
    return DetailViewLink({ item, index, onPress }) ;
  }); 

  return (
    <ScrollView style={styles.container}>
      { detailViewLinks }
    </ScrollView>
  );
};

// https://reactnavigation.org/docs/hello-react-navigation/#passing-additional-props
const memoized = React.memo(ListViewComponent);
export default memoized;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDDDDD',
  },
  item: {
    backgroundColor: 'white', // colors["Eggshell"],
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "transparent",
    margin: 1
  },
  text: {
    fontSize: 18,
    fontFamily: 'Montserrat_400Regular',
  }
});
