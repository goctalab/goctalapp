
import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet } from 'react-native';

function ListViewComponent(props) {
  const { navigation, route, listItems } = props;

  const detailViewLinks = listItems.map((item, i) => {
    const params = { title: item.title, id: item.kml_file };
    return (<TouchableWithoutFeedback
      style={styles.item}
      key={i}
      onPress={() => navigation.navigate(route, params )}
      {...props}>
      <Text style={[styles.item, styles.text]}>{item.title}</Text>
    </TouchableWithoutFeedback>)
  }); 

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
    // padding: 25,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "lightgrey",
    borderWidth: 1,
    borderColor: "transparent",
    margin: 1
  },
  text: {
    fontSize: 18,
  }
});
