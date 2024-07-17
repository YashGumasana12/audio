//#region import
//#region RN
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  Keyboard,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import {
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native-gesture-handler';
//#endregion
//#region third party libs
import KeepAwake from 'react-native-keep-awake';
import ImageSlider from 'react-native-image-slider';
import {BlurView, VibrancyView} from '@react-native-community/blur';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as action from '../../redux/actions/authActions';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {images} from '../../res/images';
import {Toolbar} from '../../components/Toolbar';
import {colors} from '../../res/colors';
import {Spacer} from '../../res/spacer';
import {fonts} from '../../res/fonts';
import Util from '../../utils/utils';
import OnBackPressed from '../../components/OnBackPressed';
import TrackQuestionSliders from './trackQuestionSliders';
import TextInputCustom from '../../components/TextInputCustom';
import {AppModal} from '../../components/AppModal';
import {UseKeyboard} from '../../components/UseKeyboard';
//#endregion
//#endregion
var touchX;
// const moveToolbarAnimation = new Animated.ValueXY({ x: 0, y: -wp('40%') });
const moveToolbarAnimation = new Animated.Value(-wp('40%'));
const moveStructureAnimation = new Animated.Value(DEVICE.DEVICE_HEIGHT);
const moveTrackViewAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
const moveOptionsAnimation = new Animated.Value(-DEVICE.DEVICE_HEIGHT);
export default track = Props => {
  const props = Props.props;
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  //#endregion redux
  //#region local state
  const [keyboardHeight] = UseKeyboard();
  const [isChords, setIsChords] = useState(false);
  const [isBackClick, setIsBackClick] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);
  const [isOptionMenu, setIsOptionMenu] = useState(false);
  const [playlistInput, setPlaylistInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [itemTappedIndex, setItemTappedIndex] = useState('');
  const [isAddPlaylistLoading, setIsAddPlaylistLoadingg] = useState(false);
  const [isBlurView, setIsBlurView] = useState(false);
  const [isLongPressOptions, setIsLongPressOptions] = useState({
    visibility: false,
    selectedItem: '',
  });
  const [isPlaylistAdding, setIsPlaylistAdding] = useState(false);
  //#endregion local state
  //#region ref
  const scrollViewRef = useRef();
  const refPlaylistTitle = useRef(null);
  //#endregion ref

  useEffect(() => {
    //#region Orientation
    // Orientation.lockToLandscapeRight();
    // return () => {
    //     // Orientation.lockToPortrait();
    // }
    //#endregion
    if (Props.isTrackVisible) {
      KeepAwake.activate();
      Util.slideAnimation(moveTrackViewAnimation, 0, 'track');
      Util.slideAnimation(moveStructureAnimation, wp('0%'), 'y', 'toolBar');
      Util.slideAnimation(moveToolbarAnimation, 0, 'y', 'toolBar', () => {
        setTimeout(() => {
          setIsBackClick(false);
        }, 200);
      });
    }
  }, [Props.isTrackVisible]);
  useEffect(() => {
    setIsChords(authReducers.trackOptionsMenu[2].isOn);
  }, [authReducers]);

  const onOptionMenuClicked = (data, index) => {
    Util.onHapticFeedback();
    switch (index) {
      case 0:
        dispatch(action.onSaveTrackToFav(authReducers));
        break;
      case 1:
        // !authReducers.tappedSongResponse.in_playlist_status &&
        setIsBlurView(!isBlurView);
        break;
      case 3:
        dispatch(action.onTabMistake(authReducers));
        break;
      default:
        break;
    }
  };

  const onAddPlaylist = () => {
    if (playlistInput !== '') {
      setIsAddPlaylistLoadingg(true);
      dispatch(
        action.onCreateNewPlaylist(
          authReducers.userDetails,
          playlistInput,
          () => {
            setPlaylistInput('');
            setIsAddPlaylistLoadingg(false);
            setIsPlaylistAdding(!isPlaylistAdding);
          },
        ),
      );
    } else setIsPlaylistAdding(!isPlaylistAdding);
  };

  const result = array =>
    array.every(element => {
      if (element === array[0]) {
        return true;
      }
    });

  return (
    <View
      style={globalStyles.flex}
      onTouchStart={e => (touchX = e.nativeEvent.pageX)}
      onTouchEnd={e => {
        if (touchX <= 20) {
          if (touchX - e.nativeEvent.pageY < -20) {
            if (!isBlurView && !isQuestion && !isOptionMenu && !isBackClick) {
              Util.slideAnimation(
                moveStructureAnimation,
                DEVICE.DEVICE_HEIGHT,
                'y',
                'toolBar',
              );
              Util.slideAnimation(
                moveToolbarAnimation,
                -wp('40%'),
                'y',
                'toolBar',
              );
              Util.slideAnimation(
                moveTrackViewAnimation,
                DEVICE.DEVICE_WIDTH,
                'x',
                'toolBar',
              );
              setTimeout(() => {
                Props.onBackPressed();
                setIsBackClick(!isBackClick);
              }, 200);
              setTimeout(() => {
                scrollViewRef.current.scrollTo({animated: true}, 0);
              }, 1000);
            }
          }
        }
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          if (DEVICE_OS === 'ios' && isOptionMenu) {
            setIsOptionMenu(!isOptionMenu);
            Util.slideAnimation(
              moveOptionsAnimation,
              isOptionMenu ? -DEVICE.DEVICE_HEIGHT : 0,
              'y',
              isOptionMenu && 'hideOption',
            );
          }
        }}>
        {/* {Props.isTrackVisible && <StatusBar hidden />} */}
        {Props.isTrackVisible && (
          <OnBackPressed
            onBackPressed={() => {
              if (isBlurView) {
                setIsOptionMenu(!isOptionMenu);
                Util.slideAnimation(
                  moveOptionsAnimation,
                  isOptionMenu ? -DEVICE.DEVICE_HEIGHT : 0,
                  'y',
                  isOptionMenu && 'hideOption',
                );
                setIsBlurView(false);
                setIsPlaylistAdding(false);
              } else if (isQuestion) {
                setIsQuestion(!isQuestion);
              } else if (isOptionMenu) {
                setIsOptionMenu(!isOptionMenu);
                Util.slideAnimation(
                  moveOptionsAnimation,
                  isOptionMenu ? -DEVICE.DEVICE_HEIGHT : 0,
                  'y',
                  isOptionMenu && 'hideOption',
                );
              } else if (!isBackClick) {
                Util.slideAnimation(
                  moveStructureAnimation,
                  DEVICE.DEVICE_HEIGHT,
                  'y',
                  'toolBar',
                );
                Util.slideAnimation(
                  moveToolbarAnimation,
                  -wp('40%'),
                  'y',
                  'toolBar',
                );
                Util.slideAnimation(
                  moveTrackViewAnimation,
                  DEVICE.DEVICE_WIDTH,
                  'x',
                  'toolBar',
                );
                setTimeout(() => {
                  Props.onBackPressed();
                  setIsBackClick(!isBackClick);
                }, 200);
                setTimeout(() => {
                  scrollViewRef.current.scrollTo({animated: true}, 0);
                }, 1000);
              }
            }}
          />
        )}
        {/* <View style={{ transform: [{ rotate: '90deg' }], height: DEVICE.DEVICE_WIDTH, width: DEVICE.DEVICE_WIDTH }}> */}
        <View
          style={{
            height: DEVICE.DEVICE_HEIGHT,
            width: DEVICE.DEVICE_WIDTH,
            zIndex: 250,
          }}>
          {/* <Animated.View style={[moveToolbarAnimation.getLayout(), { zIndex: 250 }]}> */}
          <Animated.View
            style={{
              transform: [{translateY: moveToolbarAnimation}],
              zIndex: 250,
            }}>
            <Toolbar
              isLandscape={true}
              onPress={() => {
                if (isBlurView) {
                  setIsBlurView(false);
                  setIsPlaylistAdding(false);
                } else if (isOptionMenu) {
                  setIsOptionMenu(!isOptionMenu);
                  Util.slideAnimation(
                    moveOptionsAnimation,
                    isOptionMenu ? -DEVICE.DEVICE_HEIGHT : 0,
                    'y',
                    isOptionMenu && 'hideOption',
                  );
                } else if (!isBackClick) {
                  Util.slideAnimation(
                    moveStructureAnimation,
                    DEVICE.DEVICE_WIDTH,
                    'y',
                    'toolBar',
                  );
                  Util.slideAnimation(
                    moveToolbarAnimation,
                    -wp('40%'),
                    'y',
                    'toolBar',
                  );
                  Util.slideAnimation(
                    moveTrackViewAnimation,
                    DEVICE.DEVICE_WIDTH,
                    'x',
                    'toolBar',
                  );
                  setTimeout(() => {
                    Props.onBackPressed();
                    setIsBackClick(!isBackClick);
                  }, 200);
                  setTimeout(() => {
                    scrollViewRef.current.scrollTo({animated: true}, 0);
                  }, 1000);
                }
              }}
              onSaveClicked={() =>
                dispatch(action.onSaveTrackToFav(authReducers))
              }
              // onChordsClicked={() => {
              //     setIsChords(!isChords);
              //     Util.onHapticFeedback();
              //     dispatch(action.onChordsStatus(authReducers, !isChords));
              // }}
              isOptionMenu={isOptionMenu}
              onQuestionClicked={() => {
                if (isOptionMenu) {
                  setIsOptionMenu(!isOptionMenu);
                  Util.slideAnimation(
                    moveOptionsAnimation,
                    isOptionMenu ? -DEVICE.DEVICE_HEIGHT : 0,
                    'y',
                    isOptionMenu && 'hideOption',
                  );
                  setTimeout(() => {
                    setIsQuestion(!isQuestion);
                  }, 200);
                } else {
                  setIsQuestion(!isQuestion);
                }
              }}
              isQuestion={!isQuestion}
              onOptionMenuClicked={() => {
                Util.onHapticFeedback();
                setIsOptionMenu(!isOptionMenu);
                Util.slideAnimation(
                  moveOptionsAnimation,
                  isOptionMenu ? -DEVICE.DEVICE_HEIGHT : 0,
                  'y',
                  isOptionMenu && 'hideOption',
                );
              }}
            />
          </Animated.View>

          {/* <Animated.View style={[moveTrackViewAnimation.getLayout(), { height: DEVICE.DEVICE_HEIGHT }]}> */}
          <Animated.View
            style={{
              transform: [{translateX: moveTrackViewAnimation}],
              height: DEVICE.DEVICE_HEIGHT,
            }}>
            <View style={{height: DEVICE.DEVICE_HEIGHT}}>
              {!isQuestion ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{width: DEVICE.DEVICE_WIDTH, zIndex: 50}}
                  ref={scrollViewRef}>
                  <View style={styles.mainTrackContainer}>
                    <Spacer space={wp('2%')} />
                    {authReducers.tappedSongResponse !== '' &&
                      authReducers.tappedSongResponse.section !== null &&
                      authReducers.tappedSongResponse.section !== [] &&
                      authReducers.tappedSongResponse.section !== undefined &&
                      authReducers.tappedSongResponse.section.map(
                        (item, mainIndex) => {
                          let spaceIndex = [];
                          item.first_line.forEach((data, index) => {
                            //#region space margin for second line
                            if (index !== 0 && data !== 'N!A') {
                              spaceIndex.push(index * 4);
                            }
                            //#endregion
                          });
                          let isMinusTxt = false;
                          item.second_line.forEach((data, index) => {
                            //#region space margin for second line
                            if (
                              data < 0 ||
                              data.includes('-') ||
                              data.includes('+')
                            ) {
                              isMinusTxt = true;
                            }
                            //#endregion
                          });
                          return (
                            <>
                              {/* {mainIndex !== 0 && !result(item.first_line) && <Spacer space={wp("1.5%")  } />} */}
                              <View
                                style={{width: wp('90%'), alignSelf: 'center'}}>
                                {item.section.length !== 0 && (
                                  <Text
                                    style={{
                                      ...globalStyles.textHome,
                                      color: colors.grayBold,
                                      fontSize: wp(5),
                                    }}>
                                    {item.section[0].charAt(0).toUpperCase()}
                                    <Text style={{color: colors.grayBold}}>
                                      {item.section[0].substring(1)}
                                    </Text>
                                  </Text>
                                )}
                                {/* <Spacer space={isMinusTxt ? (DEVICE_OS === 'ios' ? wp("1%") : wp("1.3%")) : DEVICE_OS === 'ios' ? -wp("0.1%") : wp("0.1%")} /> */}
                                {!result(item.first_line) && (
                                  <Spacer
                                    space={
                                      DEVICE_OS === 'ios'
                                        ? item.section.length === 0
                                          ? -wp('0.1%')
                                          : wp(0.5)
                                        : wp('0.1%')
                                    }
                                  />
                                )}
                                {/* <View style={styles.secondLineContainer}>
                                                            {item.second_line.map((data, index) => {
                                                                return (      
                                                                    <>
                                                                        {spaceIndex.includes(index) && <Spacer row={wp("0.55%")} />}
                                                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                                                            <View style={{ flexDirection: 'row' }}>
                                                                                {[...data].map((numbers, index) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Text style={[globalStyles.textHome, styles.numbersTxt, { fontSize: wp('3.8%') }, data === 'N!A' && { color: colors.TRANS, fontSize: 0 }, index !== 0 && (numbers.includes('.') || [...data][index - 1].includes('.')) && { fontSize: wp('2%'), alignSelf: 'flex-end', marginBottom: wp('0.3%'), marginLeft: numbers.includes('.') ? - wp('0.5%') : 0 }]} numberOfLines={1}>{(data < 0) ? data * -1 : (numbers.includes('-') || numbers.includes('+')) ? numbers.replace(/[-+]/g, '') : (data === 'N!A' ? '' : numbers)}</Text>
                                                                                            {(data < 0 || numbers.includes('-') || numbers.includes('+')) && <Text style={[globalStyles.textHome, styles.numbersTxt, styles.minusTxt, data !== 'N!A' && data.includes('.') && { left: wp('0.6%') }, data === 'N!A' && { color: colors.TRANS }]} numberOfLines={1}>{numbers.includes('-') ? '-' : '+'}</Text>}
                                                                                        </>
                                                                                    );
                                                                                })}
                                                                            </View>
                                                                            {/* // return (
                                                            //     <>
                                                            //         {spaceIndex.includes(index) && <Spacer row={wp("0.55%")} />}
                                                            //         <View style={[{ flex: 1, alignItems: 'center', zIndex: 10 }, data === 'N!A' && { zIndex: -10, backgroundColor: 'red' }]}>
                                                            //             <Text style={[globalStyles.textHome, styles.numbersTxt, { fontSize: wp('4%') }, data === 'N!A' && { color: colors.TRANS, fontSize: 0 }]} numberOfLines={1}>{(data < 0) ? data * -1 : (data.includes('-') || data.includes('+')) ? data.replace(/[-+]/g, '') : (data === 'N!A' ? '' : data)}</Text>
                                                            //             {(data < 0 || data.includes('-') || data.includes('+')) && <Text style={[globalStyles.textHome, styles.numbersTxt, styles.minusTxt, data === 'N!A' && { color: colors.TRANS }]} numberOfLines={1}>{data.includes('-') ? '-' : '+'}</Text>}
                                                            //         </View>
                                                            //     </>
                                                            // ); */}
                                {/* </View>
                                                                    </>
                                                                )
                                                            })} */}
                                {/* </View> */}
                                <Spacer space={wp('0.5%')} />
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  {item.repetition !== '' && (
                                    // <View style={{ ...styles.repetitionContainer, paddingLeft: 0, paddingRight: 0 }}>
                                    //     {/* <Text style={[globalStyles.textHome, { color: colors.black, fontSize: wp('4%') }]}>{item.repetition}</Text> */}
                                    //     <Text style={[globalStyles.textHome, { color: colors.TRANS, fontSize: wp('4%') }]}>1</Text>
                                    // </View>
                                    <Image
                                      source={images.xRect}
                                      style={{
                                        ...globalStyles.img,
                                        position: 'absolute',
                                        right: -wp('4%'),
                                        width: wp(4),
                                        height: wp(7),
                                      }}
                                    />
                                  )}
                                  {item.first_line.map((data, index) => {
                                    //#region Data seperation logic for display chords
                                    let arrayChords = [];
                                    let string = '';
                                    [...data].forEach((element, i) => {
                                      if (
                                        element.includes('/') ||
                                        element.includes('-')
                                      ) {
                                        arrayChords.push(string);
                                        arrayChords.push(element);
                                        string = '';
                                      } else {
                                        string = string + element;
                                      }
                                    });
                                    arrayChords.push(string);
                                    //#endregion
                                    return (
                                      <>
                                        {index !== 0 &&
                                          data !== 'N!A' &&
                                          data !== 'isFirstNumber' && (
                                            <Spacer row={wp('0.55%')} />
                                          )}
                                        {/* <View style={(data !== 'N!A' || index === 0) && { flex: 1 }, (index === item.first_line.length - 1 || (data === 'N!A' && item.first_line[index + 1] !== 'N!A') || (data !== 'N!A' && item.first_line[index + 1] !== 'N!A')) && { flex: 1 }}> */}
                                        <View
                                          style={{
                                            flex: 1,
                                            margin:
                                              DEVICE_OS === 'ios'
                                                ? -wp('0.08%')
                                                : -wp('0.06%'),
                                            zIndex: data !== 'N!A' ? 1 : 0,
                                          }}>
                                          {/* {data.toLowerCase() !== 'x' && <Image style={[globalStyles.img, styles.imgLine, !(index === 0 || index === 4 || index === 8 || index === 12) && { tintColor: colors.grayDark }]} source={images.whiteLine} />} */}
                                          {
                                            !item.isFirstLineDisabled &&
                                            data !== 'isFirstNumber' ? (
                                              <>
                                                {data.toLowerCase() !== 'x' && (
                                                  <Image
                                                    style={[
                                                      globalStyles.img,
                                                      styles.imgLine,
                                                      !(
                                                        index === 0 ||
                                                        index === 4 ||
                                                        index === 8 ||
                                                        index === 12
                                                      ) && {
                                                        tintColor:
                                                          colors.grayDark,
                                                      },
                                                      item.isFirstLineDisabled &&
                                                        data ===
                                                          'isFirstNumber' && {
                                                          tintColor:
                                                            colors.TRANS,
                                                        },
                                                    ]}
                                                    source={images.whiteLine}
                                                  />
                                                )}
                                                <View
                                                  style={[
                                                    {
                                                      backgroundColor:
                                                        item.tempSameArray.includes(
                                                          index,
                                                        )
                                                          ? colors.Dark_Gray
                                                          : authReducers.tappedSongResponse.type.toLowerCase() ===
                                                            'minor'
                                                          ? colors.orange
                                                          : data.toLowerCase() ===
                                                            'x'
                                                          ? colors.TRANS
                                                          : colors.creamBase3,
                                                      padding: hp('0.5%'),
                                                      paddingTop:
                                                        DEVICE_OS === 'ios'
                                                          ? hp('0.2%')
                                                          : hp('0.55%'),
                                                      paddingBottom:
                                                        DEVICE_OS === 'ios'
                                                          ? hp('0.2%')
                                                          : hp('0.35%'),
                                                      paddingRight: 0,
                                                    },
                                                    (data !== 'N!A' ||
                                                      index === 0) && {
                                                      borderTopLeftRadius: 5,
                                                      borderBottomLeftRadius: 5,
                                                    },
                                                    index !== 0 &&
                                                      item.first_line[
                                                        index - 1
                                                      ].toLowerCase() ===
                                                        'x' && {
                                                        borderTopLeftRadius: 5,
                                                        borderBottomLeftRadius: 5,
                                                      },
                                                    (index ===
                                                      item.first_line.length -
                                                        1 ||
                                                      (data === 'N!A' &&
                                                        item.first_line[
                                                          index + 1
                                                        ] !== 'N!A') ||
                                                      (data !== 'N!A' &&
                                                        item.first_line[
                                                          index + 1
                                                        ] !== 'N!A')) && {
                                                      borderTopRightRadius: 5,
                                                      borderBottomRightRadius: 5,
                                                    },
                                                  ]}>
                                                  <View
                                                    style={{
                                                      flexDirection: 'row',
                                                    }}>
                                                    {arrayChords.map(
                                                      (text, index) => {
                                                        //#region first line render text logic
                                                        try {
                                                          return index !== 0 &&
                                                            arrayChords[
                                                              index - 1
                                                            ].includes('-') ? (
                                                            <Text
                                                              style={[
                                                                globalStyles.textHome,
                                                                styles.numbersTxt,
                                                                {
                                                                  color:
                                                                    authReducers.tappedSongResponse.type.toLowerCase() ===
                                                                    'minor'
                                                                      ? '#7A3500'
                                                                      : colors.creamBase4,
                                                                },
                                                                !isChords && {
                                                                  fontSize: 0,
                                                                },
                                                              ]}
                                                              numberOfLines={1}>
                                                              {!isChords
                                                                ? ''
                                                                : text}
                                                            </Text>
                                                          ) : arrayChords[
                                                              index + 1
                                                            ].includes('/') ? (
                                                            <Text
                                                              style={[
                                                                globalStyles.textHome,
                                                                styles.numbersTxt,
                                                                {
                                                                  color:
                                                                    authReducers.tappedSongResponse.type.toLowerCase() ===
                                                                    'minor'
                                                                      ? '#7A3500'
                                                                      : colors.creamBase4,
                                                                },
                                                                !isChords && {
                                                                  fontSize: 0,
                                                                },
                                                              ]}
                                                              numberOfLines={1}>
                                                              {!isChords
                                                                ? ''
                                                                : text}
                                                            </Text>
                                                          ) : (arrayChords[
                                                              index - 1
                                                            ].includes('/') ||
                                                              arrayChords[
                                                                index - 1
                                                              ].includes(
                                                                '-',
                                                              )) &&
                                                            (arrayChords[
                                                              index + 1
                                                            ].includes('-') ||
                                                              arrayChords[
                                                                index + 1
                                                              ].includes(
                                                                '/',
                                                              )) ? (
                                                            <Text
                                                              style={[
                                                                globalStyles.textHome,
                                                                styles.numbersTxt,
                                                              ]}
                                                              numberOfLines={1}>
                                                              {text}
                                                            </Text>
                                                          ) : (
                                                            <Text
                                                              style={[
                                                                globalStyles.textHome,
                                                                styles.numbersTxt,
                                                                (text.includes(
                                                                  '!',
                                                                ) ||
                                                                  text.includes(
                                                                    '-',
                                                                  ) ||
                                                                  text.includes(
                                                                    '/',
                                                                  )) && {
                                                                  fontSize: 0,
                                                                },
                                                              ]}
                                                              numberOfLines={1}>
                                                              {text.includes(
                                                                '!',
                                                              ) ||
                                                              text.includes(
                                                                '-',
                                                              ) ||
                                                              text.includes('/')
                                                                ? ''
                                                                : text}
                                                            </Text>
                                                          );
                                                        } catch (error) {
                                                          if (
                                                            data.includes(
                                                              '-',
                                                            ) ||
                                                            data.includes('/')
                                                          ) {
                                                            return (
                                                              // <View style={{ flexDirection: 'row', }}>
                                                              [...text].map(
                                                                (
                                                                  numbers,
                                                                  index,
                                                                ) => {
                                                                  return (
                                                                    <Text
                                                                      style={[
                                                                        globalStyles.textHome,
                                                                        styles.numbersTxt,
                                                                        item.isFirstLineDisabled && {
                                                                          color:
                                                                            colors.TRANS,
                                                                        },
                                                                        (data ===
                                                                          'N!A' ||
                                                                          data.toLowerCase() ===
                                                                            'x' ||
                                                                          text.includes(
                                                                            'same',
                                                                          ) ||
                                                                          text ===
                                                                            'isFirstNumber') && {
                                                                          color:
                                                                            colors.TRANS,
                                                                        },
                                                                      ]}
                                                                      numberOfLines={
                                                                        1
                                                                      }>
                                                                      {numbers}
                                                                    </Text>
                                                                  );
                                                                },
                                                              )
                                                              // </View>
                                                            );
                                                          } else {
                                                            return (
                                                              <View
                                                                style={{
                                                                  flexDirection:
                                                                    'row',
                                                                }}>
                                                                {[...text].map(
                                                                  (
                                                                    numbers,
                                                                    index,
                                                                  ) => {
                                                                    return (
                                                                      <>
                                                                        {/* <Text style={[globalStyles.textHome, styles.numbersTxt, item.isFirstLineDisabled && { color: colors.TRANS },]} numberOfLines={1}>{numbers}</Text> */}
                                                                        <Text
                                                                          style={[
                                                                            globalStyles.textHome,
                                                                            styles.numbersTxt,
                                                                            item.isFirstLineDisabled && {
                                                                              color:
                                                                                colors.TRANS,
                                                                            },
                                                                            (data ===
                                                                              'N!A' ||
                                                                              data.toLowerCase() ===
                                                                                'x' ||
                                                                              text.includes(
                                                                                'same',
                                                                              ) ||
                                                                              text ===
                                                                                'isFirstNumber') && {
                                                                              color:
                                                                                colors.TRANS,
                                                                            },
                                                                          ]}
                                                                          numberOfLines={
                                                                            1
                                                                          }>
                                                                          {
                                                                            numbers
                                                                          }
                                                                        </Text>
                                                                        {/* {text.includes('same') &&
                                                                                                                        <Text style={[globalStyles.textHome, { position: 'absolute', color: colors.grayDark4, alignSelf: 'center' }]} numberOfLines={1}>{text.toUpperCase()}
                                                                                                                            <Text style={{ color: colors.white }}>{item.same_as.charAt(0).toUpperCase()}</Text>
                                                                                                                            {item.same_as.substring(1).toUpperCase()}
                                                                                                                        </Text>} */}
                                                                      </>
                                                                    );
                                                                  },
                                                                )}
                                                                {text.includes(
                                                                  'same',
                                                                ) && (
                                                                  <Text
                                                                    style={[
                                                                      globalStyles.textHome,
                                                                      {
                                                                        position:
                                                                          'absolute',
                                                                        color:
                                                                          colors.grayDark4,
                                                                        alignSelf:
                                                                          'center',
                                                                        fontSize:
                                                                          wp(
                                                                            '5%',
                                                                          ),
                                                                      },
                                                                    ]}
                                                                    numberOfLines={
                                                                      1
                                                                    }>
                                                                    {text
                                                                      .charAt(0)
                                                                      .toUpperCase() +
                                                                      text.substring(
                                                                        1,
                                                                      )}
                                                                    <Text
                                                                      style={{
                                                                        color:
                                                                          colors.white,
                                                                      }}>
                                                                      {item.same_as
                                                                        .charAt(
                                                                          0,
                                                                        )
                                                                        .toUpperCase() +
                                                                        item.same_as.substring(
                                                                          1,
                                                                        )}
                                                                    </Text>
                                                                  </Text>
                                                                )}
                                                              </View>
                                                            );
                                                          }
                                                        }
                                                        //#endregion
                                                      },
                                                    )}
                                                  </View>
                                                </View>
                                              </>
                                            ) : (
                                              <></>
                                            )
                                            // <View style={{ backgroundColor: colors.creamBase1 }}>
                                            //     <Text style={[globalStyles.textHome, styles.numbersTxt, (data === 'N!A' || data === 'isFirstNumber') && { color: colors.TRANS }]} numberOfLines={1}>{data}</Text>
                                            // </View>
                                          }
                                        </View>
                                      </>
                                    );
                                  })}
                                </View>
                                {/* //#region section seprator text, if it's available */}
                                {(item.section.length === 2 ||
                                  item.section.length === 3) && (
                                  <>
                                    <Spacer space={wp('3%')} />
                                    <View
                                      style={{
                                        alignItems: 'baseline',
                                        marginBottom: -hp('1%'),
                                      }}>
                                      <View
                                        style={[
                                          styles.sectionSeprateView,
                                          {
                                            backgroundColor: colors.Dark_Gray,
                                            padding: 0,
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                          },
                                        ]}>
                                        <View
                                          style={[
                                            styles.sectionSeprateView,
                                            authReducers.tappedSongResponse.type.toLowerCase() ===
                                              'minor' && {
                                              backgroundColor: colors.orange,
                                            },
                                          ]}>
                                          {[...item.section[1]].map(
                                            (text, index) => {
                                              return (
                                                <Text
                                                  style={[
                                                    globalStyles.textHome,
                                                    styles.numbersTxt,
                                                    text.includes('+') && {
                                                      fontFamily: fonts.SB,
                                                    },
                                                  ]}
                                                  numberOfLines={1}>
                                                  {text.toUpperCase()}
                                                </Text>
                                              );
                                            },
                                          )}
                                        </View>
                                        {item.section.length === 3 && (
                                          <Text
                                            style={[
                                              globalStyles.textHome,
                                              styles.numbersTxt,
                                              {
                                                paddingLeft: hp('0.5%'),
                                                paddingRight: hp('0.5%'),
                                                paddingTop:
                                                  DEVICE_OS === 'ios'
                                                    ? hp('0.15%')
                                                    : hp('0.5%'),
                                                paddingBottom:
                                                  DEVICE_OS === 'ios'
                                                    ? hp('0.15%')
                                                    : hp('0.3%'),
                                              },
                                            ]}
                                            numberOfLines={1}>
                                            {item.section[2].toUpperCase()}
                                          </Text>
                                        )}
                                      </View>
                                    </View>
                                  </>
                                )}
                                {/* //#endregion  section seprator text, if it's available */}
                              </View>

                              {!result(item.first_line) && (
                                <Spacer space={wp(2)} />
                              )}
                            </>
                          );
                        },
                      )}
                    <Spacer space={wp(30)} />
                  </View>
                </ScrollView>
              ) : (
                <View
                  style={{
                    width: DEVICE.DEVICE_WIDTH,
                    height: DEVICE.DEVICE_HEIGHT / 1.2,
                  }}>
                  {/* <View style={{ width: DEVICE.DEVICE_HEIGHT, height: wp('50%'), backgroundColor: 'green' }}> */}
                  <ImageSlider
                    // autoPlayWithInterval={3000}
                    // isLandscape={true}
                    indicatorStyle={{marginBottom: wp(15)}}
                    style={{backgroundColor: colors.TRANS}}
                    images={
                      authReducers.tappedSongResponse.type.toLowerCase() ===
                      'minor'
                        ? [images.qoSlide2, images.qoSlide1, images.qoSlide3]
                        : [images.qgSlide2, images.qgSlide1, images.qgSlide3]
                    }
                    customSlide={({index, item, style, width}) => (
                      <View key={index} style={[style, styles.sliderContainer]}>
                        <TrackQuestionSliders
                          index={index}
                          item={item}
                          props={props}
                        />
                      </View>
                    )}
                  />
                  {/* </View> */}
                </View>
              )}

              {authReducers.tappedSongResponse !== '' && (
                // <Animated.View style={[styles.optionMenuMainContainer, moveOptionsAnimation.getLayout()]}>
                <Animated.View
                  style={[
                    styles.optionMenuMainContainer,
                    {transform: [{translateY: moveOptionsAnimation}]},
                  ]}>
                  <View style={styles.optionMenuSubContainer}>
                    {authReducers.trackOptionsMenu.map((data, index) => {
                      return (
                        <>
                          <TouchableOpacity
                            disabled={
                              index === 2 ||
                              (index === 3 &&
                                authReducers.tappedSongResponse
                                  .mistake_track_status === 1)
                              // || (index === 1 && authReducers.tappedSongResponse.in_playlist_status === 1)
                            }
                            style={[
                              styles.optionMenuItemContainer,
                              {
                                borderBottomWidth:
                                  index ===
                                  authReducers.trackOptionsMenu.length - 1
                                    ? 0
                                    : 2,
                                paddingTop: index === 0 ? hp('1%') : hp('1.5%'),
                              },
                            ]}
                            onPress={() => onOptionMenuClicked(data, index)}>
                            {index !== 2 && (
                              <>
                                <Image
                                  style={[
                                    globalStyles.img,
                                    {height: hp('2%'), width: hp('2%')},
                                    index !==
                                      authReducers.trackOptionsMenu.length -
                                        1 && {tintColor: data.tintColor},
                                  ]}
                                  source={data.icon}
                                />
                                <Spacer row={wp('1.5%')} />
                              </>
                            )}
                            <Text
                              style={[
                                globalStyles.textHome,
                                {fontFamily: fonts.FM, fontSize: hp('2%')},
                              ]}>
                              {data.title}
                            </Text>
                            {index === 2 && (
                              <>
                                <Spacer row={wp('2%')} />
                                <Switch
                                  trackColor={{
                                    false: '#666666',
                                    true:
                                      authReducers.tappedSongResponse.type.toLowerCase() ===
                                      'minor'
                                        ? colors.orange
                                        : colors.creamBase3,
                                  }}
                                  thumbColor={colors.white}
                                  ios_backgroundColor="#666666"
                                  onValueChange={() =>
                                    dispatch(
                                      action.onChordsStatus(
                                        authReducers,
                                        !data.isOn,
                                      ),
                                    )
                                  }
                                  value={data.isOn}
                                />
                              </>
                            )}
                          </TouchableOpacity>
                          {index ===
                            authReducers.trackOptionsMenu.length - 1 && (
                            <Spacer space={hp('0.5%')} />
                          )}
                        </>
                      );
                    })}
                  </View>
                </Animated.View>
              )}
            </View>
          </Animated.View>
          {/* <Animated.View style={moveStructureAnimation.getLayout()}>
                    {authReducers.tappedSongResponse !== '' &&
                        authReducers.tappedSongResponse.section !== null &&
                        authReducers.tappedSongResponse.section !== [] &&
                        authReducers.tappedSongResponse.structure !== null &&
                        authReducers.tappedSongResponse.structure !== '' &&
                        !isQuestion &&
                        <View style={styles.structureView}>
                            <Image style={[globalStyles.img, { height: wp('3.5%'), width: wp('3.5%') }, authReducers.tappedSongResponse.type.toLowerCase() === 'minor' && { tintColor: colors.orange }]} source={images.rightArrow2} />
                            <Text style={[globalStyles.textHome, { fontSize: wp('4%'), marginLeft: wp('2%') }]}>{authReducers.tappedSongResponse.structure}</Text>
                        </View>}
                </Animated.View> */}

          {isBlurView && (
            <>
              <BlurView
                style={styles.absolute}
                blurType={DEVICE_OS === 'ios' ? 'dark' : 'dark'}
                blurAmount={10}
                // reducedTransparencyFallbackColor={colors.blackTransparent}
              />

              {/* <VibrancyView blurType="light" style={styles.absolute} blurAmount={10}> */}
              <View style={styles.absolute}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{alignItems: 'center'}}>
                  {/* {!isPlaylistAdding && */}
                  {/* <> */}
                  <Spacer space={wp('10%')} />
                  <TouchableOpacity
                    onPress={() => {
                      setIsOptionMenu(!isOptionMenu);
                      Util.slideAnimation(
                        moveOptionsAnimation,
                        isOptionMenu ? -DEVICE.DEVICE_HEIGHT : 0,
                        'y',
                        isOptionMenu && 'hideOption',
                      );
                      setIsBlurView(!isBlurView);
                    }}>
                    <Image
                      style={[
                        globalStyles.img,
                        {height: wp('12%'), width: wp('12%')},
                      ]}
                      source={
                        authReducers.tappedSongResponse !== '' &&
                        authReducers.tappedSongResponse.type.toLowerCase() ===
                          'minor'
                          ? images.orangeClose
                          : images.close
                      }
                    />
                  </TouchableOpacity>
                  <Spacer space={wp('4%')} />
                  <TextInputCustom
                    placeTxt={'New playlist'}
                    isSearchBox={true}
                    isAddPlaylist={true}
                    // isClickable={true}
                    onChangeText={input => setPlaylistInput(input)}
                    placeholderTextColor={colors.grayDark}
                    value={playlistInput}
                    isLoading={isAddPlaylistLoading}
                    editable={true}
                    isMinor={
                      authReducers.tappedSongResponse !== '' &&
                      authReducers.tappedSongResponse.type.toLowerCase() ===
                        'minor'
                    }
                    onAddClicked={() => onAddPlaylist()}
                    onSubmitEditing={() => onAddPlaylist()}
                    // onViewClicked={() => {
                    //     // setIsPlaylistAdding(!isPlaylistAdding);
                    //     setTimeout(() => {
                    //         // refPlaylistTitle.current.focus()
                    //     }, 10);
                    // }}
                  />
                  <Spacer space={wp('1%')} />
                  {authReducers.playlists.data !== undefined &&
                    authReducers.playlists.data.map((data, index) => {
                      return (
                        <TouchableOpacity
                          style={[
                            globalStyles.searchBox,
                            globalStyles.listItemContainer,
                            data.name === 'null@123' && {
                              height:
                                DEVICE_OS === 'ios' ? wp('20%') : wp('23%'),
                              backgroundColor: colors.TRANS,
                            },
                          ]}
                          key={data.id}
                          disabled={data.name === 'null@123' ? true : isLoading}
                          onPress={() => {
                            setIsLoading(!isLoading);
                            setItemTappedIndex(index);
                            dispatch(
                              action.onCreateNewPlaylist(
                                authReducers.userDetails,
                                playlistInput,
                                () => {
                                  setIsLoading(false);
                                  setItemTappedIndex('');
                                },
                                data,
                                authReducers.tappedSongResponse,
                                authReducers.trackOptionsMenu,
                              ),
                            );
                          }}
                          onLongPress={() =>
                            setIsLongPressOptions({
                              visibility: !isLongPressOptions.visibility,
                              selectedItem: data,
                            })
                          }>
                          {data.name !== 'null@123' && (
                            <>
                              <View>
                                <Text
                                  style={[
                                    globalStyles.textHome,
                                    {fontFamily: fonts.QE},
                                  ]}>
                                  {data.name}
                                </Text>
                                <Text
                                  style={[
                                    globalStyles.textHome,
                                    {
                                      fontFamily: fonts.FM,
                                      color: '#666666',
                                      fontSize: wp('3.7%'),
                                    },
                                  ]}>
                                  {data.total_song} songs
                                </Text>
                              </View>
                              {index !== itemTappedIndex ? (
                                <Image
                                  style={[
                                    globalStyles.img,
                                    {height: wp('6%'), width: wp('6%')},
                                  ]}
                                  source={
                                    authReducers.tappedSongResponse !== '' &&
                                    authReducers.tappedSongResponse.type.toLowerCase() ===
                                      'minor'
                                      ? images.rightRoundOrange
                                      : images.rightRound
                                  }
                                />
                              ) : (
                                <ActivityIndicator
                                  size="small"
                                  color={colors.white}
                                />
                              )}
                            </>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  {/* </>} */}
                </ScrollView>
              </View>
            </>
          )}
          {/* </VibrancyView> */}
          {/* <View style={[styles.absolute, { backgroundColor: 'rgba(0,0,0,0.3)' }]} /> */}

          <AppModal
            isModalVisible={isLongPressOptions}
            // container={{ transform: [{ rotate: '90deg' }], height: DEVICE.DEVICE_WIDTH, width: DEVICE.DEVICE_HEIGHT }}
            container={{
              height: DEVICE.DEVICE_HEIGHT,
              width: DEVICE.DEVICE_WIDTH,
            }}
            onRequestClose={type => {
              type === 'delete'
                ? dispatch(
                    action.onDeletePlaylist(
                      isLongPressOptions.selectedItem,
                      authReducers.userDetails,
                      () => {
                        setIsLongPressOptions({
                          visibility: !isLongPressOptions.visibility,
                          selectedItem: '',
                        });
                      },
                    ),
                  )
                : setIsLongPressOptions({
                    visibility: !isLongPressOptions.visibility,
                    selectedItem: '',
                  });
            }}
          />
        </View>
        {isPlaylistAdding && (
          // <View style={[{ alignItems: 'center' }, DEVICE_OS === 'ios' ? { position: 'absolute', bottom: keyboardHeight + wp('10%'), opacity: keyboardHeight } : { bottom: wp('35%') }]}>
          <View style={[{alignItems: 'center'}]}>
            {/* // <View style={{}}> */}
            <TouchableOpacity
              onPress={() => setIsPlaylistAdding(!isPlaylistAdding)}>
              <Image
                style={[
                  globalStyles.img,
                  {height: wp('12%'), width: wp('12%')},
                ]}
                source={
                  authReducers.tappedSongResponse !== '' &&
                  authReducers.tappedSongResponse.type.toLowerCase() === 'minor'
                    ? images.orangeClose
                    : images.close
                }
              />
            </TouchableOpacity>
            <Spacer space={wp('4%')} />
            <TextInputCustom
              refs={refPlaylistTitle}
              placeTxt={'New playlist'}
              isSearchBox={true}
              isAddPlaylist={true}
              onChangeText={input => setPlaylistInput(input)}
              placeholderTextColor={colors.grayDark}
              value={playlistInput}
              isLoading={isAddPlaylistLoading}
              returnKeyType={'done'}
              onAddClicked={() => onAddPlaylist()}
              isMinor={
                authReducers.tappedSongResponse !== '' &&
                authReducers.tappedSongResponse.type.toLowerCase() === 'minor'
              }
              onSubmitEditing={() => onAddPlaylist()}
            />
            {/* <KeyboardAvoidingView behavior={DEVICE_OS == "ios" ? "padding" : "height"} /> */}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    width: DEVICE.DEVICE_WIDTH,
    height: DEVICE.DEVICE_HEIGHT,
    zIndex: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTrackContainer: {
    justifyContent: 'center',
    // marginLeft: wp('12%')
  },
  repetitionContainer: {
    position: 'absolute',
    right: -wp('3%'),
    // bottom: hp('3.6%'),
    backgroundColor: '#E6E6E6',
    borderRadius: 3,
    paddingLeft: DEVICE_OS === 'ios' ? wp('1.5%') : wp('1%'),
    paddingRight: DEVICE_OS === 'ios' ? wp('1.5%') : wp('1%'),
    padding: hp('0.5%'),
    paddingTop: DEVICE_OS === 'ios' ? hp('0.2%') : hp('0.5%'),
    paddingBottom: DEVICE_OS === 'ios' ? hp('0.2%') : hp('0.3%'),
  },
  imgLine: {
    height: DEVICE_OS === 'android' ? wp('5.5%') : wp('6%'),
    width: wp('1.5%'),
    position: 'absolute',
    top: -hp('0.45%'),
  },
  minusTxt: {
    fontFamily: fonts.SB,
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    top: DEVICE_OS === 'ios' ? -hp('1.4%') : -hp('2.3%'),
    position: 'absolute',
  },
  secondLineContainer: {
    flexDirection: 'row',
    // width: hp('88.6%'),
    width: wp('88%'),
    alignSelf: 'center',
    marginRight: wp('1.4%'),
  },
  numbersTxt: {
    fontSize: wp('4.5%'),
  },
  structureView: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#383838',
    borderTopRightRadius: 15,
    padding: wp('0.5%'),
    paddingTop: DEVICE_OS === 'android' ? wp('1%') : wp('0.5%'),
    paddingRight: wp('3%'),
    paddingLeft: wp('10%'),
    paddingBottom: wp('1.2%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderContainer: {
    width: DEVICE.DEVICE_WIDTH,
    height: hp('80%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionSeprateView: {
    margin: DEVICE_OS === 'ios' ? -wp('0.05%') : -wp('0.06%'),
    backgroundColor: colors.creamBase3,
    padding: hp('0.5%'),
    paddingTop: DEVICE_OS === 'ios' ? hp('0.15%') : hp('0.5%'),
    paddingBottom: DEVICE_OS === 'ios' ? hp('0.15%') : hp('0.3%'),
    // paddingRight: 0,
    borderRadius: 5,
    flexDirection: 'row',
  },
  optionMenuMainContainer: {
    width: DEVICE.DEVICE_WIDTH,
    height: DEVICE.DEVICE_HEIGHT,
    position: 'absolute',
    alignItems: 'flex-end',
    // backgroundColor: colors.blackTransparent,
    zIndex: 200,
  },
  optionMenuSubContainer: {
    backgroundColor: colors.creamBase2,
    borderBottomLeftRadius: wp('4%'),
    paddingLeft: wp('8%'),
    paddingTop: wp('3%'),
  },
  optionMenuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: colors.grayDark,
    paddingRight: wp('10%'),
    paddingBottom: hp('1.5%'),
  },
});
