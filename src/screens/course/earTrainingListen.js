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
import SoundPlayer from 'react-native-sound-player';
import Toast from 'react-native-simple-toast';
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
import SvgImages from '../../utils/svgImages';
import {image_videos_base_url} from '../../apiHelper/APIs.json';
import {requestIAR} from '../../apiHelper/IAR';
//#endregion
//#endregion
global.isFirstAttempt = true;
global.setIsTapTheNote = false;
export default EarTrainingListen = Props => {
  const props = Props.props;
  //#region redux
  const dispatch = useDispatch();
  global.dispatch = useDispatch();
  global.courseReducers = useSelector(state => state.courseReducers);
  const authReducers = useSelector(state => state.authReducers);
  const courseReducers = useSelector(state => state.courseReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  //#region local state
  const [currentTrackNumber, setCurrentTrackNumber] = useState(1);
  const [SVGImage, setSVGImage] = useState();
  const [lettersArray, setLettersArray] = useState([]);
  const [numbersArray, setNumbersArray] = useState([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [isTapTheNote, setIsTapTheNote] = useState(false);
  const [isSoundTypePlaying, setIsSoundTypePlaying] = useState(false);
  const [isSoundNotesPlaying, setIsSoundNotesPlaying] = useState(false);
  const [currentNotesSoundIndex, setCurrentNotesSoundIndex] = useState(0);
  const [isNotesCorrectPlay, setIsNotesCorrectPlay] = useState(false);
  const [isFirstAttempt, setFirstAttempt] = useState(true);
  const [isRepeatNote, setRepeatNote] = useState(false);
  const [isLetterLoading, setIsLetterLoading] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [avgReactTimeStart, setAvgReactTimeStart] = useState();
  const [isPause, setIsPause] = useState(true);
  const [audioUrl, setAudioUrl] = useState('');
  //#endregion local state
  //#region ref
  const opacity = useRef(new Animated.Value(0)).current;
  const audioRef = useRef();
  //#endregion ref
  //#region local functions
  useEffect(() => {
    Object.keys(courseReducers.selectedEarTraining).length !== 0 &&
      (randomLetters(), randomNumbers());
  }, [courseReducers.selectedEarTraining]);

  const visible = () => {
    Animated.timing(opacity, {toValue: 1, duration: 250}).start();
  };
  const hide = () => {
    Animated.timing(opacity, {toValue: 0, duration: 250}).start();
  };

  useEffect(() => {
    if (
      courseReducers.isNoteClicked &&
      courseReducers.isNoteHighlightValue !== 0 &&
      !courseReducers.isAvgReactTimes
    ) {
      if (courseReducers.earLetterSound.randomNotes !== undefined) {
        Util.onHapticFeedback();
        var notesException = {};
        try {
          courseReducers.earLetterSound.randomNotes.forEach(element => {
            if (
              courseReducers.isNotePlayedValue.toString() ===
              (element.key_name.includes('-')
                ? element.key_name.replace(/\-/g, '')
                : element.key_name.includes('+')
                ? element.key_name.replace(/\+/g, '')
                : element.key_name)
            ) {
              if (isSoundNotesPlaying) {
                // dispatch(actions.onCurrentNotePlayed(courseReducers.earLetterSound.randomNotes[currentNotesSoundIndex]));
                setIsTapTheNote(true);
                setIsPause(true);
                isPause && audioRef.current.seek(0);
                setAudioUrl('');
                try {
                  setTimeout(() => {
                    setAudioUrl(image_videos_base_url + element.audio);
                    setIsPause(false);
                    setIsSoundNotesPlaying(false);
                  }, 200);
                } catch (e) {
                  console.log(`cannot play the sound file`, e);
                }
                // throw notesException;
              } else {
                try {
                  setAudioUrl(image_videos_base_url + element.audio);
                  setIsPause(false);
                } catch (e) {
                  console.log(`cannot play the sound file`, e);
                }
                throw notesException;
              }
            }
          });
        } catch (e) {
          if (e !== notesException) throw e;
        }

        setIsNotesCorrectPlay(courseReducers.isCorrectNotePlayed);
        if (courseReducers.isCorrectNotePlayed) {
          //#region Avgerage reaction time calculation
          if (avgReactTimeStart !== undefined && avgReactTimeStart !== '') {
            dispatch(
              actions.onCountAvgReactTimes(
                courseReducers.earAvgReactTimes,
                avgReactTimeStart,
                Date.now(),
              ),
            );
            setAvgReactTimeStart();
          }
          //#endregion Avgerage reaction time calculation
          if (
            currentNotesSoundIndex ===
            courseReducers.earLetterSound.randomNotes.length - 1
          ) {
            Util.keyShuffleArray(courseReducers.earLetterSound.randomNotes);
            setCurrentNotesSoundIndex(0);
          } else {
            setCurrentNotesSoundIndex(currentNotesSoundIndex + 1);
          }
        } else {
          global.isFirstAttempt = false;
          //#region Avgerage reaction time calculation
          if (avgReactTimeStart !== undefined && avgReactTimeStart !== '') {
            dispatch(
              actions.onCountAvgReactTimes(
                courseReducers.earAvgReactTimes,
                avgReactTimeStart,
                Date.now(),
              ),
            );
            setAvgReactTimeStart();
          }
          //#endregion Avgerage reaction time calculation
        }
        // isTapTheNote && (
        //     visible(),
        //     setTimeout(() => {
        //         hide()
        //     }, 1000)
        // );
        visible(),
          setTimeout(() => {
            hide();
          }, 1000);
      }
    }
  }, [courseReducers, isTapTheNote]);

  let randomLetters = () => {
    let randomArray = Util.keyShuffleArray(
      courseReducers.selectedEarTraining.lettersArray,
    );
    setLettersArray(randomArray);
    setSVGImage(
      SvgImages[
        `${randomArray[0].title}_${courseReducers.selectedEarTraining.selectedEarLevel.title}`
      ],
    );
    onGetLetterDetails(randomArray[0].title);
  };
  let randomNumbers = () => {
    let randomArray = Util.keyShuffleArray(
      courseReducers.selectedEarTraining.numbersArray,
    );
    setNumbersArray(randomArray);
    setCurrentNumberIndex(0);
  };
  let onGetLetterDetails = letter => {
    setIsLetterLoading(true);
    dispatch(
      actions.onGetLetter(letter, courseReducers, response => {
        setIsSoundTypePlaying(true);
        setAudioUrl(image_videos_base_url + response.soundType.audio);
        setIsPause(false);
        setIsLetterLoading(false);
      }),
    );
  };
  let notesSound = () => {
    try {
      ((isFirstAttempt && avgReactTimeStart === undefined) ||
        avgReactTimeStart === '') &&
        setAvgReactTimeStart(Date.now());
      setIsSoundNotesPlaying(true);
      // SoundPlayer.playUrl(image_videos_base_url + courseReducers.earLetterSound.randomNotes[currentNotesSoundIndex].audio);
      // SoundPlayer.setMixAudio(true);
      setAudioUrl(
        image_videos_base_url +
          courseReducers.earLetterSound.randomNotes[currentNotesSoundIndex]
            .audio,
      );
      setIsPause(false);
      dispatch(
        actions.onCurrentNotePlayed(
          courseReducers.earLetterSound.randomNotes[currentNotesSoundIndex],
        ),
      );
      setTimeout(() => {
        global.setIsTapTheNote = true;
        setIsTapTheNote(true);
      }, 200);
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  };

  let stopSound = () => {
    setIsSoundTypePlaying(false);
    setIsSoundNotesPlaying(false);
    setCurrentNotesSoundIndex(0);

    setFirstAttempt(true);
    global.isFirstAttempt = true;
    setIsTapTheNote(false);
    global.setIsTapTheNote = false;
    setRepeatNote(false);
    // SoundPlayer.stop();
    setIsPause(true);
    isPause && audioRef.current.seek(0);
    setAudioUrl('');
    setTimeout(() => {
      setIsNotesCorrectPlay(false);
    }, 1200);
  };

  let onChangeLetter = () => {
    stopSound();
    dispatch(actions.onClearLetterData());
    //#region Avgerage reaction time calculation
    if (avgReactTimeStart !== undefined && avgReactTimeStart !== '') {
      dispatch(
        actions.onCountAvgReactTimes(
          courseReducers.earAvgReactTimes,
          avgReactTimeStart,
          Date.now(),
        ),
      );
      setAvgReactTimeStart();
    }
    //#endregion Avgerage reaction time calculation
    if (currentTrackNumber >= 20) {
      stopSound();
      (courseReducers.noOfExercise === 2 ||
        courseReducers.noOfExercise === 9) &&
        requestIAR();
      // courseReducers.noOfExercise >= 2 && requestIAR();
      dispatch(actions.onEarTrainingCongrats(true, Props));
      setTimeout(() => {
        setCurrentTrackNumber(1);
        setCurrentLetterIndex(0);
        setCurrentNumberIndex(0);
      }, 800);
    } else {
      setCurrentTrackNumber(currentTrackNumber + 1);

      if (currentLetterIndex === 11) {
        randomLetters();
        setCurrentLetterIndex(0);
      } else {
        onGetLetterDetails(lettersArray[currentLetterIndex + 1].title);
        setSVGImage(
          SvgImages[
            `${lettersArray[currentLetterIndex + 1].title}_${
              courseReducers.selectedEarTraining.selectedEarLevel.title
            }`
          ],
        );
        setCurrentLetterIndex(currentLetterIndex + 1);
      }

      if (currentNumberIndex === numbersArray.length - 1) {
        randomNumbers();
      } else {
        setCurrentNumberIndex(currentNumberIndex + 1);
      }
    }
  };

  let onRepeatNote = () => {
    setIsTapTheNote(false);
    global.setIsTapTheNote = false;
    setRepeatNote(true);
    // Util.keyShuffleArray(courseReducers.earLetterSound.randomNotes);
    try {
      setIsSoundTypePlaying(true);
      // SoundPlayer.playUrl(image_videos_base_url + courseReducers.earLetterSound.soundType.audio);
      // SoundPlayer.setMixAudio(true);
      setAudioUrl(
        image_videos_base_url + courseReducers.earLetterSound.soundType.audio,
      );
      setIsPause(false);
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
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
          // setCurrentLetterIndex(0);
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
                {courseReducers.correctAns}{' '}
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
              <AutoHeightImage
                source={
                  courseReducers.selectedEarLevel.is_major
                    ? images.ic_tapnote
                    : images.ic_tapnoteOrange
                }
                width={wp(49)}
              />
            ) : (
              <AutoHeightImage
                source={
                  courseReducers.selectedEarLevel.is_major
                    ? images.ic_listen
                    : images.ic_listenOrange
                }
                width={wp(22)}
              />
            )}
            <Spacer space={wp(3)} />
            {/* <C props/> */}
            {/* <SVGImage props /> */}

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

            {SVGImage}

            {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {SVGImage}
                            {isLetterLoading &&
                                <View style={{ width: DEVICE.DEVICE_WIDTH, height: wp(27), backgroundColor: colors.TRANS, justifyContent: 'center', position: 'absolute', bottom: 0 }}>
                                    <ActivityIndicator size="large" color={colors.white} />
                                </View>}
                        </View> */}
          </View>
        </ScrollView>
      </View>

      <View style={styles.endBtnContainer}>
        <TouchableOpacity
          onPress={() => {
            Util.onHapticFeedback();
            onChangeLetter();
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
          setCurrentLetterIndex(0);
          stopSound();
          dispatch(actions.onClearEarTrainingStart());
        }}>
        <Image
          style={[globalStyles.img, {height: wp('8.5%'), width: wp('8.5%')}]}
          source={
            courseReducers.selectedEarLevel.is_major
              ? images.backRound
              : images.orangeBack
          }
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
          if (isSoundTypePlaying) {
            setIsSoundTypePlaying(false);
            notesSound();
          } else {
            if (isSoundNotesPlaying) {
              // (isFirstAttempt && avgReactTimeStart === undefined || avgReactTimeStart === '') && setAvgReactTimeStart(Date.now());
              setIsSoundNotesPlaying(false);
              // dispatch(actions.onCurrentNotePlayed(courseReducers.earLetterSound.randomNotes[currentNotesSoundIndex]));
              // setIsTapTheNote(true);
            } else {
              if (isNotesCorrectPlay) {
                Util.onHapticFeedback();
                setIsTapTheNote(false);
                global.setIsTapTheNote = false;
                // isFirstAttempt && !isRepeatNote && dispatch(actions.onSetCorrectAns(courseReducers.correctAns + 1));
                isFirstAttempt &&
                  dispatch(
                    actions.onSetCorrectAns(courseReducers.correctAns + 1),
                  );
                dispatch(actions.onIsCorrectNote(false));
                onChangeLetter();
              } else {
                setFirstAttempt(false);
                // //#region Avgerage reaction time calculation
                // if (avgReactTimeStart !== undefined && avgReactTimeStart !== '') {
                //     dispatch(actions.onCountAvgReactTimes(courseReducers.earAvgReactTimes, avgReactTimeStart, Date.now()));
                //     setAvgReactTimeStart();
                // }
                // //#endregion Avgerage reaction time calculation
              }
            }
          }
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  endBtnContainer: {
    width: wp(100),
    // flex: DEVICE_OS === 'ios' ? 0.15 : 0.17,
    flex: 0.15,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: colors.creamBase2,
    paddingTop: wp(3),
  },
});
