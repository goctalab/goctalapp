
import React from 'react';
import { ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet } from 'react-native';
import { getScreenNameFromSiteItem } from '@utils/routeUtils';
import { PLACE_FIELDS } from '@data/dbUtils';
import { colors } from '@utils/styleUtils';

function ListViewComponent(props) {
  const { navigation, route, listItems } = props;

  const detailViewLinks = listItems.map((item, i) => {
    const params = { title: item[PLACE_FIELDS.title], id: item.rowid };
    const routeName = getScreenNameFromSiteItem(item);
    
    return (<TouchableWithoutFeedback
      style={styles.item}
      key={i}
      onPress={() => {
        console.log("navigating", route, params);
        navigation.navigate(routeName, params)
      }}
      {...props}>
      <Text style={[styles.item, styles.text]}>{item[PLACE_FIELDS.title]}</Text>
    </TouchableWithoutFeedback>)
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
    backgroundColor: 'white',
  },
  item: {
    backgroundColor: colors["Eggshell"],
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
