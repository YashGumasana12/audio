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
  Animated,
  Keyboard,
  ActivityIndicator,
  BackHandler,
  AppState,
} from 'react-native';
//#endregion
//#region third party libs
import {isIphoneX} from 'react-native-iphone-x-helper';
import AutoHeightImage from 'react-native-auto-height-image';
import {Picker} from '@react-native-picker/picker';
import {
  WheelPicker,
  TimePicker,
  DatePicker,
} from 'react-native-wheel-picker-android';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as action from '../../redux/actions/courseActions';
import * as authAction from '../../redux/actions/authActions';
import * as setingActions from '../../redux/actions/settingsAction';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import {
  DEVICE,
  DEVICE_OS,
  hArray,
  hp,
  minArray,
  wp,
} from '../../utils/constants';
import {images} from '../../res/images';
import {colors} from '../../res/colors';
import {Spacer} from '../../res/spacer';
import {fonts} from '../../res/fonts';
import Util from '../../utils/utils';
import {image_videos_base_url} from '../../apiHelper/APIs.json';
import Lessons from './lessons';
import SpeedTraining from './speedTraining';
import Chapters from './chapters';
import KeyTraining from './keyTraining';
import EarTraining from './earTraining';
import EarTrainingSelect from './earTrainingSelect';
import EarTrainingCongrats from './earTrainingCongrats';
import EarTrainingListen from './earTrainingListen';
import MajorMinorTraining from './majorMinorTraining';
import MajorMinorCongrats from './majorMinorCongrats';
import {AppButton} from '../../components/AppButton';
import {CourseTimeview} from '../../components/CourseTimeview';
import {BlurModal} from '../../components/BlurModal';
import {AppModal} from '../../components/AppModal';
import {TrainingGraph} from '../../components/TrainingGraph';
//#endregion
//#endregion
let moveSongsAnimation = new Animated.Value(0);
let movePlaylistAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
let moveChaptersAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
let moveSpeedTrainingAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
let moveKeyTrainingAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
// let movePurchasePopupAnimation = new Animated.ValueXY({ x: 0, y: DEVICE.DEVICE_HEIGHT });
let moveEarTrainingAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
let moveEarTrainingSelectAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
let moveEarTrainingCongratsAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
let moveEarTrainingListenAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
let moveMajorMinorAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
let moveMajorMinorCongratsAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);

