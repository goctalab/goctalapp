
import React from 'react';
import { View, Text, Button, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet } from 'react-native';

function ListViewComponent(props) {
  const { navigation, listItems } = props;
  const detailViewLinks = listItems.map((item, i) => (<TouchableWithoutFeedback
      key={i}
      onPress={() => navigation.navigate(item.title)}
    {...props}>
      <Text style={styles.item}>{item.title}</Text>
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
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  item: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
  }
});
