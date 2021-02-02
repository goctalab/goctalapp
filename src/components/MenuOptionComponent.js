import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@utils/styleUtils';

export default function MenuOption(props) {
  const { isSelected,
    onClick,
    text
  } = props;

  const textStyle = isSelected ? styles.selected : styles.deselected;

  return <TouchableOpacity 
          onPress={() => { onClick(!isSelected); }}
          {...props} >
          <Text style={{ fontFamily: 'Montserrat_600SemiBold', ...textStyle }}>{text}</Text>
        </TouchableOpacity>

}

const styles = StyleSheet.create({
  selected: {
    color: colors["Eggshell"],
  },
  deselected: {
    color: 'black',
  }
});