export default course = Props => {
  const props = Props.props;
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const courseReducers = useSelector(state => state.courseReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  //#region local state
  const [isIAPLoading, setIsIAPLoading] = useState(false);
  const [isIapSuccess, setIsIapSuccess] = useState(false);
  const [isIndicator, setIsIndicator] = useState(false);
  const [isIapTabVisible, setIsIapTabVisible] = useState(false);
  const [courseItemTappedIndex, setCourseItemTappedIndex] = useState(0);
  const [courseType, setCourseType] = useState('hearingArray');
  const [courseItemTappedType, setCourseItemTappedType] = useState();
  const [isBlurModalVisible, setIsBlurModalVisible] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isUnAvailableChapter, setIsUnAvailableChapter] = useState(false);
  const [isTimeModal, setIsTimeModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMin, setSelectedMin] = useState(
    DEVICE_OS === 'ios' ? '306' : 6,
  );
  const [isStartTimer, setIsStartTimer] = useState(false);
  const [isDiffTime, setIsDiffTime] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [isInsideChapter, setIsInsideChapter] = useState(false);
  const [isAppInBackground, setIsAppInBackground] = useState(false);
  const [isTrackedDaysAdded, setIsTrackedDaysAdded] = useState(false);
  //#endregion local state

  useEffect(() => {
    hArray.forEach((element, i) => {
      if (element === courseReducers.selectedDailyTime.split(':')[0]) {
        setSelectedHour(DEVICE_OS === 'ios' ? `${element}${i}` : i);
      }
    });
    minArray.forEach((element, i) => {
      if (element === courseReducers.selectedDailyTime.split(':')[1]) {
        setSelectedMin(DEVICE_OS === 'ios' ? `${element}${i}` : i);
      }
    });
  }, [authReducers.dailyGoals]);

  useEffect(() => {
    if (isStartTimer && isInsideChapter) {
      let timeArray = courseReducers.trackedTime?.split(':');
      let hours = timeArray[2] === undefined ? 0 : timeArray[0];
      let mins = timeArray[2] === undefined ? timeArray[0] : timeArray[1];
      let secs = timeArray[2] === undefined ? timeArray[1] : timeArray[2];
      let interval = setInterval(() => {
        if (mins >= 59) {
          mins = 0;
          hours = Number(hours) + 1;
        } else if (secs >= 59) {
          secs = 0;
          mins = Number(mins) + 1;
        } else {
          secs = Number(secs) + 1;
        }
        dispatch(
          action.onStartTimer(
            `${
              hours == 0
                ? ''
                : hours.toString().length === 1
                ? `0${hours}:`
                : `${hours}:`
            }${mins.toString().length === 1 ? `0${mins}` : mins}:${
              secs.toString().length === 1 ? `0${secs}` : secs
            }`,
            courseReducers.selectedDailyTime,
          ),
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isStartTimer, isInsideChapter]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // isInsideChapter && setIsDiffTime(true);
        setIsAppInBackground(false);
        setIsStartTimer(true);
      } else if (nextAppState === 'inactive') {
        // isInsideChapter && (
        //     setIsStartTimer(false),
        //     dispatch(action.onAppBackgroundTime()));
        setIsAppInBackground(true);
        setIsStartTimer(false);
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    // return () => subscription.remove();
  }, []);

  useEffect(() => {
    isInsideChapter &&
      isAppInBackground &&
      dispatch(
        action.onStoreTrackedTime(authReducers.userDetails, courseReducers),
      );
    !isAppInBackground &&
      !isInsideChapter &&
      !isStartTimer &&
      authReducers.userDetails !== '' &&
      dispatch(authAction.onGetDailyGoalDetails(authReducers.userDetails));
  }, [isInsideChapter, isAppInBackground]);

  useEffect(() => {
    let timeArray = courseReducers.trackedTime?.split(':');
    !isTrackedDaysAdded &&
      isInsideChapter &&
      courseReducers?.trackedTimeProgress >=
        (timeArray[2] !== undefined ? 22.7 : 15.2) &&
      dispatch(
        action.onAddTrackedDays(
          authReducers.userDetails,
          courseReducers,
          () => {
            setIsTrackedDaysAdded(true);
          },
        ),
      );
  }, [
    isInsideChapter,
    isTrackedDaysAdded,
    courseReducers.trackedTime,
    courseReducers.trackedTimeProgress,
  ]);

  useEffect(() => {
    courseReducers?.courseList[courseType] !== undefined &&
      setCourseItemTappedType(
        courseReducers?.courseList[courseType][courseItemTappedIndex],
      );
  }, [courseReducers?.courseList]);

  useEffect(() => {
    if (
      settingsReducers.isBeginClicked &&
      settingsReducers.upgradeModalFrom === 'course'
    ) {
      dispatch(setingActions.onUpgradeModal(false, ''));
      dispatch(setingActions.onBeginClicked(false));
    }
  }, [settingsReducers.isBeginClicked]);

  const onUnlockLevels = () => {
    dispatch(setingActions.onUpgradeModal(true, 'course'));
  };
  const renderCourseType = id => {
    return (
      <View style={{...globalStyles.flex}}>
        <View style={styles.listPlaceholderContainer}>
          <AutoHeightImage
            width={id === 0 ? wp(19) : wp(18.9)}
            source={id === 0 ? images.hearing : images.playing}
          />
        </View>
      </View>
    );
  };
  const onOpenChapter = (item, index) => {
    if (
      !authReducers.userDetails.pro_status &&
      item.course_type === 'playing'
    ) {
      Util.onHapticFeedback();
      onUnlockLevels();
    } else {
      setIsInsideChapter(true);
      setIsStartTimer(true);
      setCourseItemTappedIndex(index);
      setCourseType(
        item.course_type === 'hearing' ? 'hearingArray' : 'playingArray',
      );
      setCourseItemTappedType(
        courseReducers?.courseList[
          item.course_type === 'hearing' ? 'hearingArray' : 'playingArray'
        ][index],
      );
      Props.onBottomBarAnim(hp('20%'));
      // Util.slideLeftAnim(moveSongsAnimation, -DEVICE.DEVICE_WIDTH);
      Util.slideAnimation(moveSongsAnimation, -DEVICE.DEVICE_WIDTH);
      Util.slideAnimation(moveChaptersAnimation, 0);
    }
  };
  const renderListItem = array => {
    return (
      <View style={{...globalStyles.flex, overflow: 'hidden'}}>
        <View
          style={{
            ...styles.listPlaceholderContainer,
            ...styles.absoluteLineDecore,
          }}
        />
        {array?.map((item, index) => {
          return (
            // item.course_type === (id === 0 ? "hearing" : "playing") &&
            <>
              <View
                style={[
                  {...styles.listPlaceholderContainer, ...styles.lineDecore},
                  index === 0 && {height: wp(5)},
                ]}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  // if (item.isGreen) {
                  if (!authReducers.userDetails.pro_status) {
                    Util.onHapticFeedback();
                    item.isGreen
                      ? onOpenChapter(item, index)
                      : onUnlockLevels();
                  } else {
                    onOpenChapter(item, index);
                  }
                }}>
                <AutoHeightImage
                  width={wp(42)}
                  resizeMethod={'resize'}
                  source={{
                    uri: `${image_videos_base_url}${
                      authReducers.userDetails.pro_status
                        ? item.isGreen
                          ? item.feature_image
                          : item.image
                        : item.course_type === 'hearing' && index === 0
                        ? item.feature_image
                        : item.image_free
                    }`,
                  }}
                  onLoadEnd={() => setIsIndicator(true)}>
                  <View style={styles.indicatorContainer}>
                    {item.course_type !== 'hearing' &&
                      item?.total_valid_lession !== undefined &&
                      item?.total_valid_lession.map((i, index) => {
                        return (
                          <>
                            {index !== 0 && <Spacer row={wp(0.5)} />}

                            <View
                              style={[
                                styles.dotsIndicator,
                                {
                                  backgroundColor:
                                    i.is_read === '2'
                                      ? colors.white
                                      : item.isGreen
                                      ? colors.creamBase4
                                      : colors.Dark_Gray,
                                },
                              ]}
                            />
                          </>
                        );
                      })}
                  </View>
                </AutoHeightImage>
              </TouchableOpacity>
            </>
          );
        })}
      </View>
    );
  };
  return (
    <View style={globalStyles.flex}>
      <Animated.View
        style={{transform: [{translateX: moveSongsAnimation}], flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false} style={{flexGrow: 1}}>
          <View
            style={{
              ...globalStyles.paddingTop1,
              width: DEVICE.DEVICE_WIDTH,
              marginBottom: DEVICE_OS === 'ios' ? wp('25%') : wp('28%'),
            }}>
            <View
              style={{...globalStyles.row, width: wp(90), alignSelf: 'center'}}>
              <AppButton
                img={images.dark_question}
                imgStyle={{height: wp(9), width: wp(9)}}
                onBtnClicked={() => {
                  setCurrentPosition(0);
                  setIsBlurModalVisible(true);
                }}
              />
            </View>
            <Spacer space={wp(4)} />
            <View style={{...globalStyles.row, alignSelf: 'center'}}>
              <Text style={{...globalStyles.textHome, fontSize: wp(12)}}>
                Day{' '}
                <Text
                  style={{
                    color: authReducers.dailyGoals.is_dayTracked
                      ? colors.creamBase3
                      : colors.white,
                  }}>
                  {authReducers.dailyGoals.day}
                </Text>
              </Text>
              {Number(courseReducers.trackedDays) < 100 && (
                <>
                  <Text
                    style={{
                      ...globalStyles.textHome,
                      fontFamily: fonts.FBB,
                      fontSize: wp(12),
                      paddingLeft: wp(0.8),
                      marginTop: wp(0.5),
                      color: colors.blackBase6,
                    }}>
                    /
                  </Text>
                  <Text
                    style={{
                      ...globalStyles.textHome,
                      fontSize: wp(12),
                      color: colors.blackBase6,
                      paddingLeft: wp(1),
                    }}>
                    100
                  </Text>
                </>
              )}
            </View>
            <Spacer space={wp(2.5)} />
            <View style={{...globalStyles.row, alignSelf: 'center'}}>
              <Text
                style={{
                  ...globalStyles.textHome,
                  fontFamily: fonts.FM,
                  color: colors.creamBase5,
                }}>
                Daily goal
              </Text>
              <Spacer row={wp(1)} />
              <TouchableOpacity onPress={() => setIsTimeModal(true)}>
                <CourseTimeview
                  time={courseReducers.selectedDailyTime}
                  isGreen={true}
                />
              </TouchableOpacity>
            </View>
            <Spacer space={wp(6)} />

            <View
              style={{...globalStyles.row, width: wp(95), alignSelf: 'center'}}>
              {renderCourseType(0)}
              {renderCourseType(1)}
            </View>
            <Spacer space={-wp(4)} />
            <View
              style={{
                ...globalStyles.row,
                width: wp(90),
                alignSelf: 'center',
                alignItems: 'flex-start',
              }}>
              {courseReducers?.courseList?.hearingArray?.length !== 0 &&
                renderListItem(courseReducers?.courseList?.hearingArray)}
              <Spacer row={wp(2.5)} />
              {courseReducers?.courseList?.playingArray?.length !== 0 &&
                renderListItem(courseReducers?.courseList?.playingArray)}
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      <Animated.View
        style={{
          transform: [{translateX: moveChaptersAnimation}],
          position: 'absolute',
        }}>
        <Chapters
          props={props}
          chapterIcon={
            image_videos_base_url + courseItemTappedType?.course_icon
          }
          chaptersData={courseItemTappedType}
          onBack={type => {
            setIsStartTimer(false);
            Props.onBottomBarAnim(0);
            // Util.slideUpAnim(movePurchasePopupAnimation, DEVICE.DEVICE_HEIGHT, 500);
            setIsIapTabVisible(false);
            // Util.slideLeftAnim(moveSongsAnimation, 0);
            Util.slideAnimation(moveSongsAnimation, 0);
            Util.slideAnimation(moveChaptersAnimation, DEVICE.DEVICE_WIDTH);
            setTimeout(() => {
              dispatch(action.onCourseItemClear());
            }, 300);
            dispatch(
              action.onStoreTrackedTime(
                authReducers.userDetails,
                courseReducers,
                true,
                () => {
                  setIsInsideChapter(false);
                },
              ),
            );
            // dispatch(action.onAppBackgroundTime(true));
          }}
          onChapterClicked={(index, callBack) => {
            if (
              authReducers.userDetails.pro_status ||
              courseItemTappedType.name === 'The basics' ||
              courseItemTappedType.name === 'Hearing' ||
              courseItemTappedType?.lession[index].free_for_all === '1'
            ) {
              dispatch(
                action.onCourseItemClicked(
                  courseItemTappedType,
                  courseItemTappedType?.lession[index],
                  props,
                  authReducers.userDetails,
                ),
              ).then(() => {
                setTimeout(() => {
                  Props.onBottomBarAnim(hp('20%'));
                  Util.slideAnimation(
                    moveChaptersAnimation,
                    -DEVICE.DEVICE_WIDTH,
                  );

                  if (
                    courseItemTappedType?.lession[index].ear_training === '1'
                  ) {
                    Util.slideAnimation(moveEarTrainingAnimation, 0);
                    dispatch(
                      action.onGetEarTraining(
                        authReducers.userDetails,
                        courseItemTappedType?.lession[index]?.chapter === null
                          ? courseItemTappedType?.lession[index].id
                          : courseItemTappedType?.lession[index]?.chapter[0]
                              ?.id,
                      ),
                    );
                  } else Util.slideAnimation(movePlaylistAnimation, 0);
                  callBack();
                  // if (isIapTabVisible) {
                  //     Util.slideUpAnim(movePurchasePopupAnimation, DEVICE.DEVICE_HEIGHT, 500);
                  // }
                }, 100);
              });
            } else {
              Util.onHapticFeedback();
              onUnlockLevels();
            }
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          transform: [{translateX: movePlaylistAnimation}],
          position: 'absolute',
        }}>
        <Lessons
          props={props}
          isIapSuccess={isIapSuccess}
          isIAPLoading={isIAPLoading}
          onBack={type => {
            Util.slideAnimation(moveChaptersAnimation, 0);
            Util.slideAnimation(movePlaylistAnimation, DEVICE.DEVICE_WIDTH);
            setTimeout(() => {
              dispatch(action.onCourseItemClear());
            }, 300);
            if (type !== undefined) {
              Props.onBottomBarAnim(0);
              Props.onSongsClicked();
              setTimeout(() => {
                // moveSongsAnimation = new Animated.ValueXY({ x: 0, y: 0 });
                moveSongsAnimation = new Animated.Value(0);
                moveChaptersAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
                movePlaylistAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
                moveSpeedTrainingAnimation = new Animated.Value(
                  DEVICE.DEVICE_WIDTH,
                );
              }, 300);
            }
          }}
          onUnlockMembership={() => {
            onUnlockLevels();
          }}
          onPatternClicked={() => {
            Util.slideAnimation(movePlaylistAnimation, -DEVICE.DEVICE_WIDTH);
            Util.slideAnimation(moveSpeedTrainingAnimation, 0);
          }}
          onStartKeyTrianing={() => {
            Util.slideAnimation(movePlaylistAnimation, -DEVICE.DEVICE_WIDTH);
            Util.slideAnimation(moveKeyTrainingAnimation, 0);
          }}
          onStartMajorMinorTraining={() => {
            Util.onHapticFeedback();
            dispatch(
              action.onStartMajorMinorTraining(
                courseReducers.selectedCourseItem,
              ),
            );
            Util.slideAnimation(movePlaylistAnimation, -DEVICE.DEVICE_WIDTH);
            Util.slideAnimation(moveMajorMinorAnimation, 0);
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          transform: [{translateX: moveSpeedTrainingAnimation}],
          position: 'absolute',
        }}>
        <SpeedTraining
          props={props}
          onBack={() => {
            Util.slideAnimation(movePlaylistAnimation, 0);
            Util.slideAnimation(
              moveSpeedTrainingAnimation,
              DEVICE.DEVICE_WIDTH,
            );
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          transform: [{translateX: moveKeyTrainingAnimation}],
          position: 'absolute',
        }}>
        <KeyTraining
          props={props}
          onBack={() => {
            Util.slideAnimation(movePlaylistAnimation, 0);
            Util.slideAnimation(moveKeyTrainingAnimation, DEVICE.DEVICE_WIDTH);
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          transform: [{translateX: moveEarTrainingAnimation}],
          position: 'absolute',
        }}>
        <EarTraining
          props={props}
          onBack={() => {
            // Util.slideUpAnim(movePurchasePopupAnimation, DEVICE.DEVICE_HEIGHT, 500);
            setIsIapTabVisible(false);
            Util.slideAnimation(moveChaptersAnimation, 0);
            Util.slideAnimation(moveEarTrainingAnimation, DEVICE.DEVICE_WIDTH);
            setTimeout(() => {
              dispatch(action.onCourseItemClear());
            }, 300);
          }}
          onEarTrainingItemClicked={() => {
            Util.slideAnimation(moveEarTrainingAnimation, -DEVICE.DEVICE_WIDTH);
            Util.slideAnimation(moveEarTrainingSelectAnimation, 0);
          }}
          onUnlockLevels={() => {
            Util.onHapticFeedback();
            onUnlockLevels();
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          transform: [{translateX: moveEarTrainingSelectAnimation}],
          position: 'absolute',
        }}>
        <EarTrainingSelect
          props={props}
          onBack={() => {
            Util.slideAnimation(moveEarTrainingAnimation, 0);
            Util.slideAnimation(
              moveEarTrainingSelectAnimation,
              DEVICE.DEVICE_WIDTH,
            );
          }}
          onStartEarTraining={() => {
            Util.slideAnimation(moveEarTrainingListenAnimation, 0);
            Util.slideAnimation(
              moveEarTrainingSelectAnimation,
              -DEVICE.DEVICE_WIDTH,
            );
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          transform: [{translateX: moveEarTrainingListenAnimation}],
          position: 'absolute',
        }}>
        <EarTrainingListen
          props={props}
          onBack={() => {
            Util.slideAnimation(moveEarTrainingSelectAnimation, 0);
            Util.slideAnimation(
              moveEarTrainingListenAnimation,
              DEVICE.DEVICE_WIDTH,
            );
          }}
          onCongrats={async () => {
            dispatch(
              action.onEarCongratsDetails(courseReducers, () => {
                Util.slideAnimation(moveEarTrainingCongratsAnimation, 0);
                Util.slideAnimation(
                  moveEarTrainingListenAnimation,
                  -DEVICE.DEVICE_WIDTH,
                );
              }),
            );
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          transform: [{translateX: moveEarTrainingCongratsAnimation}],
          position: 'absolute',
        }}>
        <EarTrainingCongrats
          props={props}
          onBack={() => {
            Util.slideAnimation(moveEarTrainingListenAnimation, 0);
            Util.slideAnimation(
              moveEarTrainingCongratsAnimation,
              DEVICE.DEVICE_WIDTH,
            );
          }}
          onDoneTraining={() => {
            Util.slideAnimation(moveEarTrainingAnimation, 0);
            Util.slideAnimation(
              moveEarTrainingCongratsAnimation,
              DEVICE.DEVICE_WIDTH,
            );

            moveEarTrainingSelectAnimation = new Animated.Value(
              DEVICE.DEVICE_WIDTH,
            );
            moveEarTrainingListenAnimation = new Animated.Value(
              DEVICE.DEVICE_WIDTH,
            );
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          transform: [{translateX: moveMajorMinorAnimation}],
          position: 'absolute',
        }}>
        <MajorMinorTraining
          props={props}
          onBack={() => {
            Util.slideAnimation(movePlaylistAnimation, 0);
            Util.slideAnimation(moveMajorMinorAnimation, DEVICE.DEVICE_WIDTH);
          }}
          onCongrats={async () => {
            dispatch(
              action.onMajorMinorCongratsDetails(courseReducers, () => {
                Util.slideAnimation(moveMajorMinorCongratsAnimation, 0);
                Util.slideAnimation(
                  moveMajorMinorAnimation,
                  -DEVICE.DEVICE_WIDTH,
                );

                moveMajorMinorAnimation = new Animated.Value(
                  DEVICE.DEVICE_WIDTH,
                );
              }),
            );
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          transform: [{translateX: moveMajorMinorCongratsAnimation}],
          position: 'absolute',
        }}>
        <MajorMinorCongrats
          props={props}
          onDoneTraining={() => {
            Util.slideAnimation(movePlaylistAnimation, 0);
            Util.slideAnimation(
              moveMajorMinorCongratsAnimation,
              DEVICE.DEVICE_WIDTH,
            );
          }}
        />
      </Animated.View>

      <BlurModal
        isBlurModalVisible={isBlurModalVisible}
        currentPosition={currentPosition}
        isUnAvailableChapter={isUnAvailableChapter}
        setCurrentPosition={number => setCurrentPosition(number)}
        onRequestClose={() => setIsBlurModalVisible(false)}
      />
      <AppModal isChildren isVisible={isTimeModal}>
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
          <Spacer space={wp(15)} />
          <Text
            style={{
              ...globalStyles.textHome,
              fontFamily: fonts.FM,
              fontSize: wp(4),
              color: colors.white,
            }}>
            Select your ideal daily practice goal
          </Text>
          <View style={{...globalStyles.row}}>
            {DEVICE_OS === 'ios' ? (
              <>
                <Picker
                  style={{...styles.pickerContainer}}
                  itemStyle={{
                    ...globalStyles.textHome,
                    ...styles.hTxt,
                    width: wp(24),
                  }}
                  selectedValue={selectedHour}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedHour(itemValue);
                  }}>
                  {hArray.map((item, i) => (
                    <Picker.Item label={item} value={`${item}${i}`} />
                  ))}
                </Picker>
                <Text style={{...globalStyles.textHome, ...styles.minTxt}}>
                  h
                </Text>
                <Picker
                  style={{...styles.pickerContainer, width: wp(18)}}
                  itemStyle={{
                    ...globalStyles.textHome,
                    ...styles.hTxt,
                    width: wp(31),
                  }}
                  selectedValue={selectedMin}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedMin(itemValue);
                  }}>
                  {minArray.map((item, i) => (
                    <Picker.Item label={item} value={`${item}${i}`} />
                  ))}
                </Picker>
                <Text
                  style={{
                    ...globalStyles.textHome,
                    ...styles.minTxt,
                    left: -wp(0.6),
                  }}>
                  min
                </Text>
              </>
            ) : (
              <View
                style={{
                  ...styles.pickerContainer,
                  ...styles.androidPickerContainer,
                }}>
                <Spacer space={wp(8)} />
                <WheelPicker
                  style={styles.androidPicker}
                  hideIndicator={true}
                  itemTextFontFamily={fonts.QE}
                  selectedItemTextFontFamily={fonts.QE}
                  itemTextSize={wp(12)}
                  selectedItemTextSize={wp(12)}
                  itemTextColor="grey"
                  selectedItemTextColor="white"
                  selectedItem={selectedHour}
                  data={hArray}
                  onItemSelected={value => {
                    setSelectedHour(value);
                  }}
                />
                <Text
                  style={{...globalStyles.textHome, ...styles.androidMinTxt}}>
                  h
                </Text>
                <WheelPicker
                  style={styles.androidPicker}
                  hideIndicator={true}
                  itemTextFontFamily={fonts.QE}
                  selectedItemTextFontFamily={fonts.QE}
                  itemTextSize={wp(12)}
                  selectedItemTextSize={wp(12)}
                  itemTextColor="grey"
                  selectedItemTextColor="white"
                  initPosition={6}
                  selectedItem={selectedMin}
                  data={minArray}
                  onItemSelected={value => {
                    setSelectedMin(value);
                  }}
                />
                <Text
                  style={{
                    ...globalStyles.textHome,
                    ...styles.androidMinTxt,
                    left: wp(0.6),
                  }}>
                  min
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={{...styles.backBtn, backgroundColor: colors.creamBase3}}
            onPress={() => {
              // dispatch(action.onSelectDailyTime(DEVICE_OS === 'ios' ? (selectedHour === 0 ? '0' : selectedHour.substring(0, selectedHour.length - 1)) : hArray[selectedHour], DEVICE_OS === 'ios' ? (selectedMin === 0 ? '0' : selectedMin.substring(0, selectedMin.length === 4 ? (selectedMin.length - 2) : (selectedMin.length - 1))) : minArray[selectedMin]));
              dispatch(
                action.onSelectDailyTime(
                  selectedHour,
                  selectedMin,
                  hArray,
                  minArray,
                  courseReducers,
                  authReducers.userDetails,
                ),
              );
              setIsTimeModal(false);
            }}>
            <Text
              style={{
                ...globalStyles.textHome,
                color: colors.white,
                fontSize: wp(5),
              }}>
              Done
            </Text>
            <Image
              source={images.rightArrow}
              style={{
                ...globalStyles.img,
                tintColor: colors.white,
                height: wp(5.5),
                width: wp(5.5),
                position: 'absolute',
                right: wp(4),
              }}
            />
          </TouchableOpacity>
        </View>
      </AppModal>

      <View style={{...globalStyles.paddingTop1, ...styles.goalTimeContainer}}>
        <CourseTimeview time={courseReducers.trackedTime} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  indicatorContainer: {
    position: 'absolute',
    bottom: wp(6),
    left: wp(4.5),
    zIndex: 50,
    flexDirection: 'row',
  },
  listPlaceholderContainer: {
    backgroundColor: colors.creamBase2,
    padding: wp(7),
    borderRadius: wp(8),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: wp(35),
    alignItems: 'center',
  },
  lineDecore: {
    borderRadius: 0,
    padding: 0,
    height: wp(4),
  },
  absoluteLineDecore: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    padding: wp(2.2),
    top: 0,
    borderRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    // backgroundColor: 'red'
  },
  dotsIndicator: {
    padding: wp(1),
    borderRadius: 50,
  },
  hTxt: {
    fontSize: wp(13),
    height: wp(100),
  },
  backBtn: {
    backgroundColor: colors.blackBase8,
    padding: wp(3),
    borderRadius: wp(3),
    alignItems: 'center',
    width: wp(58),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pickerContainer: {
    width: wp(15),
    alignItems: 'center',
  },
  minTxt: {
    left: -wp(3),
    top: wp(3),
    fontSize: wp(4.5),
  },
  androidPickerContainer: {
    height: wp(100),
    width: wp(70),
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  androidPicker: {
    height: wp(70),
    width: wp(15),
  },
  androidMinTxt: {
    left: -wp(2.5),
    top: -wp(3),
    fontSize: wp(4.5),
  },
  goalTimeContainer: {
    position: 'absolute',
    right: wp(5),
  },
});
