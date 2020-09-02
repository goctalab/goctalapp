
import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet } from 'react-native';

function ListViewComponent(props) {
  const { navigation, listItems } = props;
  console.log("yo", listItems);
  const detailViewLinks = listItems.map((item, i) => (
    <TouchableWithoutFeedback
      key={i}
      onPress={() => navigation.navigate(item.route, item.params)}
      {...props}>
      <Text style={styles.item}>{item.params.title}</Text>
    </TouchableWithoutFeedback>)
  ); 

  return (
    <View style={styles.container}>
      { detailViewLinks }
    </View>
  );
};

export default React.memo(ListViewComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  item: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
  }
});
