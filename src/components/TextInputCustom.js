import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {colors} from '../res/colors';
import {fonts} from '../res/fonts';
import globalStyles from '../res/globalStyles';
import {images} from '../res/images';
import {DEVICE_OS} from '../utils/constants';
export default class TextInputCustom extends Component {
  render() {
    return this.props.isSearchBox ? (
      <TouchableOpacity
        activeOpacity={1}
        style={[
          globalStyles.searchBox,
          {flex: null},
          this.props.isWithoutBox && {
            backgroundColor: colors.TRANS,
            width: null,
            maxWidth: wp('70%'),
          },
        ]}
        onPress={this.props.onViewClicked}>
        {!this.props.isAddPlaylist && (
          <Image
            source={images.search}
            style={[
              globalStyles.img,
              {
                height: wp('4%'),
                width: wp('4%'),
                position: 'absolute',
                left: wp('4.2%'),
              },
            ]}
          />
        )}
        <TextInput
          ref={this.props.refs}
          pointerEvents={this.props.isClickable && 'none'}
          placeholder={this.props.placeTxt}
          style={[
            styles.TextInputStyle,
            {
              width: this.props.isWithoutBox ? null : wp('84%'),
              height: this.props.isAddPlaylist ? wp('8%') : null,
              paddingLeft: this.props.isAddPlaylist ? wp('1%') : wp('7%'),
              fontSize: wp('4.5%'),
              fontSize: wp('4%'),
              fontFamily: fonts.QE,
            },
            this.props.isAddPlaylist && {paddingRight: wp('10%')},
            this.props.isWithoutBox && {
              fontSize: wp('5.8%'),
              color: colors.white,
              paddingRight: wp('6%'),
            },
          ]}
          placeholderTextColor={this.props.placeholderTextColor}
          onChangeText={this.props.onChangeText}
          value={this.props.value}
          showSoftInputOnFocus={true}
          editable={this.props.editable}
          keyboardType={'default'}
          onFocus={this.props.onFocus}
          returnKeyType={this.props.returnKeyType}
          selectionColor={DEVICE_OS === 'ios' && colors.white}
          onSubmitEditing={this.props.onSubmitEditing}
        />
        {this.props.isAddPlaylist && (
          <TouchableOpacity
            style={{position: 'absolute', right: wp('3%')}}
            onPress={this.props.onAddClicked}>
            {!this.props.isLoading ? (
              <Image
                style={[
                  globalStyles.img,
                  {height: wp('6%'), width: wp('6%')},
                  this.props.isWithoutBox && {
                    height: wp('4.5%'),
                    width: wp('4.5%'),
                  },
                ]}
                source={
                  this.props.isWithoutBox
                    ? images.pencilBlack
                    : this.props.isMinor
                    ? images.addOrange
                    : images.add
                }
              />
            ) : (
              <ActivityIndicator size="small" color={colors.white} />
            )}
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    ) : this.props.forgot !== 'yes' ? (
      <View
        style={{
          alignItems: 'center',
          marginTop: this.props.isProfile ? -wp('2.2%') : -8,
        }}>
        <TextInput
          placeholder={this.props.placeTxt}
          style={[
            styles.TextInputStyle,
            this.props.isProfile && {
              width: wp('91%'),
              fontSize: wp('3.8%'),
              color: colors.black,
            },
          ]}
          placeholderTextColor={this.props.placeholderTextColor}
          onChangeText={this.props.onChangeText}
          secureTextEntry={this.props.secureTextEntry === true ? true : false}
          value={this.props.value}
          autoFocus={this.props.autoFocus}
          showSoftInputOnFocus={true}
          multiline={this.props.multiline}
          editable={this.props.editable}
          keyboardType={this.props.email ? 'email-address' : 'default'}
          autoCapitalize={
            this.props.words
              ? 'words'
              : this.props.email || this.props.password
              ? 'none'
              : 'sentences'
          }
          autoCorrect={false}
          selectionColor={DEVICE_OS === 'ios' && colors.white}
        />
        <View
          style={{
            height: hp('0.2%'),
            width: this.props.isProfile ? wp('91%') : wp('80%'),
            backgroundColor: this.props.isProfile
              ? colors.grayDark
              : colors.grayDark,
            top: this.props.isProfile ? -wp('2.5%') : -4,
          }}
        />
      </View>
    ) : (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: -7,
          }}>
          <TextInput
            placeholder={this.props.placeTxt}
            style={styles.TextInputForgotStyle}
            placeholderTextColor={colors.grayDark}
            onChangeText={this.props.onChangeText}
            secureTextEntry={this.props.secureTextEntry === true ? true : false}
            value={this.props.value}
            selectionColor={DEVICE_OS === 'ios' && colors.white}
            multiline={this.props.multiline}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.forgotWrapper}
            onPress={this.props.onPress}>
            <Image
              source={images.forgot}
              style={{
                height: hp('3%'),
                width: wp('18%'),
                resizeMode: 'contain',
                marginTop: wp('1%'),
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: hp('0.2%'),
            width: wp('80%'),
            backgroundColor: colors.grayDark,
            top: -7,
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  TextInputStyle: {
    color: colors.black,
    height: DEVICE_OS === 'ios' ? hp('5%') : hp('6%'),
    width: wp('80%'),
    margin: hp('0.5%'),
    // fontSize: DEVICE_OS === 'ios' ? hp('2.3%') : hp('2.7%'),
    fontSize: wp('4.5%'),
    fontFamily: fonts.FM,
    padding: 0,
  },
  TextInputForgotStyle: {
    color: colors.black,
    height: DEVICE_OS === 'ios' ? hp('5%') : hp('6%'),
    width: wp('50%'),
    margin: hp('0.5%'),
    marginLeft: 0,
    fontFamily: fonts.FM,
    // fontSize: DEVICE_OS === 'ios' ? hp('2.3%') : hp('2.7%'),
    fontSize: wp('4.5%'),
    padding: 0,
  },
  forgotWrapper: {
    marginBottom: hp('1%'),
  },
});
