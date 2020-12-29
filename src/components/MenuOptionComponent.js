import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function MenuOption(props) {
  const { isSelected,
    onClick,
    text } = props;
  return <TouchableOpacity 
          onPress={() => { onClick(!isSelected); }}
          {...props} >
          <Text style={{ fontFamily: 'Montserrat_600SemiBold' }}>{text}</Text>
        </TouchableOpacity>

}
