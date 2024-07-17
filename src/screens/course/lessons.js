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
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
//#endregion
//#region third party libs
import ImageSlider from 'react-native-image-slider';
import AutoHeightImage from 'react-native-auto-height-image';
import Sound from 'react-native-sound';
import convertToProxyURL from 'react-native-video-cache';
import Video from 'react-native-video';
import {getBottomSpace, isIphoneX} from 'react-native-iphone-x-helper';
import Toast from 'react-native-simple-toast';
// import KeyboardSpacer from '@types/react-native-keyboard-spacer';
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
import MetronomeDemo from './metronomeDemo';
import Metronome from './metronomeClass';
import {UseKeyboard} from '../../components/UseKeyboard';
import {fcmService} from '../../apiHelper/FCMService';
//#endregion
//#endregion
global.isExploreSongs = false;
let moveTabsAnimation = new Animated.Value(wp(44.3));
let moveFavAnimation = new Animated.Value(-DEVICE.DEVICE_WIDTH);
let moveExploreAnimation = new Animated.Value(0);
export default lessons = Props => {
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
  const [isCurrentIndexChanged, setIsCurrentIndexChanged] = useState(true);
  const [sliderHeight, setSliderHeight] = useState(0);
  const [isFullScreenVideo, setIsFullScreenVideo] = useState(false);
  const [isScrollStopped, setIsScrollStopped] = useState(false);
  const [videoViewPosition, setVideoViewPosition] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [update, setUpdate] = useState(0);
  const [tabsCurrentIndex, setTabsCurrentIndex] = useState(1);
  const [tabsCategoriesIndex, setTabsCategoriesIndex] = useState('1');
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [playingSongIndex, setPlayingSongIndex] = useState(0);
  const [sound, setSound] = useState();
  const [currentPlayingSoundSeconds, setCurrentPlayingSoundSeconds] =
    useState(0);
  const [isSoundLoading, setIsSoundLoading] = useState(false);
  const [songSection, setSongSection] = useState(0);
  const [songUrl, setSongUrl] = useState('');
  const [isPause, setIsPause] = useState(true);
  const [clearAudio, setClearAudio] = useState(false);
  const [selectedLetterIndex, setSelectedLetterIndex] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [keyboardHeight] = UseKeyboard();
  const [isQueSending, setIsQueSending] = useState(false);
  const [isQueSent, setIsQueSent] = useState(false);
  //#endregion local state
  //#region ref
  let videoPlayer = useRef(null);
  const scrollRef = useRef([]);
  const scrollSliderRef = useRef([]);
  const scrollKeyTrainingRef = useRef(null);
  var onlineSong;
  const interval = useRef(null);
  const audioRef = useRef();
  // Sound.setCategory('Playback', false);
  //#endregion ref
  //#region local functions
  useEffect(() => {
    if (courseReducers.selectedCourseItem.chapter_index !== undefined) {
      setCurrentSlider(Number(courseReducers.selectedCourseItem.chapter_index));
      setTimeout(() => {
        setIsCurrentIndexChanged(false);
      }, 600);
    }
    if (
      courseReducers.selectedCourseItem?.speed_training === '1' ||
      courseReducers.selectedCourseItem.chapter_detail?.length === 0
    ) {
      setIsImageLoading(false);
    }
    var favBreakException = {};
    try {
      courseReducers.selectedCourseItem.chapter_detail?.forEach(element => {
        if (element.type === 'image' && element.type === 'video') {
          throw favBreakException;
        } else {
          setIsImageLoading(false);
        }
      });
    } catch (e) {
      if (e !== favBreakException) throw e;
    }

    //#region Orientation
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
    //#endregion
  }, [courseReducers.selectedCourseItem]);
  useEffect(() => {
    if (Props.isIapSuccess) {
      // Props.onBack();
      setTimeout(() => {
        setCurrentSlider(0);
        setIsImageLoading(true);
      }, 300);
    }
  }, [Props.isIapSuccess]);
  // useEffect(() => {
  //     console.log("currentPlayingSoundSeconds : ", currentPlayingSoundSeconds);
  //     // let interval = null;
  //     let runningSecond = 0;
  //     if (currentPlayingSoundSeconds !== 0) {
  //         interval.current = setInterval(() => {
  //             console.log("currentPlayingSoundSeconds : ", currentPlayingSoundSeconds);
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
  //         runningSecond = 0;
  //         // setCurrentPlayingSoundSeconds(0);
  //         clearInterval(interval.current);
  //         setIsPlayingSong(false);
  //         sound !== undefined && sound.stop();
  //     }
  //     // return () => {
  //     //     runningSecond = 0;
  //     //     clearInterval(interval);
  //     //     setIsPlayingSong(false);
  //     //     sound !== undefined && sound.stop();
  //     // };
  // }, [currentPlayingSoundSeconds]);

  const soundPlayingManagement = (songUrl, index) => {
    // setPlayingSongIndex(index);
    // setIsSoundLoading(true);
    // onlineSong = new Sound(songUrl, null, (error) => {
    //     if (error) {
    //         setIsSoundLoading(false);
    //         console.log('failed to load the sound', error);
    //         return;
    //     } else {
    //         setIsSoundLoading(false);
    //         setCurrentPlayingSoundSeconds(Math.round(onlineSong.getDuration()));
    //         setSound(onlineSong);
    //         onlineSong.play();
    //         setIsPlayingSong(true);
    //     }
    // });
    if (playingSongIndex == index) {
      isPause && audioRef.current.seek(0);
      setIsPause(!isPause);
    } else {
      audioRef.current.seek(0);
      setIsPause(false);
      setPlayingSongIndex(index);
    }
    setSongUrl(songUrl);
  };
  const stopSong = () => {
    setIsPause(true);
  };
  // const stopSound = () => {
  //     setIsPlayingSong(false);
  //     sound !== undefined && sound.stop();
  //     setCurrentPlayingSoundSeconds(0);
  // }
  const renderSlidingView = (index, data, style, id) => {
    return (
      <View key={index} style={[style, styles.sliderContainer]}>
        {data.chapter_detail.map((item, i) => {
          return (
            <>
              {i !== 0 && <Spacer space={isFullScreenVideo ? 0 : wp(2)} />}
              {item.type === 'video' && (
                <View
                  style={[
                    styles.videoContainer,
                    !isFullScreenVideo
                      ? {
                          width: wp(90),
                          aspectRatio: 0.565,
                        }
                      : {
                          height: DEVICE.DEVICE_HEIGHT,
                          width: DEVICE.DEVICE_WIDTH,
                        },
                  ]}
                  onLayout={e => {
                    e.nativeEvent.layout.y !== 0 &&
                      setVideoViewPosition(e.nativeEvent.layout.y);
                  }}>
                  {currentSlider === index && (
                    <VideoDemo
                      ref={videoRef => {
                        videoPlayer[index] = videoRef;
                      }}
                      source={image_videos_base_url + item.media}
                      playButtonText={
                        courseReducers.selectedCourseItem.speed_training === '1'
                          ? data.name
                          : courseReducers.selectedCourseItem.recognizing ===
                            '1'
                          ? data.chapter[index].title
                          : data.title
                      }
                      onFullScreen={flag => {
                        if (id === 0) {
                          flag &&
                            scrollRef?.current[index]?.scrollTo({
                              y: 0,
                              animated: true,
                            });
                          setIsFullScreenVideo(flag);
                          setTimeout(() => {
                            !flag &&
                              scrollRef?.current[index]?.scrollTo({
                                x: 0,
                                y: videoViewPosition,
                                animated: false,
                              });
                          }, 50);
                        } else {
                          flag &&
                            scrollSliderRef?.current[index]?.scrollTo({
                              y: 0,
                              animated: true,
                            });
                          setIsFullScreenVideo(flag);
                          setTimeout(() => {
                            !flag &&
                              scrollSliderRef?.current[index]?.scrollTo({
                                x: 0,
                                y: videoViewPosition,
                                animated: false,
                              });
                          }, 50);
                        }
                      }}
                      onSliderChangeValue={flag => {
                        setIsScrollStopped(flag);
                      }}
                      onVideoLoad={() => setIsImageLoading(false)}
                    />
                  )}
                </View>
              )}

              {!isFullScreenVideo && (
                <>
                  {item.type === 'image' && (
                    <View style={{borderRadius: wp(4), overflow: 'hidden'}}>
                      <AutoHeightImage
                        width={wp(90)}
                        animated={true}
                        source={{uri: image_videos_base_url + item.media}}
                        fallbackSource={images.appLogo}
                        onLoadStart={() => {
                          DEVICE_OS === 'ios' && setIsImageLoading(true);
                        }}
                        onLoadEnd={() => {
                          setIsImageLoading(false);
                        }}
                      />
                    </View>
                  )}

                  {item.type === 'button' && (
                    <View style={{width: wp(90)}}>
                      <Text
                        style={{
                          ...globalStyles.text,
                          color: colors.white,
                          fontFamily: fonts.FM,
                          fontSize: wp('4%'),
                          paddingLeft: wp(5.5),
                        }}>
                        {item.note}
                      </Text>
                      <Spacer space={wp(2)} />
                      <TouchableOpacity
                        style={{...styles.exploreSongs, width: wp(55)}}
                        onPress={() => {
                          global.isExploreSongs = true;
                          Props.onBack('songs');
                          setCurrentSlider(0);
                        }}>
                        <View style={{flex: 1}}>
                          <Text
                            style={{
                              ...globalStyles.textHome,
                              color: colors.creamBase4,
                              textAlign: 'center',
                            }}>
                            {item.media}
                          </Text>
                        </View>
                        <Image
                          source={images.rightArrow}
                          style={{
                            ...globalStyles.img,
                            height: wp('3%'),
                            width: wp('3%'),
                            tintColor: colors.creamBase4,
                            flex: 0.1,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  {/* 
                                    {item.type === "metronome" &&
                                        <MetronomeDemo style={{ flex: 0 }} clearAudio={clearAudio} setClearAudio={(flag) => { setClearAudio(flag) }} isLessons={true} currentSlider={currentSlider} currentBpm={item.chapter_bpm} />} */}
                  {/* {item.type === "metronome" &&
                                        <MetronomeDemos style={{ flex: 0 }} clearAudio={clearAudio} setClearAudio={(flag) => { setClearAudio(flag) }} isLessons={true} currentSlider={currentSlider} currentBpm={item.chapter_bpm} />} */}
                  {item.type === 'metronome' && (
                    <Metronome
                      style={{flex: 0}}
                      currentBpm={item.chapter_bpm}
                      clearAudio={clearAudio}
                      setClearAudio={flag => {
                        setClearAudio(flag);
                      }}
                      currentSlider={currentSlider}
                      isLessons={true}
                      authReducers={authReducers}
                      courseReducers={courseReducers}
                      dispatch={dispatch}
                    />
                  )}

                  {item.type === 'lession_question' &&
                    renderQuestionTextInput(scrollSliderRef, data, index)}
                </>
              )}
            </>
          );
        })}
        <Spacer space={wp(2)} />

        {/* #region next and chapter end button */}
        {/* {(courseReducers.selectedCourseItem.speed_training === '0' || courseReducers.selectedCourseItem.speed_training === null) && authReducers.userDetails.pro_status &&
                    (!isFullScreenVideo && index !== courseReducers.selectedCourseItem.chapter.length - 1 && courseReducers.selectedCourseItem.chapter[index + 1] !== undefined ?
                        <>
                            <Spacer space={wp(5)} />
                            <TouchableOpacity style={{ ...styles.exploreSongs, padding: wp(2.5), borderRadius: wp(2.5), marginLeft: 0, alignSelf: 'center', width: wp(65) }} onPress={() => {
                                setCurrentSlider(currentSlider + 1);
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ ...globalStyles.textHome, color: colors.white, textAlign: 'center' }}>{courseReducers.selectedCourseItem.chapter[index + 1].title}</Text>
                                </View>
                                <View style={{ flex: 0.05 }}>
                                    <Image source={images.rightArrow} style={{ ...globalStyles.img, height: wp('3%'), width: wp('3%'), tintColor: colors.white }} />
                                </View>
                            </TouchableOpacity>
                        </> :
                        !isFullScreenVideo && courseReducers.selectedCourseItem.levelName.toUpperCase() !== 'INTRO' &&
                        <>
                            <Spacer space={wp(5)} />
                            <TouchableOpacity onPress={() => {
                                dispatch(actions.onUpdateIndicator(authReducers.userDetails, courseReducers.selectedCourseItem));
                                Props.onBack();
                                setTimeout(() => {
                                    setCurrentSlider(0);
                                    setIsImageLoading(true);
                                }, 300);
                            }}>
                                <AutoHeightImage width={wp(70)} source={images.chapterEnd} />
                            </TouchableOpacity>
                        </>
                    )} */}
        {/* #endregion next and chapter end button */}

        {/* <Spacer space={wp(15)} /> */}
        {/* {data.chapter_detail.length !== 0 && <Spacer space={courseReducers.selectedCourseItem.levelName.toUpperCase() !== 'INTRO' ? wp(5) : -wp(5)} />} */}
      </View>
    );
  };
  const renderPatternView = index => {
    return (
      <>
        <View style={styles.tabsMainContainer}>
          <View style={[globalStyles.searchBox, styles.tabsMainContainer1]}>
            <Animated.View
              style={[
                styles.tabsItemContainer,
                styles.tabsItemAnimation,
                {transform: [{translateX: moveTabsAnimation}]},
              ]}>
              <Text style={[globalStyles.textHome, {color: colors.TRANS}]}>
                "
              </Text>
            </Animated.View>
            {['FAVORITES', 'EXPLORE'].map((data, index) => {
              return (
                <TouchableOpacity
                  style={styles.tabsItemContainer}
                  onPress={() => {
                    setTabsCurrentIndex(index);
                    Util.slideAnimation(
                      moveTabsAnimation,
                      index === 0 ? 0 : wp(44.3),
                    );
                    Util.slideAnimation(
                      moveFavAnimation,
                      index === 0 ? 0 : -DEVICE.DEVICE_WIDTH,
                    );
                    Util.slideAnimation(
                      moveExploreAnimation,
                      index === 0 ? DEVICE.DEVICE_WIDTH : 0,
                    );
                  }}>
                  {/* <Image style={[globalStyles.img, { height: wp('4%'), width: wp('4%'), position: 'absolute', left: index === 0 ? wp('3.8%') : wp('3%') }, index === 0 && { tintColor: colors.grayDark }, index === tabsCurrentIndex && { tintColor: colors.greenTxt }]} source={index === 0 ? images.save : images.playlist} /> */}
                  <Text
                    style={[
                      globalStyles.textHome,
                      {
                        fontSize: wp('4%'),
                        color:
                          index === tabsCurrentIndex
                            ? colors.white
                            : colors.grayDark6,
                      },
                    ]}>
                    {data}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Spacer space={wp(4)} />
        <View
          style={{
            ...styles.tabsMainContainer,
            justifyContent: 'space-evenly',
            marginLeft: wp(4),
            width: wp(92),
          }}>
          {[images.leftHand, images.rightHand, images.bothHand].map(
            (data, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    Util.onHapticFeedback();
                    setTabsCategoriesIndex(
                      index === 0 ? '1' : index === 1 ? '2' : '3',
                    );
                  }}>
                  <AutoHeightImage
                    source={data}
                    width={index === 0 ? wp(17) : index === 1 ? wp(20) : wp(22)}
                    style={{
                      tintColor:
                        index + 1 === Number(tabsCategoriesIndex)
                          ? colors.white
                          : colors.Dark_Gray,
                    }}
                  />
                </TouchableOpacity>
              );
            },
          )}
        </View>

        <Spacer space={wp(3)} />
        <View>
          {/* <Animated.View style={[moveFavAnimation.getLayout(), tabsCurrentIndex === 1 && { position: 'absolute' }]}> */}
          <Animated.View
            style={[
              {transform: [{translateX: moveFavAnimation}]},
              tabsCurrentIndex === 1 && {position: 'absolute'},
            ]}>
            <View style={styles.patternsMainContainer}>
              {renderPatternList(courseReducers?.favoritesPatterns, 0)}
            </View>
          </Animated.View>
          {/* <Animated.View style={[moveExploreAnimation.getLayout(), tabsCurrentIndex === 0 && { position: 'absolute' }]}> */}
          <Animated.View
            style={[
              {transform: [{translateX: moveExploreAnimation}]},
              tabsCurrentIndex === 0 && {position: 'absolute'},
            ]}>
            <View style={styles.patternsMainContainer}>
              {renderPatternList(courseReducers.selectedCourseItem.patterns, 1)}
            </View>
          </Animated.View>

          <Spacer space={wp(2)} />
          {/* {isLessonQue && renderQuestionTextInput(scrollRef, index)} */}
        </View>
      </>
    );
  };
  const renderPatternList = (data, id) => {
    return data?.map((data, index) => {
      return (
        data.category === tabsCategoriesIndex && (
          <TouchableOpacity
            style={styles.patternsContainer}
            disabled={isSoundLoading}
            onPress={() => {
              // stopSound();
              setClearAudio(true);
              stopSong();
              setTimeout(() => {
                Props.onPatternClicked();
                tabsCurrentIndex === 0 && (data.is_favorites = '1');
                dispatch(actions.onPatternItemClicked(data, true));
              }, 100);
            }}>
            <Text
              style={{...globalStyles.textHome, maxWidth: wp(10)}}
              numberOfLines={1}>
              {data.title}
            </Text>
            <TouchableOpacity
              disabled={isSoundLoading}
              onPress={() => {
                // if (!isPlayingSong) {
                Util.onHapticFeedback();
                setSongSection(tabsCurrentIndex);
                soundPlayingManagement(
                  image_videos_base_url + data.audio,
                  index,
                );
                // } else {
                //     setSongSection(tabsCurrentIndex);
                //     stopSound();
                //     if (songSection !== id) {
                //         soundPlayingManagement(image_videos_base_url + data.audio, index);
                //     } else if (playingSongIndex !== index) {
                //         soundPlayingManagement(image_videos_base_url + data.audio, index);
                //     }
                // }
              }}>
              <AutoHeightImage
                source={
                  songSection === id && playingSongIndex === index && !isPause
                    ? images.patternStop
                    : images.patternPlay
                }
                width={wp(6)}
                style={
                  songSection === id &&
                  playingSongIndex === index &&
                  isSoundLoading && {tintColor: colors.TRANS}
                }
              />
              {songSection === id &&
                playingSongIndex === index &&
                isSoundLoading && (
                  <View style={{position: 'absolute', alignSelf: 'center'}}>
                    <ActivityIndicator size="small" color={colors.white} />
                  </View>
                )}
            </TouchableOpacity>
          </TouchableOpacity>
        )
      );
    });
  };
  const renderKeyTraining = () => {
    return (
      <View style={{width: wp(90), alignSelf: 'center'}}>
        <Text
          style={{
            ...globalStyles.textHome,
            ...styles.italicTxt,
            marginLeft: wp(2.7),
          }}>
          You’ll practice directly on your piano.
        </Text>
        <Spacer space={wp(3)} />
        <View
          style={{
            ...styles.videoContainer,
            ...styles.keyTrainingMainContainer,
          }}>
          <Spacer space={wp(3)} />
          <Text
            style={{
              ...globalStyles.textHome,
              ...styles.italicTxt,
              color: colors.grayDark3,
            }}>
            Select the type of training you want
          </Text>
          <Spacer space={wp(2)} />
          {courseReducers.trainingTypes.map((item, index) => {
            return (
              <>
                {index !== 0 && <Spacer space={wp(1.3)} />}
                <TouchableOpacity
                  style={[
                    {...styles.exploreSongs, ...styles.trainingTypesBtns},
                    !item.isSelected && {backgroundColor: colors.Dark_Gray},
                  ]}
                  disabled={item.isSelected}
                  onPress={() => {
                    dispatch(
                      actions.onTrainingItemClicked(
                        courseReducers.trainingTypes,
                        index,
                        courseReducers.trainingData,
                      ),
                    );
                    index !== 0 && setSelectedLetterIndex('');
                  }}>
                  <Text
                    style={{
                      ...globalStyles.textHome,
                      color: colors.white,
                      fontSize: wp(4.1),
                      textAlign: 'center',
                    }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </>
            );
          })}
          <Spacer space={wp(3)} />
          <Text
            style={{
              ...globalStyles.textHome,
              ...styles.italicTxt,
              color: colors.grayDark3,
            }}>
            Select the key(s) you want to train with
          </Text>
          <Spacer space={wp(2)} />
          {courseReducers.selectedTrainingIndex !== 0 && (
            <View style={{...styles.tabsMainContainer, width: wp(76)}}>
              {courseReducers.trainingData.training.tabs.map((item, index) => {
                return (
                  <>
                    <TouchableOpacity
                      style={[
                        {
                          ...styles.exploreSongs,
                          ...styles.trainingTypesBtns,
                          ...styles.trainingTabsBtns,
                        },
                        index === 0 && {
                          paddingLeft: wp(5),
                          paddingRight: wp(5),
                        },
                        !item.isSelected && {backgroundColor: colors.Dark_Gray},
                      ]}
                      onPress={() =>
                        dispatch(
                          actions.onTrainingTabsClicked(
                            courseReducers.trainingData,
                            index,
                          ),
                        )
                      }>
                      <Text
                        style={{
                          ...globalStyles.textHome,
                          color: colors.white,
                          fontSize: wp(4.3),
                          textAlign: 'center',
                        }}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  </>
                );
              })}
            </View>
          )}
          <Spacer space={wp(1)} />
          <View style={{width: wp(100)}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View>
                <View style={{flexDirection: 'row'}}>
                  {courseReducers.trainingData.training.majorOnly.map(
                    (item, index) => {
                      return (
                        <>
                          <Spacer row={index === 0 ? wp(6) : wp(0.8)} />
                          <TouchableOpacity
                            style={[
                              {
                                ...styles.exploreSongs,
                                ...styles.trainingTypesBtns,
                                ...styles.trainingTabsBtns,
                                ...styles.trainingLetters,
                              },
                              !item.isSelected && {
                                backgroundColor: colors.Dark_Gray,
                              },
                            ]}
                            disabled={
                              courseReducers.selectedTrainingIndex === 0 &&
                              !item.isSelected &&
                              selectedLetterIndex !== ''
                            }
                            onPress={() => {
                              courseReducers.selectedTrainingIndex === 0 &&
                                setSelectedLetterIndex(
                                  item.isSelected ? '' : index,
                                );
                              dispatch(
                                actions.onTrainingTabsClicked(
                                  courseReducers.trainingData,
                                  index,
                                  true,
                                  0,
                                ),
                              );
                            }}>
                            <Text
                              style={{
                                ...globalStyles.textHome,
                                color: colors.white,
                                fontSize: wp(4.3),
                                textAlign: 'center',
                              }}>
                              {item.title}
                            </Text>
                          </TouchableOpacity>
                          {index ===
                            courseReducers.trainingData.training.majorOnly
                              .length -
                              1 && <Spacer row={wp(6)} />}
                        </>
                      );
                    },
                  )}
                </View>
                <Spacer space={wp(1)} />
                <View style={{flexDirection: 'row'}}>
                  {courseReducers.trainingData.training.minorOnly.map(
                    (item, index) => {
                      return (
                        <>
                          <Spacer row={index === 0 ? wp(6) : wp(0.8)} />
                          <TouchableOpacity
                            style={[
                              {
                                ...styles.exploreSongs,
                                ...styles.trainingTypesBtns,
                                ...styles.trainingTabsBtns,
                                ...styles.trainingLetters,
                              },
                              !item.isSelected && {
                                backgroundColor: colors.Dark_Gray,
                              },
                            ]}
                            disabled={
                              courseReducers.selectedTrainingIndex === 0 &&
                              !item.isSelected &&
                              selectedLetterIndex !== ''
                            }
                            onPress={() => {
                              courseReducers.selectedTrainingIndex === 0 &&
                                setSelectedLetterIndex(
                                  item.isSelected ? '' : index,
                                );
                              dispatch(
                                actions.onTrainingTabsClicked(
                                  courseReducers.trainingData,
                                  index,
                                  true,
                                  1,
                                ),
                              );
                            }}>
                            <Text
                              style={{
                                ...globalStyles.textHome,
                                color: colors.white,
                                fontSize: wp(4.3),
                                textAlign: 'center',
                              }}>
                              {item.title}
                            </Text>
                          </TouchableOpacity>
                          {index ===
                            courseReducers.trainingData.training.minorOnly
                              .length -
                              1 && <Spacer row={wp(6)} />}
                        </>
                      );
                    },
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
          <Spacer space={wp(5)} />
          <TouchableOpacity
            onPress={() => {
              Util.onHapticFeedback();
              if (courseReducers.selectedLetters.length !== 0) {
                dispatch(
                  actions.startKeyTrianing(courseReducers.trainingData, Props),
                );
                global.isStartKeyTraining = !global.isStartKeyTraining;
              } else Toast.show(`Please select a key`, Toast.SHORT);
            }}>
            <AutoHeightImage source={images.startTraining} width={wp(55)} />
          </TouchableOpacity>
          <Spacer space={wp(3)} />
        </View>
        <Spacer space={wp(2)} />
        {/* {isLessonQue && renderQuestionTextInput(scrollKeyTrainingRef, null)} */}
      </View>
    );
  };
  const renderQuestionTextInput = (ref, data, index) => {
    return (
      <AutoHeightImage
        width={wp(90)}
        source={images.lessonQue}
        style={{alignSelf: 'center'}}>
        {!isQueSent ? (
          <>
            <TextInput
              placeholder={
                'Type your question here, a member of our team will respond to you asap !'
              }
              placeholderTextColor={colors.creamBase5}
              style={styles.textInputStyle}
              onChangeText={setQuestionInput}
              value={questionInput}
              multiline={true}
              autoFocus={false}
              onFocus={() => {
                setTimeout(
                  () => {
                    index === null
                      ? ref?.current?.scrollToEnd({animated: true})
                      : ref?.current[index]?.scrollToEnd({animated: true});
                  },
                  DEVICE_OS === 'android' ? 200 : 0,
                );
              }}
              selectionColor={DEVICE_OS === 'ios' && colors.Main_gradiant}
            />
            <TouchableOpacity
              style={{
                ...styles.backBtn,
                ...styles.sendBtn,
                backgroundColor:
                  keyboardHeight || questionInput !== ''
                    ? colors.creamBase3
                    : colors.Dark_Gray,
              }}
              disabled={!questionInput || questionInput === ''}
              onPress={() => {
                fcmService.checkPermission(token => {
                  setIsQueSending(true);
                  dispatch(
                    actions.onAskedQue(
                      authReducers.userDetails,
                      data,
                      questionInput,
                      () => {
                        setIsQueSent(true);
                        setIsQueSending(false);
                        setQuestionInput('');
                      },
                    ),
                  );
                });
              }}>
              {/* <Text style={{ ...globalStyles.textHome, color: colors.greenTxt, fontSize: wp(5) }}>   Send   </Text> */}
              <Text
                style={{
                  ...globalStyles.textHome,
                  color: isQueSending
                    ? colors.TRANS
                    : keyboardHeight || questionInput !== ''
                    ? colors.creamBase4
                    : colors.blackBase6,
                  fontSize: wp(5),
                }}>
                {' '}
                Send{' '}
              </Text>
              {isQueSending && (
                <View style={{position: 'absolute', alignSelf: 'center'}}>
                  <ActivityIndicator size="small" color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <AutoHeightImage
              width={wp(10)}
              source={images.ic_done}
              style={{
                tintColor: colors.creamBase3,
                alignSelf: 'center',
                position: 'absolute',
                bottom: wp(18),
              }}
            />
            <Text style={{...globalStyles.textHome, ...styles.thanksTxt}}>
              Thanks, we will respond asap !
            </Text>
          </>
        )}
      </AutoHeightImage>
    );
  };
  //#endregion local functions
  return !isVisible ? (
    <View style={globalStyles.flex} />
  ) : (
    courseReducers.selectedCourseItem !== '' && (
      <View style={globalStyles.flex}>
        <OnBackPressed
          onBackPressed={() => {
            // stopSound();
            setIsQueSent(false);
            setClearAudio(true);
            setIsFullScreenVideo(false);
            stopSong();
            Props.onBack();
            dispatch(
              actions.onUpdateChapterIndicator(
                authReducers.userDetails,
                courseReducers.selectedCourseItem,
                currentSlider,
              ),
            );
            setTimeout(() => {
              setCurrentSlider(0);
              setIsImageLoading(true);
              dispatch(actions.onClearMajorMinorHighScore());
            }, 300);
          }}
        />

        {courseReducers.selectedCourseItem.unlimited_key_training === '1' ? (
          <View
            style={{height: DEVICE.DEVICE_HEIGHT, width: DEVICE.DEVICE_WIDTH}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={scrollKeyTrainingRef}>
              <>
                {!isFullScreenVideo && (
                  <View
                    style={[
                      styles.sliderContainer,
                      !isFullScreenVideo && {
                        ...globalStyles.paddingTop1,
                        top: -wp(2),
                      },
                    ]}>
                    <Image
                      style={[
                        globalStyles.img,
                        {height: wp('16%'), width: wp('16%')},
                      ]}
                      source={images.lessonTitleIcon}
                    />
                    <Spacer space={wp(1)} />
                    <View style={{width: wp(85)}}>
                      <Text
                        style={[
                          globalStyles.textHome,
                          {fontSize: wp(7), color: '#333333'},
                        ]}>
                        {courseReducers.selectedCourseItem.levelName.toUpperCase()}
                      </Text>
                      <Spacer space={-wp(0.4)} />
                      <Text
                        style={{
                          ...globalStyles.textHome,
                          fontSize: wp('4.8%'),
                          color: colors.white,
                        }}>
                        {courseReducers.selectedCourseItem.name}
                      </Text>
                    </View>
                  </View>
                )}
                <Spacer space={-wp(0.7)} />
                {renderKeyTraining()}
                <Spacer space={wp(8)} />
              </>
            </ScrollView>
          </View>
        ) : courseReducers.selectedCourseItem.speed_training === '1' ? (
          courseReducers.selectedCourseItem.patterns?.length === 0 ? (
            <View style={styles.noChapterContainer}>
              <Text style={{...globalStyles.textHome, fontFamily: fonts.FM}}>
                No patterns added for this chapter!
              </Text>
            </View>
          ) : (
            courseReducers.selectedCourseItem.patterns !== undefined &&
            courseReducers.selectedCourseItem.patterns.map((item, index) => {
              return (
                <View
                  style={{
                    height: DEVICE.DEVICE_HEIGHT,
                    width: DEVICE.DEVICE_WIDTH,
                  }}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    ref={el => (scrollRef.current[index] = el)}
                    scrollEnabled={!isFullScreenVideo || isScrollStopped}>
                    <>
                      {!isFullScreenVideo && (
                        <View
                          style={[
                            styles.sliderContainer,
                            !isFullScreenVideo && {
                              ...globalStyles.paddingTop1,
                              top: -wp(2),
                            },
                          ]}>
                          <Image
                            style={[
                              globalStyles.img,
                              {height: wp('16%'), width: wp('16%')},
                            ]}
                            source={images.lessonTitleIcon}
                          />
                          <Spacer space={wp(1)} />
                          <View style={{width: wp(85)}}>
                            <Text
                              style={[
                                globalStyles.textHome,
                                {fontSize: wp(7), color: '#333333'},
                              ]}>
                              {courseReducers.selectedCourseItem.levelName.toUpperCase()}
                            </Text>
                            <Spacer space={-wp(0.4)} />
                            <Text
                              style={{
                                ...globalStyles.textHome,
                                fontSize: wp('5%'),
                                color: colors.white,
                              }}>
                              {courseReducers.selectedCourseItem.name}
                            </Text>
                          </View>
                        </View>
                      )}
                      {!isFullScreenVideo && <Spacer space={wp(1)} />}
                      {renderSlidingView(
                        index,
                        courseReducers.selectedCourseItem,
                        {},
                        0,
                      )}
                      {courseReducers.selectedCourseItem.chapter_detail
                        .length !== 0 && <Spacer space={wp(2)} />}
                      {renderPatternView(index)}
                      <Spacer space={wp(8)} />
                      {/* {isImageLoading && <View style={{ position: 'absolute', height: hp(100), width: DEVICE.DEVICE_WIDTH, backgroundColor: colors.creamBase1, justifyContent: 'center' }}>
                                            <ActivityIndicator size="large" color={colors.white} />
                                        </View>} */}
                    </>
                  </ScrollView>
                </View>
              );
            })
          )
        ) : courseReducers.selectedCourseItem.chapter === null ||
          courseReducers.selectedCourseItem.chapter.length === 0 ? (
          <View style={styles.noChapterContainer}>
            <Text style={{...globalStyles.textHome, fontFamily: fonts.FM}}>
              No lessons added for this chapter!
            </Text>
          </View>
        ) : (
          <View style={{height: DEVICE.DEVICE_HEIGHT}}>
            <ImageSlider
              style={[
                {backgroundColor: colors.TRANS},
                isFullScreenVideo && {
                  height: DEVICE.DEVICE_HEIGHT,
                  width: DEVICE.DEVICE_WIDTH,
                },
              ]}
              images={courseReducers.selectedCourseItem.chapter}
              position={currentSlider}
              onPositionChanged={number => {
                number !== currentSlider && setClearAudio(true);
                setCurrentSlider(number);
                setIsQueSent(false);
                Keyboard.dismiss();
              }}
              isScrollEnabled={isFullScreenVideo || isScrollStopped}
              isFullScreenVideo={isFullScreenVideo}
              indicatorStyle={{
                marginBottom: DEVICE_OS === 'android' ? wp(4) : wp(8),
              }}
              isLessons={true}
              onChapterCompleted={() => {
                dispatch(
                  actions.onUpdateIndicator(
                    authReducers.userDetails,
                    courseReducers.selectedCourseItem,
                  ),
                );
                Props.onBack();
                setIsQueSent(false);
                setIsFullScreenVideo(false);
                dispatch(
                  actions.onUpdateChapterIndicator(
                    authReducers.userDetails,
                    courseReducers.selectedCourseItem,
                    currentSlider,
                  ),
                );
                setTimeout(() => {
                  setCurrentSlider(0);
                  setIsImageLoading(true);
                  dispatch(actions.onClearMajorMinorHighScore());
                }, 300);
              }}
              proStatus={
                courseReducers.selectedCourseItem.free_for_all === '1'
                  ? true
                  : authReducers.userDetails.pro_status
              }
              customSlide={({index, item, style, width}) => (
                <>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    ref={el => (scrollSliderRef.current[index] = el)}
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={!isFullScreenVideo || isScrollStopped}
                    style={{flexGrow: 1}}>
                    <>
                      {!isFullScreenVideo && (
                        <View
                          style={[
                            styles.sliderContainer,
                            !isFullScreenVideo && {
                              ...globalStyles.paddingTop1,
                              top: -wp(2),
                            },
                          ]}>
                          <Image
                            style={[
                              globalStyles.img,
                              {height: wp('16%'), width: wp('16%')},
                            ]}
                            source={images.lessonTitleIcon}
                          />
                          <Spacer space={wp(1)} />
                          <View style={{width: wp(85)}}>
                            <Text
                              style={[
                                globalStyles.textHome,
                                {fontSize: wp(7), color: '#333333'},
                              ]}>
                              {courseReducers.selectedCourseItem.levelName.toUpperCase()}
                            </Text>
                            <Spacer space={-wp(0.4)} />
                            <Text
                              style={{
                                ...globalStyles.textHome,
                                fontSize: wp('5%'),
                                color: colors.white,
                              }}>
                              {courseReducers.selectedCourseItem.name}
                            </Text>
                          </View>
                        </View>
                      )}
                      {!isFullScreenVideo && <Spacer space={wp(1)} />}
                      {renderSlidingView(
                        index,
                        courseReducers.selectedCourseItem.recognizing === '1'
                          ? courseReducers.selectedCourseItem
                          : item,
                        style,
                        1,
                      )}
                      <Spacer
                        space={
                          !authReducers.userDetails.pro_status &&
                          courseReducers.selectedCourseItem.free_for_all === '0'
                            ? wp(4)
                            : wp(20)
                        }
                      />
                      {/* {isImageLoading && <View style={{ position: 'absolute', height: hp(100), width: DEVICE.DEVICE_WIDTH, backgroundColor: colors.creamBase1, justifyContent: 'center' }}>
                                                    <ActivityIndicator size="large" color={colors.white} />
                                                </View>} */}
                    </>
                  </ScrollView>
                </>
              )}
              courseReducers={courseReducers}
              isMajorMinor={
                courseReducers.selectedCourseItem.recognizing !== '1'
              }
              onStartMajorMinor={() => {
                Props.onStartMajorMinorTraining();
              }}
            />
            {/* <KeyboardSpacer
              topSpacing={
                !authReducers.userDetails.pro_status &&
                courseReducers.selectedCourseItem.free_for_all === '0'
                  ? -wp(30)
                  : DEVICE_OS === 'android'
                  ? -wp(4)
                  : 0
              }
            /> */}
            {!authReducers.userDetails.pro_status &&
              courseReducers.selectedCourseItem.free_for_all === '0' && (
                <>
                  {DEVICE_OS === 'android' && (
                    <View style={styles.androidReverseShadow} />
                  )}
                  <View
                    style={[
                      styles.bottomPopup,
                      DEVICE_OS === 'android' && DEVICE.DEVICE_HEIGHT < 800
                        ? {marginBottom: wp(7)}
                        : {marginBottom: wp(2)},
                    ]}>
                    <TouchableOpacity
                      style={styles.bottomPopupBtn}
                      onPress={() => Props.onUnlockMembership()}
                      disabled={Props.isIAPLoading}>
                      {/* <Text style={{ ...styles.bottomPopupText, color: Props.isIAPLoading ? colors.TRANS : colors.creamBase4 }}>Try now for <Text style={{ color: Props.isIAPLoading ? colors.TRANS : colors.white }}>8.99$<Text style={{ fontFamily: fonts.FM, fontSize: wp(3) }}>/</Text>month</Text></Text> */}
                      <Text
                        style={{
                          ...styles.bottomPopupText,
                          color: Props.isIAPLoading
                            ? colors.TRANS
                            : colors.creamBase4,
                        }}>
                        Unlock everything for{' '}
                        <Text
                          style={{
                            color: Props.isIAPLoading
                              ? colors.TRANS
                              : colors.white,
                          }}>
                          8.99$
                          <Text style={{fontFamily: fonts.FM, fontSize: wp(3)}}>
                            /
                          </Text>
                          month
                        </Text>
                      </Text>
                      {Props.isIAPLoading && (
                        <ActivityIndicator
                          size="small"
                          color={colors.white}
                          style={{position: 'absolute'}}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
          </View>
        )}

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
        {courseReducers.selectedCourseItem.chapter !== null &&
          courseReducers.selectedCourseItem.chapter.length !== 0 &&
          courseReducers.selectedCourseItem?.speed_training !== '1' &&
          isCurrentIndexChanged && (
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
        {!isFullScreenVideo && (
          <TouchableOpacity
            style={[
              globalStyles.paddingTop1,
              {
                position: 'absolute',
                left: wp('5.5%'),
                top:
                  DEVICE_OS === 'android' && keyboardHeight !== 0
                    ? hp(6)
                    : hp('0.6%'),
              },
            ]}
            onPress={() => {
              // stopSound();
              setClearAudio(true);
              stopSong();
              Props.onBack();
              setIsQueSent(false);
              setIsFullScreenVideo(false);
              dispatch(
                actions.onUpdateChapterIndicator(
                  authReducers.userDetails,
                  courseReducers.selectedCourseItem,
                  currentSlider,
                ),
              );
              setTimeout(() => {
                setCurrentSlider(0);
                setIsImageLoading(true);
                setIsCurrentIndexChanged(true);
                dispatch(actions.onClearMajorMinorHighScore());
              }, 300);
            }}>
            <Image
              style={[
                globalStyles.img,
                {height: wp('8.5%'), width: wp('8.5%')},
              ]}
              source={images.backRound}
            />
          </TouchableOpacity>
        )}

        <Video
          ref={audioRef}
          paused={isPause}
          playWhenInactive={true}
          onLoadStart={() => songUrl !== '' && setIsSoundLoading(true)}
          onLoad={() => songUrl !== '' && setIsSoundLoading(false)}
          onEnd={() => songUrl !== '' && stopSong()}
          source={{uri: convertToProxyURL(songUrl)}}
          audioOnly
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
    justifyContent: 'flex-start',
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
    backgroundColor: colors.creamBase3,
    width: wp(44.4),
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
    marginLeft: wp(0.65),
    marginTop: wp(0.65),
  },
  patternsMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp(90),
    alignSelf: 'center',
  },
  patternsContainer: {
    borderRadius: wp(2),
    backgroundColor: colors.creamBase3,
    // height: wp(34),
    width: wp(20),
    padding: wp(1.5),
    paddingLeft: wp(2),
    paddingRight: wp(2),
    margin: wp(0.8),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtn: {
    backgroundColor: colors.blackBase8,
    padding: wp(3),
    // paddingLeft: wp(7),
    // paddingRight: wp(7),
    borderRadius: wp(3),
    flex: 1,
    alignItems: 'center',
  },
  sendBtn: {
    backgroundColor: colors.creamBase3,
    flex: 0,
    alignSelf: 'center',
    position: 'absolute',
    bottom: wp(4),
    padding: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  thanksTxt: {
    fontFamily: fonts.FM,
    position: 'absolute',
    bottom: wp(5),
    alignSelf: 'center',
  },
  italicTxt: {
    fontFamily: fonts.FM,
    color: colors.grayBold,
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontSize: wp(4.1),
  },
  keyTrainingMainContainer: {
    padding: wp(2),
    alignItems: 'center',
  },
  trainingTypesBtns: {
    flexDirection: 'column',
    alignSelf: 'center',
    padding: wp(2.5),
    paddingLeft: wp(5.7),
    paddingRight: wp(5.7),
    marginLeft: 0,
  },
  trainingTabsBtns: {
    padding: wp(2.5),
    paddingLeft: wp(4),
    paddingRight: wp(4),
    marginLeft: 0,
  },
  trainingLetters: {
    paddingLeft: wp(0),
    paddingRight: wp(0),
    width: wp(15.2),
  },
  textInputStyle: {
    height: wp(17),
    width: wp(75),
    fontFamily: fonts.FM,
    textAlignVertical: 'top',
    color: colors.white,
    lineHeight: wp(6),
    fontSize: DEVICE_OS === 'android' ? wp(3.6) : wp(3.7),
    // backgroundColor: 'red',
    alignSelf: 'center',
    marginTop: wp(14),
  },
});
