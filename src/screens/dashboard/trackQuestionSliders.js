//#region import
//#region RN
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  Animated,
  Keyboard,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {images} from '../../res/images';
import {Toolbar} from '../../components/Toolbar';
import TextInputCustom from '../../components/TextInputCustom';
import {colors} from '../../res/colors';
import {Spacer} from '../../res/spacer';
// import { UseKeyboard } from '../../components/UseKeyboard';
import {fonts} from '../../res/fonts';
import Util from '../../utils/utils';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as action from '../../redux/actions/authActions';
//#endregion
//#region third party libs
import {isIphoneX} from 'react-native-iphone-x-helper';
import AutoHeightImage from 'react-native-auto-height-image';
import {getData, removeData, saveData} from '../../utils/asyncStorageHelper';
import OnBackPressed from '../../components/OnBackPressed';
//#endregion
//#endregion

// const moveHomeAnimation = new Animated.ValueXY({ x: 0, y: 0 });
// const movePopularAnimation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 });
// const moveAddedAnimation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 });
export default trackQuestionSliders = Props => {
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  //#endregion redux
  //#region local state
  //#endregion local state

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        {/* {Props.index === 0 && <Image source={images.curvedArrow} style={[globalStyles.img, { height: wp(5), width: wp(5), position: 'absolute', top: isIphoneX() ? -wp(9) : -wp(7), left: wp(30) }]} />} */}
        {Props.index === 0 && (
          <Image
            source={images.curvedArrow}
            style={[
              globalStyles.img,
              {
                height: wp(5),
                width: wp(5),
                alignSelf: 'flex-start',
                left: wp(30),
                top: wp(2),
              },
            ]}
          />
        )}
        <Spacer space={wp(3)} />
        <Text
          style={[
            globalStyles.textHome,
            {fontSize: wp('5.5%'), color: colors.white2},
          ]}>
          {Props.index === 0
            ? 'Which notes should I play ?'
            : Props.index === 1
            ? 'How should I play ?'
            : 'Exceptions'}
        </Text>
        <Text
          style={[
            globalStyles.textHome,
            {color: colors.Dark_Gray, fontSize: wp('4.6%')},
          ]}>
          {Props.index === 0
            ? '2 OPTIONS'
            : Props.index === 1
            ? 'THE SIMPLE WAY'
            : ''}
        </Text>
        {/* <Text style={[globalStyles.textHome, { color: colors.Dark_Gray, fontSize: wp('4.8%'), marginTop: DEVICE_OS === 'ios' ? -hp('0.5%') : -hp('0.2%') }]}>{Props.index === 0 ? "2 OPTIONS" : Props.index === 1 ? "THE SIMPLE WAY" : ''}</Text> */}
        <Spacer
          space={Props.index === 1 ? wp(2.3) : Props.index === 2 ? wp(3) : 0}
        />
        {Props.index === 1 ? (
          <AutoHeightImage
            width={wp(57)}
            source={
              authReducers.tappedSongResponse.type.toLowerCase() === 'minor'
                ? images.howShouldPlayOrange
                : images.howShouldPlay
            }
          />
        ) : Props.index === 2 ? (
          <AutoHeightImage
            width={wp(80)}
            source={
              authReducers.tappedSongResponse.type.toLowerCase() === 'minor'
                ? images.exceptionsOrange
                : images.exceptions
            }
          />
        ) : (
          <View style={[styles.mainContainer, {justifyContent: 'center'}]}>
            {['Db', 'C'].map((data, index) => {
              return (
                <View style={styles.secondSlideSubContainer}>
                  {
                    index === 0 ? (
                      // <Image source={Props.item} style={[styles.btnImg, { height: hp('20%'), width: hp('25%') }, Props.index === 0 && { marginTop: wp(10) }]} />
                      <>
                        <Spacer space={wp(8)} />
                        <AutoHeightImage width={wp(58)} source={Props.item} />
                      </>
                    ) : (
                      //  index === 1 ?
                      <View
                        style={{
                          ...styles.secondSlideZeroIndex,
                          marginTop: wp(17),
                        }}>
                        {/* <Image source={images.originalTiles} style={[styles.btnImg, styles.originalTxt]} /> */}
                        <AutoHeightImage
                          width={wp(58)}
                          source={images.originalTiles}
                        />
                        <Spacer space={wp(2)} />
                        <AutoHeightImage
                          width={wp(59)}
                          source={
                            images[
                              `${authReducers.tappedSongResponse.original_key}_piano`
                            ]
                          }
                        />
                        {/* <Image source={images[`${authReducers.tappedSongResponse.original_key}_piano`]} style={[styles.btnImg, styles.originalPianoImg]} /> */}
                        <View style={styles.originalKeyContainer}>
                          <Text
                            style={[
                              globalStyles.textHome,
                              {fontSize: wp('4.5%')},
                            ]}>
                            {authReducers.tappedSongResponse.original_key}
                          </Text>
                        </View>
                      </View>
                    )
                    // : <View style={[styles.secondSlideZeroIndex, { justifyContent: 'center', alignItems: 'center' }]}>
                    //     <Text style={[globalStyles.textHome, { color: '#595959', fontSize: hp('1.7%'), fontFamily: fonts.FM }]}>Want more explanation ?</Text>
                    //     <Spacer space={hp('0.6%')} />
                    //     <TouchableOpacity>
                    //         <Image source={images.tilesBtn} style={[styles.btnImg, { height: hp('4%') }]} />
                    //     </TouchableOpacity>
                    // </View>
                  }

                  {/* {index === 0 ?
                                <View style={styles.secondSlideZeroIndex}>
                                    <AutoHeightImage width={wp(50)} source={images.originalTiles} />
                                    <Spacer space={wp(2)} />
                                    <AutoHeightImage width={wp(52)} source={images[`${authReducers.tappedSongResponse.original_key}_piano`]} />
                                    <View style={styles.originalKeyContainer}>
                                        <Text style={[globalStyles.textHome, { fontSize: hp('2.1%') }]}>{authReducers.tappedSongResponse.original_key}</Text>
                                    </View>
                                </View>
                                : index === 1 ?
                                    <Image source={Props.item} style={[styles.btnImg, { height: hp('20%'), width: hp('25%') }]} /> :
                                    <View style={[styles.secondSlideZeroIndex, { justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text style={[globalStyles.textHome, { color: '#595959', fontSize: hp('1.7%'), fontFamily: fonts.FM }]}>Want more explanation ?</Text>
                                        <Spacer space={hp('0.6%')} />
                                        <TouchableOpacity>
                                            <Image source={images.tilesBtn} style={[styles.btnImg, { height: hp('4%') }]} />
                                        </TouchableOpacity>
                                    </View>} */}
                </View>
              );
            })}
          </View>
        )}
        {/* {Props.index === 0 ?
                <View style={styles.mainContainer}>
                    <Image source={Props.item} style={styles.sliderImages} />
                    <View style={styles.btnContainer}>
                        {[images.playBtn, images.creamBase4Btn].map((data, index) => {
                            return (
                                <View style={[{ flex: index === 0 ? 1 : 0.67 }, index === 1 && { bottom: hp('0.2%') }]}>
                                    <TouchableOpacity style={{ width: index === 0 ? hp('21%') : hp('17%') }}>
                                        <Image source={data} style={[styles.btnImg, index === 1 && { width: hp('17%'), height: wp('10%') }]} />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </View> :
                Props.index === 1 ?
                    <View style={[styles.mainContainer, { justifyContent: 'center' }]}>
                        <View style={styles.secondSlideContainer}>
                            {['Db', 'C', 'btn'].map((data, index) => {
                                return (
                                    <View style={styles.secondSlideSubContainer}>
                                        {index === 0 ?
                                            <View style={styles.secondSlideZeroIndex}>
                                                <Image source={images.originalTiles} style={[styles.btnImg, styles.originalTxt]} />
                                                <Image source={images[`${authReducers.tappedSongResponse.original_key}_piano`]} style={[styles.btnImg, styles.originalPianoImg]} />
                                                <View style={styles.originalKeyContainer}>
                                                    <Text style={[globalStyles.textHome, { fontSize: hp('2.1%') }]}>{authReducers.tappedSongResponse.original_key}</Text>
                                                </View>
                                            </View>
                                            : index === 1 ?
                                                <Image source={Props.item} style={[styles.btnImg, { height: hp('20%'), width: hp('25%') }]} /> :
                                                <View style={[styles.secondSlideZeroIndex, { justifyContent: 'center', alignItems: 'center' }]}>
                                                    <Text style={[globalStyles.textHome, { color: '#595959', fontSize: hp('1.7%'), fontFamily: fonts.FM }]}>Want more explanation ?</Text>
                                                    <Spacer space={hp('0.6%')} />
                                                    <TouchableOpacity>
                                                        <Image source={images.tilesBtn} style={[styles.btnImg, { height: hp('4%') }]} />
                                                    </TouchableOpacity>
                                                </View>}
                                    </View>
                                );
                            })}
                        </View>
                    </View> :
                    <View style={[styles.mainContainer, { justifyContent: 'center' }]}>
                        <Image source={Props.item} style={[styles.sliderImages, { height: hp('65%'), width: wp('85%') }]} />
                    </View>} */}
      </View>
      <Spacer space={wp(8)} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    // height: hp(70),
    width: DEVICE.DEVICE_WIDTH,
    // justifyContent: 'center'
    // backgroundColor: 'red'
  },
  sliderImages: {
    width: wp('75%'),
    height: hp('55%'),
    resizeMode: 'contain',
    alignSelf: 'center',
    // backgroundColor: 'blue'
  },
  btnContainer: {
    position: 'absolute',
    bottom: wp('7%'),
    width: wp('75%'),
    flexDirection: 'row',
  },
  btnImg: {
    width: wp('21%'),
    height: wp('5%'),
    resizeMode: 'contain',
    // backgroundColor: 'red'
  },
  secondSlideContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('90%'),
    marginBottom: hp('5%'),
    backgroundColor: 'red',
  },
  secondSlideSubContainer: {
    alignItems: 'center',
    flex: 1,
    // backgroundColor: 'red'
  },
  secondSlideZeroIndex: {
    // height: hp('20%'),
    // width: wp('30%')
    alignItems: 'center',
  },
  originalTxt: {
    height: hp('20%'),
    width: wp('50%'),
    marginTop: hp('2%'),
    backgroundColor: 'red',
  },
  originalPianoImg: {
    height: hp('6.7%'),
    width: wp('30%'),
    marginTop: hp('1.7%'),
  },
  originalKeyContainer: {
    backgroundColor: colors.Dark_Gray,
    padding: DEVICE_OS === 'ios' ? wp('0.3%') : wp('0.5%'),
    paddingLeft: wp('1%'),
    paddingRight: wp('1%'),
    position: 'absolute',
    borderRadius: 4,
    // right: hp('6.5%'),
    left: wp('39%'),
    // right: wp(8),
    top: -wp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
