import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MenuOptionComponent from '@components/MenuOptionComponent';
import FIcon from 'react-native-vector-icons/Feather';
import { colors } from '@utils/styleUtils';

// https://github.com/oblador/react-native-vector-icons/issues/1215 ??
const closeIcon = <FIcon name="chevrons-down" size={30} color="#FFF" />;
const layerIcon = <FIcon name="layers" size={30} color="#FFF" />;

export default function MenuComponent({ menuOptions, onMenuOptionClicked }) {
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);
  const [ selectedOptions, setSelectedOptions ] = useState([]);
  
  const onMenuButtonClicked = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const onOptionClicked = (clickedOption) => {
    const index = selectedOptions.indexOf(clickedOption);
    if (index > -1) {
      selectedOptions.splice(index, 1);
    } else {
      selectedOptions.push(clickedOption);
    }
    const options = Array.from(new Set(selectedOptions));
    setSelectedOptions(options);
    // options or selectedOptions
    onMenuOptionClicked(options);
  }

  // console.log("selected options", selectedOptions)
  const optionComponents = menuOptions.map((option) => {
    const isToggledOff = selectedOptions.includes(option);
    return <MenuOptionComponent 
            style={[ styles.menuOption, isToggledOff ? styles.deselected : styles.selected ]} 
            ß// confusing because selected is actually deselected layers
            onClick={(isSelected) => onOptionClicked(option, isSelected)}
            isSelected={selectedOptions.indexOf(option) > -1}
            key={option}
            text={option} />
    });
      
  return (
    <View style={styles.menuContainer}>
      <View style={[ styles.flexRow, styles.justifyEnd ]}>
        <TouchableOpacity
          style={ isMenuOpen ? [ styles.flexRow, styles.menuControlOpen ] : [ styles.flexRow, styles.menuControl ]}
          onPress={onMenuButtonClicked}>
          { isMenuOpen ? closeIcon : layerIcon }
        </TouchableOpacity>
      </View>
      { isMenuOpen &&
        <View style={styles.menuOptionsContainer}>
          {optionComponents}
        </View>
      }
    </View>
  );
}

MenuComponent.propTypes = {
  menuOptions: PropTypes.array,
  onMenuOptionClicked: PropTypes.func
};

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
    bottom:'2%',
    left: '5%',
    //height: 200
  },
  menuOptionsContainer: {
    display: "flex",
  },
  menuControl: {
    color: "black",
    justifyContent: "center",
    borderRadius: 8,
    margin: 10,
  },
  menuControlOpen: {
    color: "black",
    justifyContent: "center",
    borderRadius: 8,
    left: -120,
  },
  menuOption: {
    alignItems: 'center',
    marginVertical: 2,
    backgroundColor: colors["Eggshell"],
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: 160,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  deselected: {
    color: colors["Eggshell"],
    backgroundColor: 'transparent',
    borderColor: colors["Eggshell"],
    borderWidth: 1
  },
  selected: {
    backgroundColor: colors["Eggshell"],
  }
});
