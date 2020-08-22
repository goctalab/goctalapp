import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { KML_TYPES } from './kmlUtils';

export default function MenuComponent(props) {
  // props menu items
  // current item
  const isOpen = props.isOpen;
  const menuItems = (Object.keys(KML_TYPES)).map((kmlType) => {
    return <Button style={styles.navItem} 
      onPress={() => props.onItemClicked(kmlType)}
      key={kmlType}
      title={kmlType} />
  });
  return (
    <View style={styles.nav}>
      <Button color="#FFFFFF" onPress={props.onClick} title={ isOpen ? '^' : 'v' } ></Button>
      { isOpen &&
        menuItems }
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    zIndex: 2,
    top: 20,
    right: 20
  },
  menuControl: {
    width: 40,
    height: 40,
    // position: "absolute",
    backgroundColor: '#FFF',
    zIndex: 2
  },
  navItem: {
    padding: 10,
    width: 100,
    // border: "1px solid gray",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    color: 'black'
  }
});
