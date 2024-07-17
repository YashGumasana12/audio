//#region import
//#region RN
import React, {useState} from 'react';
import {Text, View, TextInput, Image, StyleSheet} from 'react-native';
//#endregion
//#region common files
import globalStyles from '../res/globalStyles';
import {hp, wp, DEVICE_OS, APP_NAME, DEVICE} from '../utils/constants';
import {images} from '../res/images';
import {colors} from '../res/colors';
import {fonts} from '../res/fonts';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
//#endregion
//#region third party libs
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Spacer} from '../res/spacer';
import {TouchableOpacity} from 'react-native-gesture-handler';
//#endregion
//#endregion

export const Toolbar = props => {
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const courseReducers = useSelector(state => state.courseReducers);
  //#endregion redux
  //#region local state
  //#endregion local state

  return props.isLandscape ? (
    <View
      style={[
        globalStyles.paddingTop2,
        {
          width: DEVICE.DEVICE_WIDTH,
          zIndex: 100,
          justifyContent: 'space-between',
          backgroundColor: colors.blackBase6,
          padding: wp('3%'),
          paddingLeft: wp('4.5%'),
          paddingRight: wp('4.5%'),
          flexDirection: 'row',
        },
      ]}>
      <View>
        {/* {props.isQuestion && */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={props.onPress}
            disabled={props.isNavDisable || !props.isQuestion}>
            <Image
              style={[
                globalStyles.img,
                {height: wp('9%'), width: wp('9%')},
                (props.isNavDisable || !props.isQuestion) && {
                  tintColor: colors.TRANS,
                },
              ]}
              source={
                authReducers.tappedSongResponse.title !== undefined &&
                authReducers.tappedSongResponse.type.toLowerCase() === 'minor'
                  ? images.orangeBack
                  : images.backRound
              }
            />
          </TouchableOpacity>
          <View style={{marginLeft: wp('3%'), top: wp(1)}}>
            <Text
              style={[
                globalStyles.textHome,
                {fontSize: wp('5%'), width: wp(68)},
                !props.isQuestion && {color: colors.TRANS},
              ]}
              numberOfLines={1}>
              {authReducers.tappedSongResponse.title !== undefined &&
                authReducers.tappedSongResponse.title}
            </Text>
            <Text
              style={[
                globalStyles.textHome,
                {
                  fontSize: wp('4.4%'),
                  color: '#595959',
                  fontFamily: fonts.FM,
                  width: wp(68),
                },
                !props.isQuestion && {color: colors.TRANS},
              ]}
              numberOfLines={1}>
              {authReducers.tappedSongResponse.artist}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: wp('3.5%'),
            paddingHorizontal: wp(12.5),
          }}>
          {/* {props.isQuestion &&
                            <> */}
          {/* <TouchableOpacity onPress={props.onSaveClicked}>
                                <Image style={[globalStyles.img, { height: wp("6.2%"), width: wp("6.2%") }, !authReducers.tappedSongResponse.is_favorite && { tintColor: colors.grayDark }]} source={images.save} />
                            </TouchableOpacity>
                            <Spacer row={wp('1.5%')} /> */}
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 5,
              backgroundColor: colors.grayDark,
            }}>
            <View
              style={[
                styles.majorView,
                {
                  backgroundColor:
                    authReducers.tappedSongResponse.title !== undefined &&
                    authReducers.tappedSongResponse.type.toLowerCase() ===
                      'minor'
                      ? colors.orange
                      : colors.creamBase3,
                },
              ]}>
              <Text style={[globalStyles.textHome, {fontSize: wp('4.3%')}]}>
                {authReducers.tappedSongResponse.type}
              </Text>
            </View>
            <View style={styles.majorView}>
              <Text style={[globalStyles.textHome, {fontSize: wp('4.3%')}]}>
                {authReducers.tappedSongResponse.original_key}
              </Text>
            </View>
          </View>
          {/* <Spacer row={wp('1.5%')} />
                            <TouchableOpacity onPress={props.onChordsClicked}>
                                <Image style={[globalStyles.img, { height: wp("7%"), width: wp("23%") }]} source={props.isChords ? images.chordsOn : images.chordsOff} />
                            </TouchableOpacity> */}
          <Spacer row={wp('1.5%')} />
          {/* </>} */}
        </View>
      </View>
      <View>
        {/* {props.isQuestion && */}
        <TouchableOpacity
          onPress={props.onOptionMenuClicked}
          disabled={!props.isQuestion}>
          <Image
            style={[
              globalStyles.img,
              {height: wp('9%'), width: wp('9%')},
              !props.isQuestion && {tintColor: colors.TRANS},
            ]}
            source={
              authReducers.tappedSongResponse.title !== undefined &&
              authReducers.tappedSongResponse.type.toLowerCase() === 'minor'
                ? !props.isOptionMenu
                  ? images.optionMenu
                  : images.orangeClose
                : !props.isOptionMenu
                ? images.optionMenu
                : images.close
            }
          />
        </TouchableOpacity>
        <Spacer space={wp('1%')} />
        <TouchableOpacity onPress={props.onQuestionClicked}>
          <Image
            style={[globalStyles.img, {height: wp('9%'), width: wp('9%')}]}
            source={
              authReducers.tappedSongResponse.title !== undefined &&
              authReducers.tappedSongResponse.type.toLowerCase() === 'minor'
                ? props.isQuestion
                  ? images.question
                  : images.orangeClose
                : props.isQuestion
                ? images.question
                : images.close
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View
      style={[
        globalStyles.paddingTop,
        props.settings && globalStyles.paddingTop1,
        {
          width: DEVICE.DEVICE_WIDTH,
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.isExplore && {
          paddingLeft: !props.isNavDisable ? 0 : wp('8.8%'),
          alignItems: props.isNavDisable ? 'flex-start' : 'center',
        },
      ]}>
      {props.isExplore ? (
        <Text style={{...globalStyles.textHome, fontSize: wp('8%')}}>
          EXPLORE SONGS
        </Text>
      ) : (
        <Image
          style={[
            globalStyles.img,
            styles.logo,
            props.isLogoDisable && {tintColor: colors.TRANS},
            props.isExplore && {width: wp('57%')},
            props.isExplore && !props.isNavDisable && {tintColor: colors.TRANS},
          ]}
          source={
            props.titleImg
              ? props.titleImg
              : props.isExplore
              ? images.explore
              : images.pianoHack
          }
        />
      )}
      <View
        style={{
          position: 'absolute',
          left: props.isProfile ? wp('8.5') : wp('5.5%'),
          bottom: hp('0.2%'),
        }}>
        <TouchableOpacity onPress={props.onPress} disabled={props.isNavDisable}>
          <Image
            style={[
              globalStyles.img,
              {height: wp('8.5%'), width: wp('8.5%')},
              props.isNavDisable && {tintColor: colors.TRANS},
            ]}
            source={
              props.isMenu
                ? images.menu
                : props.isClose
                ? images.close
                : images.backRound
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: wp('10%'),
    width: wp('31%'),
    // backgroundColor: 'red'
  },
  majorView: {
    padding: DEVICE_OS === 'ios' ? hp('0.3%') : hp('0.5%'),
    paddingLeft: wp('2.5%'),
    paddingRight: wp('2.5%'),
    borderRadius: 5,
  },
});
