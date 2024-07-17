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
import Confetti from 'react-native-confetti';
import AnimateNumber from 'react-native-animate-number';
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
import {requestIAR} from '../../apiHelper/IAR';
import {TrainingGraph} from '../../components/TrainingGraph';
//#endregion
//#endregion
export default EarTrainingCongrats = Props => {
  const props = Props.props;
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const courseReducers = useSelector(state => state.courseReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  //#region local state
  const [animatedTextVisible, setAnimatedTextVisible] = useState(false);
  const [isNumberAnimated, setIsNumberAnimated] = useState(true);
  const selectedLevelId = courseReducers.selectedEarLevel.id;
  //#endregion local state
  //#region ref
  let confettiView = useRef(null);
  //#endregion ref
  //#region local functions
  useEffect(() => {
    if (courseReducers.earTrainingCongrats) {
      setTimeout(() => {
        setAnimatedTextVisible(true);
      }, 1000);
    }
  }, [courseReducers.earTrainingCongrats]);
  useEffect(() => {
    if (Object.keys(courseReducers?.earCongratsDetails).length !== 0) {
      dispatch(
        actions.onAddEarScore(authReducers.userDetails, courseReducers, () => {
          dispatch(
            actions.onGetEarGraphScore(
              authReducers.userDetails,
              courseReducers,
              false,
              courseReducers?.selectedEarTraining?.selectedEarLevel?.title,
            ),
          );
        }),
      );
    }
  }, [courseReducers?.earCongratsDetails]);
  useEffect(() => {
    if (Number(courseReducers?.earCongratsDetails?.avgReactionTime) !== NaN) {
      setTimeout(() => {
        // if (Number(courseReducers?.selectedEarLevel?.best_time) === 0) {
        //     confettiView && confettiView.startConfetti();
        // } else {
        if (courseReducers?.earCongratsDetails?.earScore >= 0) {
          if (
            courseReducers?.selectedEarLevel?.best_time === 0 &&
            Number(courseReducers?.earCongratsDetails?.earScore) >= 0
          ) {
            confettiView && confettiView.startConfetti();
          } else {
            courseReducers?.earCongratsDetails?.earScore !== 0 &&
              Number(courseReducers?.earCongratsDetails?.earScore) * 1000 >
                Number(courseReducers?.selectedEarLevel?.best_time) * 1000 &&
              confettiView &&
              confettiView.startConfetti();
          }
        }
        // !courseReducers?.earCongratsDetails?.earScore?.toString().includes('-') && (Number(courseReducers?.earCongratsDetails?.earScore) * 1000) < (Number(courseReducers?.selectedEarLevel?.best_time) * 1000) && confettiView && confettiView.startConfetti();

        // (Number(courseReducers?.earCongratsDetails?.avgReactionTime) * 1000) < (Number(courseReducers?.selectedEarLevel?.best_time) * 1000) && confettiView && confettiView.startConfetti();
        // }
        setTimeout(() => {
          setIsNumberAnimated(false);
        }, 1500);
      }, 1000);
    } else {
      setIsNumberAnimated(false);
    }
    // if (Number(courseReducers?.earCongratsDetails?.avgReactionTime) !== NaN && animatedTextVisible && courseReducers.correctAns == 20) {
    //     setTimeout(() => {
    //         if (Number(courseReducers?.selectedEarLevel?.best_time) === 0) {
    //             confettiView && confettiView.startConfetti();
    //         } else {
    //             (Number(courseReducers?.earCongratsDetails?.avgReactionTime) * 1000) < (Number(courseReducers?.selectedEarLevel?.best_time) * 1000) && confettiView && confettiView.startConfetti();
    //         }
    //         setTimeout(() => {
    //             setIsNumberAnimated(false);
    //         }, 1500);
    //     }, 1000);
    // } else {
    //     setIsNumberAnimated(false)
    // }

    // confettiView && confettiView.startConfetti()
    // (Number(courseReducers?.earCongratsDetails?.avgReactionTime) * 1000) < (Number(courseReducers?.selectedEarLevel?.best_time) * 1000)
  }, [
    courseReducers.selectedEarLevel,
    courseReducers?.earCongratsDetails,
    animatedTextVisible,
  ]);
  //#endregion local functions
  return (
    <View
      style={{
        ...globalStyles.flex,
        width: DEVICE.DEVICE_WIDTH,
        height: DEVICE.DEVICE_HEIGHT,
      }}>
      <OnBackPressed onBackPressed={() => {}} />

      <View style={{flex: 1.2}}>
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
            <Spacer space={wp(5)} />
            <View style={{width: wp(85), alignItems: 'center'}}>
              <Text
                style={{...globalStyles.textHome, fontSize: wp(5.3)}}>{`Level ${
                selectedLevelId === 3 || selectedLevelId === 8
                  ? '4'
                  : selectedLevelId === 4 || selectedLevelId === 9
                  ? '5'
                  : courseReducers?.selectedEarLevel?.title?.replace(
                      'level',
                      '',
                    )
              } results`}</Text>
              <Spacer space={wp(1)} />
              {courseReducers.selectedEarLevel.levelImg !== undefined && (
                <AutoHeightImage
                  source={courseReducers.selectedEarLevel.levelImg}
                  width={
                    selectedLevelId === 3 ||
                    selectedLevelId === 4 ||
                    selectedLevelId === 8 ||
                    selectedLevelId === 9
                      ? wp(60)
                      : wp(50)
                  }
                />
              )}
            </View>
            <Spacer space={wp(10)} />
            <View style={styles.totalTimeContainer}>
              <View style={{...globalStyles.flex}}>
                <Text
                  style={{
                    ...globalStyles.textHome,
                    fontFamily: fonts.FM,
                    color: colors.grayDark4,
                  }}>
                  Correct answers
                </Text>
                <Spacer space={wp(1)} />
                <View style={{...globalStyles.row, alignItems: 'flex-end'}}>
                  <Text style={{...globalStyles.textHome, fontSize: wp(10)}}>
                    {courseReducers.correctAns}
                  </Text>
                  <Spacer row={wp(0.5)} />
                  <View style={{...globalStyles.row, bottom: wp(1)}}>
                    <Text
                      style={{
                        ...globalStyles.textHome,
                        fontSize: wp(4),
                        fontFamily: fonts.FM,
                        color: colors.grayDark,
                        bottom: wp(0.2),
                      }}>
                      /
                    </Text>
                    <Text
                      style={{
                        ...globalStyles.textHome,
                        fontSize: wp(5),
                        color: colors.grayDark,
                      }}>
                      20
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{...globalStyles.flex}}>
                <Text
                  style={{
                    ...globalStyles.textHome,
                    fontFamily: fonts.FM,
                    color: colors.grayDark4,
                  }}>
                  Average reaction time
                </Text>
                <Spacer space={wp(1)} />
                {/* <Text style={{ ...globalStyles.textHome, fontSize: wp(10) }} numberOfLines={1}>{courseReducers.earCongratsDetails.totalTime}</Text> */}
                <View style={{...globalStyles.row, alignItems: 'flex-end'}}>
                  <Text style={{...globalStyles.textHome, fontSize: wp(10)}}>
                    {courseReducers?.earCongratsDetails?.avgReactionTime
                      ?.toString()
                      .match(/^\d+(?:\.\d{0,2})?/)}
                  </Text>
                  {/* {courseReducers?.earCongratsDetails?.avgReactionTime?.toString().includes('-') ? <Text style={{ ...globalStyles.textHome, fontSize: wp(10), fontFamily: fonts.SM }}>-<Text style={{ ...globalStyles.textHome, fontSize: wp(10) }}>{courseReducers?.earCongratsDetails?.avgReactionTime.toString().replace('-', '').match(/^\d+(?:\.\d{0,2})?/)}</Text></Text> : <Text style={{ ...globalStyles.textHome, fontSize: wp(10) }}>{courseReducers?.earCongratsDetails?.avgReactionTime?.toString().match(/^\d+(?:\.\d{0,2})?/)}</Text>} */}
                  <Spacer row={wp(0.5)} />
                  <Text
                    style={{
                      ...globalStyles.textHome,
                      fontSize: wp(5),
                      color: colors.grayDark,
                      bottom: wp(1.2),
                    }}>
                    sec
                  </Text>
                </View>
              </View>
              {/* <View style={{ ...globalStyles.flex }}>
                                <Text style={{ ...globalStyles.textHome, fontFamily: fonts.FM, color: colors.grayDark4 }}>Total time</Text>
                                <Spacer space={wp(1)} />
                                <Text style={{ ...globalStyles.textHome, fontSize: wp(10) }} numberOfLines={1}>{courseReducers.earCongratsDetails.totalTime}</Text>
                            </View> */}
            </View>
            <Spacer space={wp(5)} />
            <View style={globalStyles.row}>
              <Text
                style={{
                  ...globalStyles.textHome,
                  fontFamily: fonts.FM,
                  color: colors.grayDark4,
                }}>{`Your ear score (${courseReducers.correctAns}/`}</Text>
              <Text
                style={{
                  ...globalStyles.textHome,
                  color: colors.grayDark4,
                  fontFamily: fonts.FM,
                }}>
                {courseReducers?.earCongratsDetails?.avgReactionTime
                  ?.toString()
                  .match(/^\d+(?:\.\d{0,2})?/)}
              </Text>
              {/* {courseReducers?.earCongratsDetails?.avgReactionTime?.toString().includes('-') ? <Text style={{ ...globalStyles.textHome, color: colors.grayDark4, fontFamily: fonts.SM }}>-<Text style={{ ...globalStyles.textHome, color: colors.grayDark4, fontFamily: fonts.FM }}>{courseReducers?.earCongratsDetails?.avgReactionTime.toString().replace('-', '').match(/^\d+(?:\.\d{0,2})?/)}</Text></Text> : <Text style={{ ...globalStyles.textHome, color: colors.grayDark4, fontFamily: fonts.FM }}>{courseReducers?.earCongratsDetails?.avgReactionTime?.toString().match(/^\d+(?:\.\d{0,2})?/)}</Text>} */}
              <Text
                style={{
                  ...globalStyles.textHome,
                  fontFamily: fonts.FM,
                  color: colors.grayDark4,
                }}>{`)`}</Text>
            </View>
            <Spacer space={wp(1)} />
            <View style={{...globalStyles.row, alignItems: 'flex-end'}}>
              <Text style={{...globalStyles.textHome, fontSize: wp(15)}}>
                {courseReducers?.earCongratsDetails?.earScore
                  ?.toString()
                  .match(/^\d+(?:\.\d{0,2})?/)}
              </Text>
              {/* {courseReducers?.earCongratsDetails?.earScore?.toString().includes('-') ? <Text style={{ ...globalStyles.textHome, fontSize: wp(15), fontFamily: fonts.SM }}>-<Text style={{ ...globalStyles.textHome, fontSize: wp(15) }}>{courseReducers?.earCongratsDetails?.earScore?.toString().replace('-', '').match(/^\d+(?:\.\d{0,2})?/)}</Text></Text> : <Text style={{ ...globalStyles.textHome, fontSize: wp(15) }}>{courseReducers?.earCongratsDetails?.earScore?.toString().match(/^\d+(?:\.\d{0,2})?/)}</Text>} */}
              {/* <Text style={{ ...globalStyles.textHome, fontSize: wp(15) }}>{courseReducers?.earCongratsDetails?.earScore}</Text> */}
              {/* {courseReducers?.earCongratsDetails?.avgReactionTime?.toString().includes('-') ? <Text style={{ ...globalStyles.textHome, fontSize: wp(15), fontFamily: fonts.SM }}>-<Text style={{ ...globalStyles.textHome, fontSize: wp(15) }}>{courseReducers?.earCongratsDetails?.avgReactionTime.toString().replace('-', '').match(/^\d+(?:\.\d{0,2})?/)}</Text></Text> : <Text style={{ ...globalStyles.textHome, fontSize: wp(15) }}>{courseReducers?.earCongratsDetails?.avgReactionTime?.toString().match(/^\d+(?:\.\d{0,2})?/)}</Text>} */}
              {/* <Spacer row={wp(0.5)} />
                            <Text style={{ ...globalStyles.textHome, fontSize: wp(6), bottom: wp(2.5) }}>sec</Text> */}
            </View>
            {/* <Text style={{ ...globalStyles.textHome, fontFamily: fonts.FM, color: colors.grayDark4 }}>Average reaction time</Text>
                        <Spacer space={wp(1)} />
                        <View style={{ ...globalStyles.row, alignItems: 'flex-end' }}>
                            {courseReducers?.earCongratsDetails?.avgReactionTime?.toString().includes('-') ? <Text style={{ ...globalStyles.textHome, fontSize: wp(15), color: courseReducers.selectedEarLevel.is_major ? colors.creamBase3 : colors.orange, fontFamily: fonts.SM }}>-<Text style={{ ...globalStyles.textHome, fontSize: wp(15), color: courseReducers.selectedEarLevel.is_major ? colors.creamBase3 : colors.orange }}>{courseReducers?.earCongratsDetails?.avgReactionTime.toString().replace('-', '').match(/^\d+(?:\.\d{0,2})?/)}</Text></Text> : <Text style={{ ...globalStyles.textHome, fontSize: wp(15), color: courseReducers.selectedEarLevel.is_major ? colors.creamBase3 : colors.orange }}>{courseReducers?.earCongratsDetails?.avgReactionTime?.toString().match(/^\d+(?:\.\d{0,2})?/)}</Text>}
                            <Spacer row={wp(0.5)} />
                            <Text style={{ ...globalStyles.textHome, fontSize: wp(6), bottom: wp(2.5) }}>sec</Text>
                        </View> */}
            {/* <Spacer space={wp(10)} />
                        <Image source={courseReducers.selectedEarLevel.is_major ? images.congratsCup : images.congratsCupOrange} style={{ ...globalStyles.img, height: wp(12), width: wp(12) }} />
                        <Spacer space={wp(2)} />
                        <View style={{ ...globalStyles.row }}>
                            <Text style={{ ...globalStyles.textHome, fontFamily: fonts.FM, color: colors.grayDark4 }}>Best (for 20/20)</Text>
                            <Spacer row={wp(1)} />
                            {courseReducers.correctAns == 20 ?
                                <Text style={{ ...globalStyles.textHome, fontSize: wp(5) }}>{Number(courseReducers?.selectedEarLevel?.best_time) === 0 ? Number(courseReducers?.earCongratsDetails?.avgReactionTime?.toString().match(/^\d+(?:\.\d{0,2})?/)) : ((Number(courseReducers?.earCongratsDetails?.avgReactionTime) * 1000) < (Number(courseReducers?.selectedEarLevel?.best_time) * 1000) ? Number(courseReducers?.earCongratsDetails?.avgReactionTime?.toString().match(/^\d+(?:\.\d{0,2})?/)) : Number(courseReducers?.selectedEarLevel?.best_time?.toString().match(/^\d+(?:\.\d{0,2})?/)))} sec</Text>
                                :
                                <Text style={{ ...globalStyles.textHome, fontSize: wp(5) }}>?</Text>
                            }
                        </View> */}
            <Spacer space={wp(2)} />
            <View style={{...globalStyles.row}}>
              <Image
                source={
                  courseReducers.selectedEarLevel.is_major
                    ? images.congratsCup
                    : images.congratsCupOrange
                }
                style={{...globalStyles.img, height: wp(5), width: wp(5)}}
              />
              <Spacer row={wp(0.5)} />
              {/* {courseReducers.correctAns == 20 ? */}
              {/* <Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: courseReducers.selectedEarLevel.is_major ? colors.creamBase3 : colors.orange, }}>{Number(courseReducers?.selectedEarLevel?.best_time) === 0 ? Number(courseReducers?.earCongratsDetails?.avgReactionTime?.toString().match(/^\d+(?:\.\d{0,2})?/)) : ((Number(courseReducers?.earCongratsDetails?.avgReactionTime) * 1000) < (Number(courseReducers?.selectedEarLevel?.best_time) * 1000) ? Number(courseReducers?.earCongratsDetails?.avgReactionTime?.toString().match(/^\d+(?:\.\d{0,2})?/)) : Number(courseReducers?.selectedEarLevel?.best_time?.toString().match(/^\d+(?:\.\d{0,2})?/)))} sec</Text> */}
              {/* <Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: courseReducers.selectedEarLevel.is_major ? colors.creamBase3 : colors.orange }}>{((Number(courseReducers?.earCongratsDetails?.avgReactionTime) * 1000) < (Number(courseReducers?.selectedEarLevel?.best_time) * 1000) ? Number(courseReducers?.selectedEarLevel?.best_time?.toString().match(/^\d+(?:\.\d{0,2})?/)) : Number(courseReducers?.earCongratsDetails?.avgReactionTime?.toString().match(/^\d+(?:\.\d{0, 2})?/)))} sec</Text> */}

              {/* <Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: courseReducers.selectedEarLevel.is_major ? colors.creamBase3 : colors.orange }}>
                                {((Number(courseReducers?.earCongratsDetails?.earScore) * 1000) > (Number(courseReducers?.selectedEarLevel?.best_time) * 1000) ?
                                    courseReducers?.earCongratsDetails?.earScore?.toString().match(/^\d+(?:\.\d{0,2})?/) :
                                    courseReducers?.selectedEarLevel?.best_time?.toString().match(/^\d+(?:\.\d{0,2})?/)
                                )} */}
              {/* {(courseReducers?.earCongratsDetails?.earScore?.toString().includes('-') ? courseReducers?.selectedEarLevel?.best_time?.toString() :
                                    (Number(courseReducers?.earCongratsDetails?.earScore) * 1000) > (Number(courseReducers?.selectedEarLevel?.best_time) * 1000) ?
                                        (courseReducers?.selectedEarLevel?.best_time === 0 ?
                                            courseReducers?.earCongratsDetails?.earScore?.toString().replace('-', '').match(/^\d+(?:\.\d{0,2})?/) :
                                            courseReducers?.selectedEarLevel?.best_time?.toString().replace('-', '').match(/^\d+(?:\.\d{0,2})?/)) :
                                        courseReducers?.selectedEarLevel?.best_time?.toString().replace('-', '').match(/^\d+(?:\.\d{0,2})?/)
                                )} */}
              {/* </Text> */}

              {Number(courseReducers?.earCongratsDetails?.earScore) * 1000 >
              Number(courseReducers?.selectedEarLevel?.best_time) * 1000 ? (
                <Text
                  style={{
                    ...globalStyles.textHome,
                    fontSize: wp(5),
                    color: courseReducers.selectedEarLevel.is_major
                      ? colors.creamBase3
                      : colors.orange,
                  }}>
                  {courseReducers.correctAns}
                  <Text style={{fontFamily: fonts.FMC}}>/</Text>20
                </Text>
              ) : (
                <Text
                  style={{
                    ...globalStyles.textHome,
                    fontSize: wp(5),
                    color: courseReducers.selectedEarLevel.is_major
                      ? colors.creamBase3
                      : colors.orange,
                  }}>
                  {courseReducers?.selectedEarLevel?.correct_answer}
                  <Text style={{fontFamily: fonts.FMC}}>/</Text>20
                </Text>
              )}

              {/* <Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: courseReducers.selectedEarLevel.is_major ? colors.creamBase3 : colors.orange }}>
                                {((Number(courseReducers?.earCongratsDetails?.earScore) * 1000) > (Number(courseReducers?.selectedEarLevel?.best_time) * 1000) ?
                                    courseReducers?.earCongratsDetails?.earScore?.toString().match(/^\d+(?:\.\d{0,2})?/) :
                                    courseReducers?.selectedEarLevel?.best_time?.toString().match(/^\d+(?:\.\d{0,2})?/)
                                )}
                            </Text> */}

              {/* :
                                <Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: courseReducers.selectedEarLevel.is_major ? colors.creamBase3 : colors.orange, }}>?</Text> */}
              {/* } */}
            </View>
            {/* <Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: courseReducers.selectedEarLevel.is_major ? colors.creamBase3 : colors.orange }}>{courseReducers?.selectedEarLevel?.best_time?.toString().replace('-', '').match(/^\d+(?:\.\d{0,2})?/)} sec</Text>
                        <Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: courseReducers.selectedEarLevel.is_major ? colors.creamBase3 : colors.orange }}>{courseReducers?.earCongratsDetails?.earScore?.toString().replace('-', '').match(/^\d+(?:\.\d{0,2})?/)} sec</Text> */}
          </View>
          <TrainingGraph />
        </ScrollView>
      </View>

      <View style={styles.endBtnContainer}>
        <TouchableOpacity
          disabled={isNumberAnimated}
          onPress={() => {
            Util.onHapticFeedback();
            // Props.onBack();
            Util.onShare();
          }}>
          <AutoHeightImage
            source={
              courseReducers.selectedEarLevel.is_major
                ? images.earShare
                : images.earShareOrange
            }
            width={wp(35)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isNumberAnimated}
          onPress={() => {
            Util.onHapticFeedback();
            Props.onDoneTraining();
            confettiView.stopConfetti();
            dispatch(
              actions.onAddNoOfExercise(
                authReducers.userDetails,
                courseReducers,
              ),
            );
            dispatch(actions.onEarTrainingCongrats(false));
            dispatch(actions.onClearEarTrainingStart());

            // dispatch(actions.onAddEarScore(authReducers.userDetails, courseReducers, courseReducers.correctAns));

            // courseReducers.noOfExercise >= 2 && requestIAR();
            setTimeout(() => {
              setAnimatedTextVisible(false);
              setIsNumberAnimated(true);
            }, 200);
          }}>
          <AutoHeightImage source={images.earDone} width={wp(55)} />
        </TouchableOpacity>
      </View>

      <Confetti
        ref={node => (confettiView = node)}
        confettiCount={100}
        duration={1500}
        timeout={10}
        colors={[colors.creamBase3, colors.orange, colors.grayDark]}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  sliderContainer: {
    alignItems: 'center',
    width: DEVICE.DEVICE_WIDTH,
  },
  endBtnContainer: {
    width: wp(100),
    // flex: DEVICE_OS === 'ios' ? 0.15 : 0.17,
    flex: 0.15,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: colors.creamBase2,
    paddingTop: wp(3),
  },
  totalTimeContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    width: wp(90),
  },
});
