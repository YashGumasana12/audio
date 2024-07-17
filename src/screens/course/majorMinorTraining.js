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
import AutoHeightImage from 'react-native-auto-height-image';
import convertToProxyURL from 'react-native-video-cache';
import Video from 'react-native-video';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../redux/actions/courseActions';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {images} from '../../res/images';
import {colors} from '../../res/colors';
import {Spacer} from '../../res/spacer';
import {fonts} from '../../res/fonts';
import OnBackPressed from '../../components/OnBackPressed';
import Util from '../../utils/utils';
import {image_videos_base_url} from '../../apiHelper/APIs.json';
//#endregion
//#endregion
export default MajorMinorTraining = Props => {
  const props = Props.props;
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const courseReducers = useSelector(state => state.courseReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  //#region local state
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [isTappedSoundPlaying, setIsTappedSoundPlaying] = useState(false);
  const [tappedSoundObj, setTappedSoundObj] = useState('');
  const [currentTrackNumber, setCurrentTrackNumber] = useState(1);
  const [majorMinorArray, setMajorMinorArray] = useState([]);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [currentMajorMinorItem, setCurrentMajorMinorItem] = useState('');
  const [randomSoundIndex, setRandomSoundIndex] = useState(0);
  const [isTapTheNote, setIsTapTheNote] = useState(false);
  const [isNotesCorrectPlay, setIsNotesCorrectPlay] = useState(false);
  const [isFirstAttempt, setFirstAttempt] = useState(true);
  const [isRepeatNote, setRepeatNote] = useState(false);
  const [isPause, setIsPause] = useState(true);
  const [audioUrl, setAudioUrl] = useState('');
  const [update, setUpdate] = useState(0);
  const [isButtonDisable, setIsButtonDisable] = useState(true);
  const [avgReactTimeStart, setAvgReactTimeStart] = useState();
  const [avgDateUpdate, setAvgDateUpdate] = useState(0);
  const [isUnsure, setIsUnsure] = useState(false);
  //#endregion local state
  //#region ref
  const opacity = useRef(new Animated.Value(0)).current;
  const audioRef = useRef();
  //#endregion ref
  //#region local functions
  useEffect(() => {
    if (Object.keys(courseReducers.majorMinorResource).length !== 0) {
      setIsImageLoading(false);
      randomMajorMinor();
    }
  }, [courseReducers.majorMinorResource]);
  let randomMajorMinor = () => {
    let randomArray = Util.keyShuffleArray(courseReducers.majorMinorResource);
    setMajorMinorArray(randomArray);
    setCurrentNumberIndex(0);
    setCurrentMajorMinorItem(randomArray[0]);
    let randomNumber = Math.floor(Math.random() * 2 + 1);
    setRandomSoundIndex(randomNumber === 0 ? 0 : randomNumber === 1 ? 0 : 1);
    setUpdate(Math.floor(Math.random() * 100) + 1);
  };

  useEffect(() => {
    if (majorMinorArray.length !== 0) {
      onAssignSound(currentNumberIndex, randomSoundIndex);
    }
  }, [majorMinorArray, update]);
  const onAssignSound = (currentIndex, randomSound, URL) => {
    try {
      let audioURL =
        URL === undefined
          ? majorMinorArray[currentIndex][randomSound].audio
          : URL;
      setAudioUrl(image_videos_base_url + audioURL);
      URL === undefined &&
        ((isFirstAttempt && avgReactTimeStart === undefined) ||
          avgReactTimeStart === '') &&
        setAvgReactTimeStart(Date.now());
      URL === undefined
        ? setIsSoundPlaying(true)
        : setIsTappedSoundPlaying(true);
      URL === undefined &&
        setTimeout(() => {
          setIsTapTheNote(true);
        }, 1000);
      setIsPause(false);
      setIsButtonDisable(false);
    } catch (error) {
      console.log(`cannot play the sound file`, error);
    }
  };
  let stopSound = () => {
    setIsSoundPlaying(false);
    setFirstAttempt(true);
    // setIsButtonDisable(true);
    setIsTapTheNote(false);
    setRepeatNote(false);
    isPause && audioRef.current.seek(0);
    !isPause && setIsPause(true);
    audioUrl !== '' && setAudioUrl('');
    setTimeout(() => {
      setIsNotesCorrectPlay(false);
    }, 1200);
  };

  const onSkipSound = () => {
    stopSound();
    setIsTappedSoundPlaying(false);
    //#region Avgerage reaction time calculation
    if (avgReactTimeStart !== undefined && avgReactTimeStart !== '') {
      dispatch(
        actions.onCountMajorMinorAvgReactTimes(
          courseReducers.majorMinorAvgReactTimes,
          avgReactTimeStart,
          Date.now(),
        ),
      );
      setAvgReactTimeStart();
      setAvgDateUpdate(Math.floor(Math.random() * 100) + 1);
    }
    //#endregion Avgerage reaction time calculation

    if (currentTrackNumber >= 20) {
      Props.onCongrats();
      setTimeout(() => {
        setCurrentTrackNumber(1);
        setCurrentNumberIndex(0);
        setCurrentMajorMinorItem(majorMinorArray[0]);
      }, 1000);
    } else {
      setCurrentTrackNumber(currentTrackNumber + 1);
      if (currentNumberIndex === majorMinorArray.length - 1) {
        setTimeout(() => {
          setIsButtonDisable(true);
          randomMajorMinor();
        }, 100);
      } else {
        setCurrentNumberIndex(currentNumberIndex + 1);
        setCurrentMajorMinorItem(majorMinorArray[currentNumberIndex + 1]);
        let randomNumber = Math.floor(Math.random() * 2 + 1);
        setRandomSoundIndex(
          randomNumber === 0 ? 0 : randomNumber === 1 ? 0 : 1,
        );
        setTimeout(() => {
          setIsButtonDisable(true);
          onAssignSound(
            currentNumberIndex + 1,
            randomNumber === 0 ? 0 : randomNumber === 1 ? 0 : 1,
          );
        }, 100);
      }
    }
  };

  const onRepeatNote = () => {
    stopSound();
    setIsTapTheNote(false);
    setRepeatNote(true);
    // setFirstAttempt(false);
    setTimeout(() => {
      onAssignSound(currentNumberIndex, randomSoundIndex);
    }, 100);
  };

  const onUnsureNote = () => {
    stopSound();
    setIsTapTheNote(false);
    setIsUnsure(true);
    let otherChord = randomSoundIndex === 0 ? 1 : 0;
    setTimeout(() => {
      onAssignSound(
        '',
        '',
        majorMinorArray[currentNumberIndex][otherChord]?.audio,
      );
      setTimeout(() => {
        setIsTappedSoundPlaying(false);
        setIsTapTheNote(true);
      }, 1000);
    }, 100);
  };
  //#endregion local functions
  return (
    <View
      style={{
        ...globalStyles.flex,
        width: DEVICE.DEVICE_WIDTH,
        height: DEVICE.DEVICE_HEIGHT,
      }}>
      <OnBackPressed
        onBackPressed={() => {
          // Props.onBack();
          // setCurrentTrackNumber(1);
          // stopSound();
        }}
      />

      <View style={{flex: 1.2}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              ...globalStyles.paddingTop1,
              top: -wp(2),
              alignItems: 'center',
            }}>
            <Image
              style={[globalStyles.img, {height: wp('16%'), width: wp('16%')}]}
              source={images.lessonTitleIcon}
            />
            <Spacer space={wp(6)} />
            <View style={{...globalStyles.row, justifyContent: 'center'}}>
              <Text
                style={{
                  ...globalStyles.textHome,
                  fontSize: wp(5),
                  fontFamily: fonts.FM,
                  color: colors.creamBase3,
                }}>
                {courseReducers.correctMajorMinorAns}{' '}
              </Text>
              <Image
                style={[globalStyles.img, {height: wp(5), width: wp(5)}]}
                source={images.ic_done_round}
              />
            </View>
            <Spacer space={wp(1)} />
            <Text
              style={{
                ...globalStyles.textHome,
                fontSize: wp(5),
                fontFamily: fonts.FM,
                color: colors.grayDark3,
              }}>
              {currentTrackNumber}/20
            </Text>
            <Spacer space={wp(5)} />
            {isTapTheNote ? (
              <AutoHeightImage source={images.ic_choose_below} width={wp(53)} />
            ) : (
              <AutoHeightImage source={images.ic_listen} width={wp(22)} />
            )}
            <Spacer space={wp(3)} />

            <Animated.View style={{opacity: opacity, marginBottom: -wp(4)}}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: wp(4),
                  fontFamily: fonts.FL,
                }}>
                {isNotesCorrectPlay ? 'Correct !' : 'Oops wrong note'}
              </Text>
            </Animated.View>
            <Spacer space={wp(5)} />
            <View style={styles.btnContainer}>
              {['MINOR', 'MAJOR'].map((item, index) => {
                return (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.majorMinorBtn,
                        index === 0 && {backgroundColor: colors.orange},
                      ]}
                      disabled={isButtonDisable}
                      onPress={() => {
                        Util.onHapticFeedback();
                        //#region Avgerage reaction time calculation
                        if (
                          avgReactTimeStart !== undefined &&
                          avgReactTimeStart !== ''
                        ) {
                          dispatch(
                            actions.onCountMajorMinorAvgReactTimes(
                              courseReducers.majorMinorAvgReactTimes,
                              avgReactTimeStart,
                              Date.now(),
                            ),
                          );
                          setAvgReactTimeStart();
                        }
                        //#endregion Avgerage reaction time calculation

                        let tappedSoundObj =
                          index === 0
                            ? currentMajorMinorItem[0].audio_type === 'minor'
                              ? currentMajorMinorItem[0]
                              : currentMajorMinorItem[1]
                            : currentMajorMinorItem[0].audio_type === 'major'
                            ? currentMajorMinorItem[0]
                            : currentMajorMinorItem[1];
                        setTappedSoundObj(tappedSoundObj);
                        //#region manually stopped/play the sound
                        isPause && audioRef.current.seek(0);
                        !isPause && setIsPause(true);
                        audioUrl !== '' && setAudioUrl('');
                        setIsTapTheNote(true);
                        setTimeout(() => {
                          onAssignSound('', '', tappedSoundObj.audio);
                        }, 100);
                        //#endregion manually stopped/play the sound
                        currentMajorMinorItem[randomSoundIndex].letter_name ===
                        tappedSoundObj.letter_name
                          ? setIsNotesCorrectPlay(true)
                          : setIsNotesCorrectPlay(false);
                        //#region correct or wrong text animation
                        Animated.timing(opacity, {
                          toValue: 1,
                          duration: 250,
                        }).start();
                        setTimeout(() => {
                          Animated.timing(opacity, {
                            toValue: 0,
                            duration: 250,
                          }).start();
                        }, 1000);
                        //#endregion correct or wrong text animation
                      }}>
                      <Text
                        style={{
                          ...globalStyles.textHome,
                          color: colors.white,
                          fontSize: wp(6.5),
                        }}>
                        {item}
                      </Text>
                      <Text
                        style={{
                          ...globalStyles.textHome,
                          color:
                            index === 0 ? colors.orangeTxt : colors.greenTxt,
                          position: 'absolute',
                          bottom: wp(4),
                        }}>
                        {majorMinorArray.length !== 0
                          ? index === 0
                            ? currentMajorMinorItem[0].audio_type === 'minor'
                              ? currentMajorMinorItem[0].letter_name
                              : currentMajorMinorItem[1].letter_name
                            : currentMajorMinorItem[0].audio_type === 'major'
                            ? currentMajorMinorItem[0].letter_name
                            : currentMajorMinorItem[1].letter_name
                          : ''}
                      </Text>
                    </TouchableOpacity>
                    {index === 0 && <Spacer row={wp(1.5)} />}
                  </>
                );
              })}
            </View>
            <Spacer space={wp(10)} />
            {/* <Text style={{ ...globalStyles.textHome, fontSize: wp(5) }}>Unsure ?</Text> */}
            <TouchableOpacity
              onPress={() => {
                Util.onHapticFeedback();
                onUnsureNote();
              }}>
              <AutoHeightImage source={images.ic_unsure} width={wp(63)} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <View style={styles.endBtnContainer}>
        <TouchableOpacity
          onPress={() => {
            Util.onHapticFeedback();
            onSkipSound();
          }}>
          <AutoHeightImage source={images.skip} width={wp(35)} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Util.onHapticFeedback();
            onRepeatNote();
          }}>
          <AutoHeightImage source={images.repeat} width={wp(55)} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          globalStyles.paddingTop1,
          {position: 'absolute', left: wp('5.5%'), top: hp('0.6%')},
        ]}
        onPress={() => {
          Props.onBack();
          setCurrentTrackNumber(1);
          stopSound();
          dispatch(actions.onClearMajorMinorTraining(true));
          setTimeout(() => {
            setIsImageLoading(true);
          }, 300);
        }}>
        <Image
          style={[globalStyles.img, {height: wp('8.5%'), width: wp('8.5%')}]}
          source={images.backRound}
        />
      </TouchableOpacity>

      <Video
        ref={audioRef}
        paused={isPause}
        playWhenInactive={true}
        source={{uri: convertToProxyURL(audioUrl)}}
        audioOnly
        onEnd={() => {
          isPause && audioRef.current.seek(0);
          !isPause && setIsPause(true);
          audioUrl !== '' && setAudioUrl('');
          !isTapTheNote && setIsTapTheNote(true);
          isSoundPlaying && setIsSoundPlaying(false);

          if (!isUnsure && isTappedSoundPlaying) {
            Util.onHapticFeedback();
            if (
              currentMajorMinorItem[randomSoundIndex].letter_name ===
              tappedSoundObj.letter_name
            ) {
              isFirstAttempt &&
                dispatch(
                  actions.onSetCorrectMajorMinorAns(
                    courseReducers.correctMajorMinorAns + 1,
                  ),
                );
            } else {
              setFirstAttempt(false);
            }
            setIsTappedSoundPlaying(false);
            onSkipSound();
          }
          isUnsure && setIsUnsure(false);
        }}
      />

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
    </View>
  );
};
const styles = StyleSheet.create({
  endBtnContainer: {
    width: wp(100),
    flex: 0.15,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: colors.creamBase2,
    paddingTop: wp(3),
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: wp(87),
  },
  majorMinorBtn: {
    backgroundColor: colors.creamBase3,
    padding: wp(8),
    borderRadius: wp(4),
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
