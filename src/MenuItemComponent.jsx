import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPressed: false
    }
  }

  render() {
    return <TouchableOpacity 
            onPress={() => { 
              this.props.onClick(!this.state.isPressed);
              this.setState({ isPressed: !this.state.isPressed })
            }}
            {...this.props} >
            <Text>{this.props.text}</Text>
          </TouchableOpacity>
  }
}
