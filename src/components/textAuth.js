import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { fonts } from '../res/fonts';
import { hp } from '../utils/constants';
export default class TextAuth extends Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <Text style={{ fontSize: hp('3%'), fontFamily: fonts.QE, color: this.props.TextColor }}>
                    {this.props.title}
                </Text>
            </TouchableOpacity>

        )
    }
}