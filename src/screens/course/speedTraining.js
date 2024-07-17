//#region import
//#region RN
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
//#endregion
//#region third party libs
import ImageSlider from 'react-native-image-slider';
import AutoHeightImage from 'react-native-auto-height-image';
import Sound from 'react-native-sound';
import convertToProxyURL from 'react-native-video-cache';
import Video from 'react-native-video';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../redux/actions/courseActions';
//#endregion
//#region common files
import Util from '../../utils/utils';
import {image_videos_base_url} from '../../apiHelper/APIs.json';
import globalStyles from '../../res/globalStyles';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {images} from '../../res/images';
import {colors} from '../../res/colors';
import {Spacer} from '../../res/spacer';
import {fonts} from '../../res/fonts';
import VideoDemo from './videoDemo';
import OnBackPressed from '../../components/OnBackPressed';
import {getBottomSpace, isIphoneX} from 'react-native-iphone-x-helper';
import MetronomeDemo from './metronomeDemo';
import Metronome from './metronomeClass';
//#endregion
//#endregion
global.isExploreSongs = false;
export default SpeedTraining = Props => {
  const props = Props.props;
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const courseReducers = useSelector(state => state.courseReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  //#region local state
  const [currentSlider, setCurrentSlider] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [clearAudio, setClearAudio] = useState(false);
  const [sliderHeight, setSliderHeight] = useState(0);
  const [isFullScreenVideo, setIsFullScreenVideo] = useState(false);
  const [isScrollStopped, setIsScrollStopped] = useState(false);
  const [videoViewPosition, setVideoViewPosition] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [update, setUpdate] = useState(0);
  const [tabsCurrentIndex, setTabsCurrentIndex] = useState(0);
  const [tabsCategoriesIndex, setTabsCategoriesIndex] = useState(0);
  const [toolbarButton, setToolbarButton] = useState([
    {icon: images.backRound},
    {icon: images.save},
  ]);
  const [isSoundLoading, setIsSoundLoading] = useState(false);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [sound, setSound] = useState();
  const [isPause, setIsPause] = useState(true);
  const [isMetronomeVisible, setIsMetronomeVisible] = useState(false);
  //#endregion local state
  //#region ref
  var onlineSong;
  // let interval = null;
  let runningSecond = 0;
  const interval = useRef(null);
  Sound.setCategory('Playback', false);
  const audioRef = useRef();
  //#endregion ref
  //#region local functions
  useEffect(() => {
    //#region Orientation
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
    //#endregion
  }, []);

  useEffect(() => {
    // console.log("courseReducers?.selectedPatternItem ", courseReducers?.selectedPatternItem);
    Object.keys(courseReducers?.selectedPatternItem).length !== 0 &&
      setIsMetronomeVisible(true);
  }, [courseReducers?.selectedPatternItem]);
  // useEffect(() => {
  //     console.log("currentPlayingSoundSeconds : ", currentPlayingSoundSeconds);
  //     let runningSecond = 0;
  //     if (currentPlayingSoundSeconds !== 0) {
  //         console.log("if.......");
  //         interval.current = setInterval(() => {
  //             // console.log("currentPlayingSoundSeconds : ", currentPlayingSoundSeconds);
  //             console.log("runningSecond : ", runningSecond);
  //             if (runningSecond === currentPlayingSoundSeconds) {
  //                 console.log("if");
  //                 setCurrentPlayingSoundSeconds(0);
  //                 // setRunningSecond(0);
  //                 runningSecond = 0;
  //                 clearInterval(interval);
  //                 setIsPlayingSong(false);
  //                 sound !== undefined && sound.stop();
  //             } else {
  //                 console.log("else : ", runningSecond);
  //                 // setRunningSecond(runningSecond + 1);
  //                 runningSecond = runningSecond + 1;
  //             }
  //         }, 1000);
  //     } else {
  //         console.log("else.......");
  //         runningSecond = 0;
  //         // setCurrentPlayingSoundSeconds(0);
  //         clearInterval(interval.current);
  //         setIsPlayingSong(false);
  //         sound !== undefined && sound.stop();
  //     }
  //     // return () => {
  //     //     alert('returmn')
  //     //     runningSecond = 0;
  //     //     clearInterval(interval);
  //     //     setIsPlayingSong(false);
  //     //     sound !== undefined && sound.stop();
  //     // };
  // }, [currentPlayingSoundSeconds]);

  // useEffect(() => {
  //     setIsSoundLoading(true);
  //     onlineSong = new Sound(image_videos_base_url + courseReducers?.selectedPatternItem?.audio, null, (error) => {
  //         if (error) {
  //             setIsSoundLoading(false);
  //             console.log('failed to load the sound', error);
  //             return;
  //         } else {
  //             // onlineSong.setVolume(1);
  //             setIsSoundLoading(false);
  //             setCurrentPlayingSoundSeconds1(Math.round(onlineSong.getDuration()));
  //             setSound(onlineSong);
  //         }
  //     });
  // }, [courseReducers.selectedPatternItem]);

  // const soundPlayingManagement = (songUrl) => {
  //     setIsSoundLoading(true);
  //     onlineSong = new Sound(songUrl, null, (error) => {
  //         if (error) {
  //             setIsSoundLoading(false);
  //             console.log('failed to load the sound', error);
  //             return;
  //         } else {
  //             setIsSoundLoading(false);
  //             setCurrentPlayingSoundSeconds(Math.round(onlineSong.getDuration()));
  //             setSound(onlineSong);
  //             onlineSong.play();
  //             setIsPlayingSong(true);
  //         }
  //     });
  // }
  // const stopSound = () => {
  //     setCurrentPlayingSoundSeconds(0);
  // }
  //#endregion local functions
  return !isVisible ? (
    <View style={globalStyles.flex} />
  ) : (
    courseReducers.selectedCourseItem !== '' && (
      <View
        style={{
          ...globalStyles.flex,
          width: DEVICE.DEVICE_WIDTH,
          height: DEVICE.DEVICE_HEIGHT,
        }}>
        <OnBackPressed
          onBackPressed={() => {
            Props.onBack();
            dispatch(actions.onPatternItemClicked('', false));
            setClearAudio(true);
            // stopSound();
            isPause && audioRef.current.seek(0);
            setIsPause(true);
            setIsMetronomeVisible(false);
          }}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.sliderContainer,
              {...globalStyles.paddingTop1, top: -wp(2)},
            ]}>
            <Image
              style={[globalStyles.img, {height: wp('16%'), width: wp('16%')}]}
              source={images.lessonTitleIcon}
            />
            <Spacer space={wp(1)} />
            <View style={{width: wp(85)}}>
              <Text
                style={[
                  globalStyles.textHome,
                  {fontSize: wp(8), color: '#333333'},
                ]}>
                SPEED TRAINING
              </Text>
              <Spacer space={wp(0.2)} />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <AutoHeightImage
                  source={
                    courseReducers?.selectedPatternItem?.category === '1'
                      ? images.ic_leftHand
                      : courseReducers?.selectedPatternItem?.category === '2'
                      ? images.ic_rightHand
                      : images.ic_bothHand
                  }
                  width={
                    courseReducers?.selectedPatternItem?.category === '3'
                      ? wp(9)
                      : wp(4.5)
                  }
                  style={{tintColor: colors.white}}
                />
                <Spacer row={wp(1)} />
                <TouchableOpacity
                  style={[
                    styles.patternsContainer,
                    courseReducers?.selectedPatternItem?.title?.length ===
                      3 && {width: wp(20)},
                  ]}
                  disabled={isSoundLoading}
                  onPress={() => {
                    // if (!isPlayingSong) {
                    //     setCurrentPlayingSoundSeconds(currentPlayingSoundSeconds1);
                    //     sound.play();
                    //     setIsPlayingSong(true);
                    // } else {
                    //     stopSound();
                    // }
                    // if (!isPlayingSong) {
                    // soundPlayingManagement(image_videos_base_url + courseReducers.selectedPatternItem.audio);
                    // try {
                    //     sound.play();
                    //     setIsPlayingSong(true);
                    //     setCurrentPlayingSoundSeconds(currentPlayingSoundSeconds1);
                    // } catch (error) {
                    //     console.log("Sound not loaded");
                    // }
                    Util.onHapticFeedback();
                    isPause && audioRef.current.seek(0);
                    setIsPause(!isPause);

                    // } else {
                    //     stopSound();
                    // }
                  }}>
                  {isSoundLoading ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <AutoHeightImage
                      source={!isPause ? images.ic_stop : images.ic_play}
                      width={wp(3.5)}
                    />
                  )}
                  <Text
                    style={{...globalStyles.textHome, maxWidth: wp(10)}}
                    numberOfLines={1}>
                    {courseReducers.selectedPatternItem.title}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Spacer space={wp(4)} />
            <AutoHeightImage
              width={wp(90)}
              source={{
                uri:
                  image_videos_base_url +
                  courseReducers.selectedPatternItem.image,
              }}
              onLoad={() => {
                setIsImageLoading(true);
              }}
              onLoadEnd={() => {
                setIsImageLoading(false);
                // courseReducers.selectedPatternItem.audio !== undefined && initializeSound();
              }}
            />

            <Spacer space={wp(3)} />
            {/* {isMetronomeVisible && <MetronomeDemo clearAudio={clearAudio} setClearAudio={(flag) => { setClearAudio(flag) }} currentBpm={courseReducers?.selectedPatternItem?.bpm_detail} />} */}
            {isMetronomeVisible && (
              <Metronome
                clearAudio={clearAudio}
                setClearAudio={flag => {
                  setClearAudio(flag);
                }}
                currentBpm={courseReducers?.selectedPatternItem?.bpm_detail}
                authReducers={authReducers}
                courseReducers={courseReducers}
                currentSlider={currentSlider}
                dispatch={dispatch}
              />
            )}
            <Spacer space={wp(5)} />
          </View>
        </ScrollView>
        {toolbarButton.map((data, index) => {
          return (
            <TouchableOpacity
              style={[
                globalStyles.paddingTop1,
                {position: 'absolute'},
                index === 0
                  ? {left: wp(5.5), top: hp(0.6)}
                  : {right: wp(5.5), top: hp(0.8)},
              ]}
              onPress={() => {
                if (index === 0) {
                  Props.onBack();
                  setClearAudio(true);
                  dispatch(actions.onPatternItemClicked('', false));
                  // stopSound();
                  isPause && audioRef.current.seek(0);
                  setIsPause(true);
                  setTimeout(() => {
                    setIsMetronomeVisible(false);
                  }, 500);
                } else {
                  Util.onHapticFeedback();
                  dispatch(
                    actions.onAddRemovePattern(
                      authReducers.userDetails,
                      courseReducers.selectedPatternItem,
                    ),
                  );
                }
              }}>
              <Image
                style={[
                  globalStyles.img,
                  {
                    height: index === 0 ? wp(8.5) : wp(6),
                    width: index === 0 ? wp(8.5) : wp(6),
                  },
                  index === 1 && {
                    tintColor:
                      courseReducers.selectedPatternItem.is_favorites === '1'
                        ? colors.white
                        : colors.grayDark,
                  },
                ]}
                source={data.icon}
              />
            </TouchableOpacity>
          );
        })}
        {isImageLoading && (
          <View
            style={{
              position: 'absolute',
              height: hp(100),
              width: DEVICE.DEVICE_WIDTH,
              backgroundColor: colors.creamBase1,
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        )}

        <Video
          ref={audioRef}
          paused={props.clearAudio ? true : isPause}
          playWhenInactive={true}
          source={{
            uri: convertToProxyURL(
              image_videos_base_url +
                courseReducers?.selectedPatternItem?.audio,
            ),
          }}
          audioOnly
          onLoadStart={() => setIsSoundLoading(true)}
          onLoad={() => setIsSoundLoading(false)}
          onEnd={() => {
            isPause && audioRef.current.seek(0);
            setIsPause(true);
          }}
        />
      </View>
    )
  );
};
const styles = StyleSheet.create({
  sliderContainer: {
    // flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  videoContainer: {
    backgroundColor: colors.blackBase6,
    borderRadius: wp(4),
    // height: hp(55),
    // width: wp(90)
    // aspectRatio: DEVICE.DEVICE_WIDTH / DEVICE.DEVICE_HEIGHT,
    // width: wp(90),
    // aspectRatio: 0.565
  },
  lessonsImg: {
    width: wp(90),
    resizeMode: 'stretch',
    // height: wp(43),
    flexGrow: 1,
  },
  exploreSongs: {
    backgroundColor: colors.creamBase3,
    padding: wp(2.2),
    paddingLeft: wp(4),
    paddingRight: wp(4),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: wp(1.5),
    alignSelf: 'flex-start',
  },
  noChapterContainer: {
    flex: 1,
    height: DEVICE.DEVICE_HEIGHT,
    width: DEVICE.DEVICE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp(10),
  },
  bottomPopup: {
    // position: 'absolute',
    // bottom: 0,
    marginBottom: isIphoneX() ? getBottomSpace() - wp(5) : wp(2),
    alignItems: 'center',
    width: DEVICE.DEVICE_WIDTH,
    paddingVertical: wp(6),
    backgroundColor: colors.creamBase1,
    shadowColor: colors.Black,
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // elevation: 10,
  },
  bottomPopupText: {
    fontFamily: fonts.QE,
    fontSize: wp(4.5),
    color: colors.creamBase4,
  },
  bottomPopupBtn: {
    backgroundColor: colors.creamBase3,
    width: wp(80),
    alignItems: 'center',
    justifyContent: 'center',
    height: wp(12),
    borderRadius: wp(2.5),
  },
  androidReverseShadow: {
    width: DEVICE.DEVICE_WIDTH,
    padding: wp(1),
    backgroundColor: colors.creamBase1,
    elevation: 3,
  },
  tabsMainContainer: {
    width: wp(90),
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabsMainContainer1: {
    width: wp(90),
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 0,
    padding: 0,
  },
  tabsItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('1.3%'),
    paddingBottom: hp('1.3%'),
    // padding: wp('2%'),
    borderRadius: 8,
    // backgroundColor: 'red'
  },
  tabsItemAnimation: {
    position: 'absolute',
    backgroundColor: colors.Dark_Gray,
    width: wp(44.3),
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
    marginLeft: wp(0.55),
    marginTop: wp(0.55),
  },
  patternsMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp(90),
    alignSelf: 'center',
  },
  patternsContainer: {
    borderRadius: wp(5),
    backgroundColor: colors.creamBase3,
    // height: wp(34),
    width: wp(18),
    padding: wp(1.5),
    paddingLeft: wp(3.5),
    paddingRight: wp(3.5),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
