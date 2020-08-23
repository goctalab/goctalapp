import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MenuItemComponent from './MenuItemComponent';
import Icon from 'react-native-vector-icons/FontAwesome';

const openIcon = <Icon name="caret-down" size={30} color="#900" />;
const closeIcon = <Icon name="caret-up" size={30} color="#900" />;

export default function MenuComponent(props) {
  const { isOpen,
          menuOptions,
          selectedOptions,
          onMenuClick,
          onItemClicked } = props;

  const menuItems = menuOptions.map((option) => {
    return <MenuItemComponent 
              style={[styles.menuItem, selectedOptions.includes(option) ? styles.selected : styles.deselected ]} 
              onClick={(isSelected) => onItemClicked(option, isSelected)}
              key={option}
              text={option} />
  });

  return (
    <View style={styles.menuContainer}>
      <View style={[ styles.flexRow, styles.justifyEnd ]}>
        <TouchableOpacity style={[ styles.flexRow, styles.menuControl ]} onPress={onMenuClick}>
          { isOpen ? closeIcon : openIcon }
        </TouchableOpacity>
      </View>
      { isOpen &&
        <View style={styles.menuItemsContainer}>
          {menuItems}
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  menuContainer: {
    position: "absolute",
    zIndex: 2,
    top: 0,
    right: 0,
    height: 200
  },
  menuControl: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    color: "black",
    justifyContent: "center"
  },
  menuItemsContainer: {
    display: "flex",
  },
  menuItem: {
    padding: 12,
    width: 140
  },
  deselected: {
    backgroundColor: "#FFFFFF",
    color: 'black'
  },
  selected: {
    backgroundColor: "#CCCCCC",
  }
});
