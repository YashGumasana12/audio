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
export default MajorMinorCongrats = Props => {
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
    if (
      Number(courseReducers?.majorMinorCongratsDetails?.avgReactionTime) !== NaN
    ) {
      dispatch(
        actions.onAddMajorMinorEarScore(
          authReducers.userDetails,
          courseReducers,
          () => {
            dispatch(
              actions.onGetEarGraphScore(
                authReducers.userDetails,
                courseReducers,
                true,
              ),
            );
          },
        ),
      );

      setTimeout(() => {
        if (courseReducers?.majorMinorCongratsDetails?.earScore >= 0) {
          if (
            courseReducers?.majorMinorHighScore?.best_time === 0 &&
            Number(courseReducers?.majorMinorCongratsDetails?.earScore) > 0
          ) {
            confettiView && confettiView.startConfetti();
          } else {
            courseReducers?.majorMinorCongratsDetails?.earScore !== 0 &&
              Number(courseReducers?.majorMinorCongratsDetails?.earScore) *
                1000 >
                Number(courseReducers?.majorMinorHighScore?.best_time) * 1000 &&
              confettiView &&
              confettiView.startConfetti();
          }
        }
        setTimeout(() => {
          setIsNumberAnimated(false);
        }, 1500);
      }, 1000);
    } else {
      setIsNumberAnimated(false);
    }
  }, [courseReducers?.majorMinorCongratsDetails, animatedTextVisible]);
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
                style={{
                  ...globalStyles.textHome,
                  fontSize: wp(5.3),
                  textAlign: 'center',
                }}>
                MINOR vs MAJOR{'\n'}results
              </Text>
            </View>
            <Spacer space={wp(12)} />
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
                    {courseReducers.correctMajorMinorAns}
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
                <View style={{...globalStyles.row, alignItems: 'flex-end'}}>
                  <Text style={{...globalStyles.textHome, fontSize: wp(10)}}>
                    {courseReducers?.majorMinorCongratsDetails?.avgReactionTime
                      ?.toString()
                      .match(/^\d+(?:\.\d{0,2})?/)}
                  </Text>
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
            </View>
            <Spacer space={wp(5)} />
            <View style={globalStyles.row}>
              <Text
                style={{
                  ...globalStyles.textHome,
                  fontFamily: fonts.FM,
                  color: colors.grayDark4,
                }}>{`Your ear score (${courseReducers.correctMajorMinorAns}/`}</Text>
              <Text
                style={{
                  ...globalStyles.textHome,
                  color: colors.grayDark4,
                  fontFamily: fonts.FM,
                }}>
                {courseReducers?.majorMinorCongratsDetails?.avgReactionTime
                  ?.toString()
                  .match(/^\d+(?:\.\d{0,2})?/)}
              </Text>
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
                {courseReducers?.majorMinorCongratsDetails?.earScore
                  ?.toString()
                  .match(/^\d+(?:\.\d{0,2})?/)}
              </Text>
            </View>
            <Spacer space={wp(2)} />
            <View style={{...globalStyles.row}}>
              <Image
                source={images.congratsCup}
                style={{...globalStyles.img, height: wp(5), width: wp(5)}}
              />
              <Spacer row={wp(0.5)} />
              {/* <Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: colors.creamBase3 }}>
                                {((Number(courseReducers?.majorMinorCongratsDetails?.earScore) * 1000) > (Number(courseReducers?.majorMinorHighScore?.best_time) * 1000) ?
                                    courseReducers?.majorMinorCongratsDetails?.earScore?.toString().match(/^\d+(?:\.\d{0,2})?/) :
                                    courseReducers?.majorMinorHighScore?.best_time?.toString().match(/^\d+(?:\.\d{0,2})?/)
                                )}
                            </Text> */}
              {Number(courseReducers?.majorMinorCongratsDetails?.earScore) *
                1000 >
              Number(courseReducers?.majorMinorHighScore?.best_time) * 1000 ? (
                <Text
                  style={{
                    ...globalStyles.textHome,
                    fontSize: wp(5),
                    color: colors.creamBase3,
                  }}>
                  {courseReducers?.correctMajorMinorAns}
                  <Text style={{fontFamily: fonts.FMC}}>/</Text>20
                </Text>
              ) : (
                <Text
                  style={{
                    ...globalStyles.textHome,
                    fontSize: wp(5),
                    color: colors.creamBase3,
                  }}>
                  {courseReducers?.majorMinorHighScore?.correct_answer}
                  <Text style={{fontFamily: fonts.FMC}}>/</Text>20
                </Text>
              )}
            </View>
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
          <AutoHeightImage source={images.earShare} width={wp(35)} />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isNumberAnimated}
          onPress={() => {
            Util.onHapticFeedback();
            dispatch(actions.onUpdateCourse(authReducers.userDetails));
            Props.onDoneTraining();
            confettiView.stopConfetti();
            // dispatch(actions.onAddNoOfExercise(authReducers.userDetails, courseReducers));
            dispatch(actions.onClearMajorMinorTraining(true));

            // dispatch(actions.onAddMajorMinorEarScore(authReducers.userDetails, courseReducers));

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
