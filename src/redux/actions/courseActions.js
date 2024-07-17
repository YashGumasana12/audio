//#region import
//#region third party libs
import Toast from 'react-native-simple-toast';
import moment from 'moment';
//#endregion
//#region common files
import * as types from '../actionTypes/courseActionTypes';
import {contact_us} from '../../apiHelper/APIs.json';
import {getData, saveData} from '../../utils/asyncStorageHelper';
import {POST} from '../../apiHelper/apiService';
import * as authActions from '../actions/authActions';
import {
  course,
  favorites_speed_training_list,
  favorites_speed_training_add_remove,
  bpm_add_update,
  indicator,
  chapter_bpm_add_update,
  chapter_indicator,
  lession_question_email,
  chapter_ear_training,
  get_single_ear_training,
  ear_score_add,
  get_ear_score,
  ear_exercise_add_update,
  get_ear_exercise,
  get_single_recognizing_training,
  get_recognize_score,
  recognize_score_add,
  daily_goal_store,
  daily_goal_timer_store,
  update_current_day,
  ear_score_graph,
} from '../../apiHelper/APIs.json';
import {DEVICE_OS} from '../../utils/constants';
import Util from '../../utils/utils';
//#endregion
//#endregion
global.correctAns = 0;
global.correctMajorMinorAns = 0;
export const onCourseItemClicked =
  (data, item, props, userDetails) => dispatch => {
    // return async dispatch => {
    item.levelName = data.name;
    if (item.unlimited_key_training === '1') {
      let minorKeys = [];
      let majorKeys = [];
      item.chapter_detail.forEach(element => {
        if (element.image_type === 'major') {
          majorKeys.push(element);
        } else {
          minorKeys.push(element);
        }
      });
      item.minorKeys = minorKeys;
      item.majorKeys = majorKeys;
    }
    dispatch({type: types.ON_COURSE_ITEM_CLICKED, payload: item});
    updateIndicator(userDetails, item.course_id, item.id, 1, dispatch);

    if (item.speed_training === '1') {
      getFavoritesPattern(userDetails, item.id, dispatch);
    }
    if (data.name === 'Hearing') {
      onGetNoOfExercise(userDetails, item.id, dispatch);
    }
    if (item.recognizing === '1') {
      onGetMajorMinorExercise(
        userDetails,
        item.chapter[Number(item.chapter_index)].id,
        dispatch,
      );
    }
    return Promise.resolve();
    // }
  };
const getFavoritesPattern = async (userDetails, id, dispatch) => {
  var requestBody = {
    user_id: userDetails.id,
    lession_id: id,
  };
  await POST(favorites_speed_training_list, requestBody, function (response) {
    if (response.status !== '1') {
      dispatch({
        type: types.FAVORITES_PATTERNS,
        payload: response.responseData.data,
      });
    }
  });
};
export const onUpdateIndicator = (userDetails, selectedCourseItem) => {
  return dispatch => {
    updateIndicator(
      userDetails,
      selectedCourseItem.course_id,
      selectedCourseItem.id,
      2,
      dispatch,
    );
  };
};
const updateIndicator = async (
  userDetails,
  course_id,
  lession_id,
  status,
  dispatch,
) => {
  var requestBody = {
    user_id: userDetails.id,
    course_id: course_id,
    lession_id: lession_id,
    status: status,
  };
  await POST(indicator, requestBody, async function (response) {
    if (response.status !== '1') {
      onGetCourse(userDetails, dispatch);
    }
  });
};

export const onCourseItemClear = () => {
  return async dispatch => {
    dispatch({type: types.ON_COURSE_ITEM_CLICKED, payload: ''});
  };
};
export const onPatternItemClicked = (item, flag) => {
  return async dispatch => {
    dispatch({type: types.ON_PATTERN_ITEM_CLICKED, payload: item, flag});
  };
};
export const onAddRemovePattern = (userDetails, selectedPatternItem) => {
  return async dispatch => {
    var requestBody = {
      is_favorite: selectedPatternItem.is_favorites === '1' ? 0 : 1,
      user_id: userDetails.id,
      lession_id: selectedPatternItem.lession_id,
      patterns_id: selectedPatternItem.id,
    };
    await POST(
      favorites_speed_training_add_remove,
      requestBody,
      function (response) {
        if (response.status == '1') {
          Toast.show(response.responseData.message);
        } else {
          selectedPatternItem.is_favorites =
            selectedPatternItem.is_favorites === '1' ? '0' : '1';
          getFavoritesPattern(
            userDetails,
            selectedPatternItem.lession_id,
            dispatch,
          );
        }
      },
    );
  };
};
export const onUpdateBpm = (
  userDetails,
  courseReducers,
  selectedPatternItem,
  bpm,
) => {
  return async dispatch => {
    var requestBody = {
      user_id: userDetails.id,
      lession_id: selectedPatternItem.lession_id,
      patterns_id: selectedPatternItem.id,
      bpm: bpm,
    };
    await POST(bpm_add_update, requestBody, function (response) {
      if (response.status == '1') {
        Toast.show(response.responseData.message);
      } else {
        var favBreakException = {};
        try {
          courseReducers.favoritesPatterns.forEach(element => {
            if (selectedPatternItem.id === element.id) {
              element.bpm_detail = bpm;
              throw favBreakException;
            }
          });
        } catch (e) {
          if (e !== favBreakException) throw e;
        }

        var expBreakException = {};
        try {
          courseReducers.selectedCourseItem.patterns.forEach(element => {
            if (selectedPatternItem.id === element.id) {
              element.bpm_detail = bpm;
              throw expBreakException;
            }
          });
        } catch (e) {
          if (e !== expBreakException) throw e;
        }
        onGetCourse(userDetails, dispatch);
      }
    });
  };
};
export const onChapterUpdateBpm = (
  userDetails,
  courseReducers,
  currentSlider,
  bpm,
) => {
  return async dispatch => {
    var requestBody = {
      user_id: userDetails.id,
      chapter_id: courseReducers.selectedCourseItem?.chapter[currentSlider]?.id,
      bpm: bpm,
    };
    await POST(chapter_bpm_add_update, requestBody, async function (response) {
      if (response.status == '1') {
        Toast.show(response.responseData.message);
      } else {
        onGetCourse(userDetails, dispatch);
      }
    });
  };
};
const onGetCourse = async (userDetails, dispatch) => {
  await POST(course, {user_id: userDetails.id}, function (response) {
    if (response.status !== '1') {
      // response.responseData.data.splice(1, 0, { name: 'Screen Title' });
      let hearingArray = [];
      let playingArray = [];
      response?.responseData?.data.forEach(element => {
        element.course_type === 'hearing'
          ? hearingArray.push(element)
          : playingArray.push(element);
      });

      //#region hearing courses
      var hearingArrayException = {};
      try {
        hearingArray.length !== 0 &&
          hearingArray.forEach((ele, index) => {
            // if (!userDetails.pro_status) {
            index === 0 && (ele.isGreen = true);
            // } else {
            if (
              ele.total_valid_lession_complete !==
              ele.total_valid_lession.length
            ) {
              throw hearingArrayException;
            } else {
              try {
                ele.total_valid_lession_complete ===
                  ele.total_valid_lession.length &&
                  (hearingArray[index + 1].isGreen = true);
              } catch (error) {}
            }
            // }
          });
      } catch (e) {
        if (e !== hearingArrayException) throw e;
      }

      //#endregion hearing courses

      //#region playing courses
      var playingArrayException = {};
      try {
        playingArray.length !== 0 &&
          playingArray.forEach((ele, index) => {
            // if (!userDetails.pro_status) {
            index === 0 && (ele.isGreen = true);
            // } else {
            if (
              ele.total_valid_lession_complete !==
              ele.total_valid_lession.length
            ) {
              throw playingArrayException;
            } else {
              try {
                ele.total_valid_lession_complete ===
                  ele.total_valid_lession.length &&
                  (playingArray[index + 1].isGreen = true);
              } catch (error) {}
            }
            // }
          });
      } catch (e) {
        if (e !== playingArrayException) throw e;
      }
      //#endregion playing courses
      response.responseData.courseList = {hearingArray, playingArray};
      dispatch({
        type: types.COURSES,
        payload: response.responseData.courseList,
        courseScreenDetails: response.responseData.course_details,
        freeUser: response.responseData.total_free_user,
      });
    }
  });
};
export const onUpdateChapterIndicator = (
  userDetails,
  selectedCourseItem,
  currentSlider,
) => {
  return async dispatch => {
    var requestBody = {
      user_id: userDetails.id,
      course_id: selectedCourseItem.course_id,
      lession_id: selectedCourseItem.id,
      chapter_index: currentSlider,
    };
    await POST(chapter_indicator, requestBody, function (response) {
      onGetCourse(userDetails, dispatch);
    });
  };
};
export const onTrainingItemClicked = (trainingTypes, index, trainingData) => {
  return dispatch => {
    trainingTypes.forEach((element, i) => {
      index === i ? (element.isSelected = true) : (element.isSelected = false);
    });
    index === 0 &&
      (Util.keyTrainingLetters(trainingData.training.majorOnly, false),
      Util.keyTrainingLetters(trainingData.training.minorOnly, false),
      Util.keyTrainingLetters(trainingData.training.tabs, false));
    dispatch({
      type: types.ON_UPDATE_TRAINING_TYPE,
      payload: trainingTypes,
      index,
    });

    onStartKeyTrianing(trainingData, dispatch);
  };
};
export const onTrainingTabsClicked = (
  trainingData,
  index,
  isLetters,
  tabsType,
) => {
  return dispatch => {
    if (!isLetters) {
      Util.keyTrainingLetters(trainingData.training.tabs, true, index);
      switch (index) {
        case 0:
          Util.keyTrainingLetters(
            trainingData.training.majorOnly,
            trainingData.training.tabs[index].isSelected ? true : false,
          );
          Util.keyTrainingLetters(
            trainingData.training.minorOnly,
            trainingData.training.tabs[index].isSelected ? true : false,
          );
          break;
        case 1:
          Util.keyTrainingLetters(
            trainingData.training.majorOnly,
            trainingData.training.tabs[index].isSelected ? true : false,
          );
          Util.keyTrainingLetters(trainingData.training.minorOnly, false);
          break;
        case 2:
          Util.keyTrainingLetters(trainingData.training.majorOnly, false);
          Util.keyTrainingLetters(
            trainingData.training.minorOnly,
            trainingData.training.tabs[index].isSelected ? true : false,
          );
          break;
        default:
          break;
      }
    } else {
      switch (tabsType) {
        case 0:
          Util.keyTrainingLetters(trainingData.training.tabs, false);
          Util.keyTrainingLetters(
            trainingData.training.majorOnly,
            true,
            index,
            true,
          );
          break;
        case 1:
          Util.keyTrainingLetters(trainingData.training.tabs, false);
          Util.keyTrainingLetters(
            trainingData.training.minorOnly,
            true,
            index,
            true,
          );
          break;
        default:
          break;
      }
    }
    dispatch({type: types.ON_UPDATE_TRAINING_TABS, payload: trainingData});
    onStartKeyTrianing(trainingData, dispatch);
  };
};
const onStartKeyTrianing = (trainingData, dispatch) => {
  let mergeArray = [];
  trainingData.training.majorOnly.forEach(element => {
    element.isSelected && mergeArray.push(element);
  });
  trainingData.training.minorOnly.forEach(element => {
    element.isSelected && mergeArray.push(element);
  });
  dispatch({type: types.SELECTED_LETTERS, payload: mergeArray});
};
export const startKeyTrianing = (trainingData, Props) => {
  return dispatch => {
    onStartKeyTrianing(trainingData, dispatch);
    setTimeout(() => {
      Props.onStartKeyTrianing();
    }, 600);
  };
};
export const onAskedQue = (userDetails, data, questionInput, callBack) => {
  return async dispatch => {
    var requestBody = {
      user_id: userDetails.id,
      lession_id: data.id,
      question: questionInput,
    };
    await POST(lession_question_email, requestBody, function (response) {
      if (response.status == '1') {
        Toast.show(response.responseData.message);
      } else {
        dispatch(authActions.getChat(userDetails, dispatch));
        callBack();
      }
    });
  };
};
export const onEarTrainingLevelClicked = (item, Props) => {
  return dispatch => {
    dispatch({type: types.ON_EAR_LEVEL, payload: item});
    Props.onEarTrainingItemClicked();
  };
};

export const onEarTrainingItemClicked = (earTrainingTypes, index) => {
  return dispatch => {
    earTrainingTypes.forEach((element, i) => {
      index === i ? (element.isSelected = true) : (element.isSelected = false);
    });

    dispatch({
      type: types.ON_UPDATE_EAR_TRAINING_TYPE,
      payload: earTrainingTypes,
    });
  };
};
export const onEarTrainingTabsClicked = (playingSpeed, index) => {
  return dispatch => {
    playingSpeed.forEach((element, i) => {
      index === i ? (element.isSelected = true) : (element.isSelected = false);
    });

    dispatch({type: types.ON_UPDATE_EAR_TRAINING_TABS, payload: playingSpeed});
  };
};
export const onEarTrainingStart = (
  courseReducers,
  selectedEarLevel,
  lettersArray,
  earTrainingTypes,
  playingSpeed,
) => {
  return dispatch => {
    // saveData("earTraining_startTime", new Date().toLocaleString());
    saveData('earTraining_startTime', Date.now());
    let earTrainingType;
    earTrainingTypes.forEach(element => {
      courseReducers.selectedCourseItem.ear_training_type === element.name &&
        (earTrainingType = element);
    });
    let soundSpeed;
    playingSpeed.forEach(element => {
      element.isSelected && (soundSpeed = element);
    });

    let level1Numbers = Util.keyShuffleArray([1, 2, 3, 4]);
    let level2Numbers = Util.keyShuffleArray([5, 6, 7, `1+`]);
    let level3Numbers = Util.keyShuffleArray([1, 2, 3, 4, 5, 6, 7, `1+`]);
    let level4Numbers = Util.keyShuffleArray([
      `5-`,
      `6-`,
      `7-`,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      `1+`,
      `2+`,
      `3+`,
      `4+`,
    ]);
    let level5Numbers = Util.keyShuffleArray([
      `5.5-`,
      `6.5-`,
      `5-`,
      `6-`,
      `7-`,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      1.5,
      2.5,
      4.5,
      5.5,
      6.5,
      `1+`,
      `2+`,
      `3+`,
      `4+`,
      `1.5+`,
      `2.5+`,
    ]);
    let numbersArray;

    if (selectedEarLevel.id === 0 || selectedEarLevel.id === 5) {
      numbersArray = level1Numbers;
    } else if (selectedEarLevel.id === 1 || selectedEarLevel.id === 6) {
      numbersArray = level2Numbers;
    } else if (selectedEarLevel.id === 2 || selectedEarLevel.id === 7) {
      numbersArray = level3Numbers;
    } else if (selectedEarLevel.id === 3 || selectedEarLevel.id === 8) {
      numbersArray = level4Numbers;
    } else if (selectedEarLevel.id === 4 || selectedEarLevel.id === 9) {
      numbersArray = level5Numbers;
    }

    let selectedEarTraining = {
      selectedEarLevel,
      lettersArray: selectedEarLevel.is_major
        ? lettersArray.majorOnly
        : lettersArray.minorOnly,
      earTrainingType,
      soundSpeed,
      numbersArray,
    };
    dispatch({type: types.ON_EAR_TRAINING_START, payload: selectedEarTraining});
  };
};
export const onClearEarTrainingStart = () => {
  return dispatch => {
    dispatch({type: types.ON_EAR_TRAINING_START, payload: {}});
  };
};
export const onEarTrainingCongrats = (flag, Props) => {
  return dispatch => {
    dispatch({type: types.ON_EAR_TRAINING_CONGRATS, payload: flag});
    flag && Props.onCongrats();
  };
};

export const onGetEarTraining = (userDetails, chapter_id) => {
  return async dispatch => {
    getEarTraining(userDetails, chapter_id, dispatch);
  };
};
const getEarTraining = async (userDetails, chapter_id, dispatch) => {
  var requestBody = {
    user_id: userDetails.id,
    chapter_id: chapter_id,
  };
  await POST(get_ear_score, requestBody, function (response) {
    if (response.status == '1') {
      Toast.show(response.responseData.message);
    } else {
      dispatch({
        type: types.ON_EAR_TRAINING_DATA,
        payload: response.responseData.data[0],
      });
    }
  });

  // await POST(chapter_ear_training, {
  //     "lession_id": selectedChapterItem.id
  // }, function (response) {
  //     if (response.status == '1') {
  //         Toast.show(response.responseData.message);
  //     } else {
  //         dispatch({ type: types.ON_EAR_TRAINING_DATA, payload: response.responseData.data });
  //     }
  // })
};

export const onGetLetter = (letter, courseReducers, callBack) => {
  return async dispatch => {
    var requestBody = {
      lession_id: courseReducers.selectedCourseItem.id,
      letter_name: letter,
      // "letter_name": 'Qq'
    };
    await POST(get_single_ear_training, requestBody, function (response) {
      if (response.status == '1') {
        Toast.show(response.responseData.message);
      } else {
        let soundSpeed =
          courseReducers.selectedEarTraining.earTrainingType.name +
          '_' +
          courseReducers.selectedEarTraining.soundSpeed.title;
        let soundType;
        var speedException = {};
        try {
          response.responseData.data.speed.forEach(element => {
            if (soundSpeed === element.key_name) {
              soundType = element;
              throw speedException;
            }
          });
        } catch (e) {
          if (e !== speedException) throw e;
        }

        let notesSound = [];
        courseReducers.selectedEarTraining.numbersArray.forEach(
          (element, index) => {
            response.responseData.data.notes.forEach((ele, i) => {
              if (element.toString() === ele.key_name) {
                notesSound.push(ele);
              }
            });
          },
        );
        let randomNotes = Util.keyShuffleArray(notesSound);
        let sounds = {
          soundType,
          randomNotes,
        };
        dispatch({type: types.ON_EAR_LETTER_SOUND, payload: sounds});
        callBack(sounds);
      }
    });
  };
};

export const onClearLetterData = () => {
  return dispatch => {
    dispatch({type: types.ON_EAR_LETTER_SOUND, payload: {}});
  };
};
export const onCurrentNotePlayed = item => {
  return dispatch => {
    dispatch({type: types.ON_CURRENT_NOTE_PLAYED, payload: item});
  };
};

export const onSVGNumberClicked = (value, courseReducers) => {
  return dispatch => {
    dispatch({type: types.IS_NOTE_CLICKED, payload: true});
    let isCorrect =
      value.toString() ===
      (courseReducers.currentNoteSound.key_name.includes('-')
        ? courseReducers.currentNoteSound.key_name.replace(/\-/g, '')
        : courseReducers.currentNoteSound.key_name.includes('+')
        ? courseReducers.currentNoteSound.key_name.replace(/\+/g, '')
        : courseReducers.currentNoteSound.key_name);
    dispatch({
      type: types.IS_CORRECT_NOTE,
      payload: isCorrect ? true : false,
      value,
    });
    dispatch({
      type: types.IS_NOTE_HIGHLIGHT,
      value,
      flag: isCorrect && global.isFirstAttempt ? true : false,
    });

    setTimeout(() => {
      dispatch({type: types.IS_NOTE_HIGHLIGHT, value: 0, flag: false});
    }, 800);
  };
};

export const onIsCorrectNote = flag => {
  return dispatch => {
    dispatch({type: types.IS_CORRECT_NOTE, payload: flag, value: 0});
    dispatch({type: types.IS_NOTE_HIGHLIGHT, value: 0});
    dispatch({type: types.IS_NOTE_CLICKED, payload: false});
  };
};

export const onSetCorrectAns = counter => {
  return dispatch => {
    dispatch({type: types.CORRECT_ANS, payload: counter});
    global.correctAns = counter;
    counter === 0 && dispatch({type: types.ON_EAR_AVG_REACT_TIME, payload: []});
  };
};
export const onCorrectNoteHighlight = flag => {
  return dispatch => {
    dispatch({type: types.IS_CORRECT_HIGHLIGHT, flag});

    // flag && setTimeout(() => {
    //     dispatch({ type: types.IS_CORRECT_HIGHLIGHT, flag: false });
    // }, 800);
  };
};

export const onCountAvgReactTimes = (earAvgReactTimes, startTime, endTime) => {
  return dispatch => {
    // let exeStartTime = moment(startTime, "YYYY-MM-DD HH:mm:ss");
    // let exeEndTime = moment(endTime, "YYYY-MM-DD HH:mm:ss");
    // var time = moment.utc(moment(exeEndTime, "HH:mm:ss").diff(moment(exeStartTime, "HH:mm:ss"))).format("HH:mm:ss");
    var timeDiff = endTime - startTime;
    // let time = Util.msToHms(timeDiff);
    // const arr = time.split(":");
    // const seconds = arr[0] * 3600 + arr[1] * 60 + (+arr[2]);
    earAvgReactTimes.push(timeDiff);
    dispatch({type: types.ON_EAR_AVG_REACT_TIME, payload: earAvgReactTimes});
    dispatch({type: types.IS_EAR_AVG_REACT_TIME, payload: true});

    setTimeout(() => {
      dispatch({type: types.IS_EAR_AVG_REACT_TIME, payload: false});
    }, 900);
  };
};

export const onEarCongratsDetails = (courseReducers, callBack) => {
  return dispatch => {
    let startTime;
    getData('earTraining_startTime', success => {
      startTime = success;
    });
    setTimeout(() => {
      let endTime = Date.now();
      var timeDiff = endTime - startTime;
      let time = Util.msToHms(timeDiff);
      const arr = time.split(':');
      const seconds = arr[0] * 3600 + arr[1] * 60 + +arr[2];
      let totalTime =
        (arr[0] === '00' ? '' : arr[0] + ':') + arr[1] + ':' + arr[2];

      let exeAvgReactTime = 0;
      if (courseReducers.earAvgReactTimes.length !== 0) {
        courseReducers.earAvgReactTimes.forEach(element => {
          exeAvgReactTime = exeAvgReactTime + element;
        });
      } else exeAvgReactTime = 0;

      // let avgReactTimeDivided = ((exeAvgReactTime / 20) / 1000) % 60;
      let avgReactTimeDivided = exeAvgReactTime / 20 / 1000;
      let congratsDetails = {
        totalTime,
        totalSeconds: seconds,
        // avgReactionTime: avgReactTimeDivided <= 0 ? '0.00' : (avgReactTimeDivided < 1.2 ? (1.2 - avgReactTimeDivided) : (avgReactTimeDivided - 1.2))
        avgReactionTime: avgReactTimeDivided - 0.6,
      };
      congratsDetails.avgReactionTime = congratsDetails.avgReactionTime
        .toString()
        .includes('-')
        ? 0.1
        : congratsDetails.avgReactionTime;
      // let negativeNumber = congratsDetails.avgReactionTime.toString().includes('-') ? -congratsDetails.avgReactionTime.toString().replace('-', '').match(/^\d+(?:\.\d{0,2})?/) : congratsDetails.avgReactionTime.toString().match(/^\d+(?:\.\d{0,2})?/);
      let negativeNumber = congratsDetails.avgReactionTime
        .toString()
        .match(/^\d+(?:\.\d{0,2})?/);
      let earScoreCal = Number(global.correctAns) / Number(negativeNumber);
      congratsDetails.earScore =
        earScoreCal === -Infinity || earScoreCal === Infinity ? 0 : earScoreCal;
      dispatch({type: types.EAR_CONGO_DETAILS, payload: congratsDetails});
      callBack();
    }, 100);
  };
};

export const onAddEarScore = (userDetails, courseReducers, callBack) => {
  return async dispatch => {
    const selectedLevelId = courseReducers?.selectedEarLevel?.id;
    var requestBody = {
      user_id: userDetails.id,
      chapter_id: courseReducers.selectedCourseItem.chapter[0].id,
      type: courseReducers.selectedEarLevel.is_major ? 'major' : 'minor',
      level: `Level ${
        selectedLevelId === 3 || selectedLevelId === 8
          ? '4'
          : selectedLevelId === 4 || selectedLevelId === 9
          ? '5'
          : courseReducers?.selectedEarLevel?.title?.replace('level', '')
      }`,
      correct_answer: courseReducers.correctAns,
      total_time: courseReducers.earCongratsDetails.totalTime,
      avg_time:
        Number(courseReducers.earCongratsDetails.avgReactionTime) * 1000,
      // "best_time": correctAns == 20 ? Number(courseReducers.earCongratsDetails.avgReactionTime) * 1000 : 0,
      best_time: courseReducers.earCongratsDetails.earScore
        .toString()
        .includes('-')
        ? 0
        : Number(courseReducers.earCongratsDetails.earScore) * 1000,
      lession_id: courseReducers.selectedCourseItem.id,
      course_id: courseReducers.selectedCourseItem.course_id,
    };
    await POST(ear_score_add, requestBody, function (response) {
      if (response.status == '1') {
        Toast.show(response.responseData.message);
      } else {
        getEarTraining(
          userDetails,
          courseReducers.selectedCourseItem.chapter[0].id,
          dispatch,
        );
        callBack();
      }
    });
  };
};

const onGetNoOfExercise = async (userDetails, lessionId, dispatch) => {
  var requestBody = {
    user_id: userDetails.id,
    lession_id: lessionId,
  };
  await POST(get_ear_exercise, requestBody, function (response) {
    if (response.status == '0') {
      dispatch({
        type: types.NO_OF_EAR_EXERCISE,
        payload: Number(response.responseData.data[0].no_of_exercise),
      });
    }
  });
};

export const onAddNoOfExercise = (userDetails, courseReducers) => {
  return async dispatch => {
    var requestBody = {
      user_id: userDetails.id,
      lession_id: courseReducers.selectedCourseItem.id,
      no_of_exercise:
        Number(courseReducers.noOfExercise) + 1 === 10
          ? 0
          : Number(courseReducers.noOfExercise) + 1,
    };
    await POST(ear_exercise_add_update, requestBody, function (response) {
      if (response.status == '0') {
        onGetNoOfExercise(
          userDetails,
          courseReducers.selectedCourseItem.id,
          dispatch,
        );
      }
    });
  };
};

export const onStartMajorMinorTraining = selectedCourseItem => {
  return async dispatch => {
    var requestBody = {
      chapter_id: selectedCourseItem.chapter[0].id,
    };
    await POST(
      get_single_recognizing_training,
      requestBody,
      function (response) {
        if (response.status == '0') {
          dispatch({
            type: types.MAJOR_MINOR_RESOURCE,
            payload: response.responseData.data,
          });
        }
      },
    );
  };
};
export const onClearMajorMinorTraining = flag => {
  return dispatch => {
    dispatch({type: types.MAJOR_MINOR_RESOURCE, payload: {}, flag});
  };
};
export const onSetCorrectMajorMinorAns = counter => {
  return dispatch => {
    dispatch({type: types.CORRECT_MAJOR_MINOR_ANS, payload: counter});
    global.correctMajorMinorAns = counter;
    counter === 0 &&
      dispatch({type: types.MAJOR_MINOR_REACT_TIME, payload: []});
    // counter === 0 && dispatch({ type: types.ON_EAR_AVG_REACT_TIME, payload: [] });
  };
};
export const onCountMajorMinorAvgReactTimes = (
  majorMinorAvgReactTimes,
  startTime,
  endTime,
) => {
  return dispatch => {
    var timeDiff = endTime - startTime;
    majorMinorAvgReactTimes.push(timeDiff);
    dispatch({
      type: types.MAJOR_MINOR_REACT_TIME,
      payload: majorMinorAvgReactTimes,
    });
  };
};

export const onMajorMinorCongratsDetails = (courseReducers, callBack) => {
  return dispatch => {
    let exeAvgReactTime = 0;
    if (courseReducers.majorMinorAvgReactTimes.length !== 0) {
      courseReducers.majorMinorAvgReactTimes.forEach(element => {
        exeAvgReactTime = exeAvgReactTime + element;
      });
    } else exeAvgReactTime = 0;

    let avgReactTimeDivided = exeAvgReactTime / 20 / 1000;
    let congratsDetails = {
      avgReactionTime:
        avgReactTimeDivided <= 0
          ? '0.00'
          : avgReactTimeDivided < 1.2
          ? 1.2 - avgReactTimeDivided
          : avgReactTimeDivided - 1.2,
    };
    congratsDetails.avgReactionTime = congratsDetails.avgReactionTime
      .toString()
      .includes('-')
      ? 0.1
      : congratsDetails.avgReactionTime;
    let negativeNumber = congratsDetails.avgReactionTime
      .toString()
      .match(/^\d+(?:\.\d{0,2})?/);
    let earScoreCal =
      Number(global.correctMajorMinorAns) / Number(negativeNumber);
    congratsDetails.earScore =
      earScoreCal === -Infinity || earScoreCal === Infinity ? 0 : earScoreCal;
    dispatch({type: types.MAJOR_MINOR_CONGO_DETAILS, payload: congratsDetails});
    callBack();
  };
};

const onGetMajorMinorExercise = async (userDetails, chapterId, dispatch) => {
  var requestBody = {
    user_id: userDetails.id,
    chapter_id: chapterId,
  };
  await POST(get_recognize_score, requestBody, function (response) {
    if (response.status == '0') {
      response.responseData.data.best_time =
        Number(response?.responseData?.data?.best_time) / 1000;
      dispatch({
        type: types.GET_MAJOR_MINOR_HIGH_SCORE,
        payload: response?.responseData?.data,
      });
    }
  });
};

export const onAddMajorMinorEarScore = (
  userDetails,
  courseReducers,
  callBack,
) => {
  return async dispatch => {
    var requestBody = {
      user_id: userDetails.id,
      chapter_id:
        courseReducers.selectedCourseItem.chapter[
          Number(courseReducers.selectedCourseItem.chapter_index)
        ].id,
      correct_answer: courseReducers.correctMajorMinorAns,
      avg_time:
        Number(courseReducers.majorMinorCongratsDetails.avgReactionTime) * 1000,
      best_time: courseReducers.majorMinorCongratsDetails.earScore
        .toString()
        .includes('-')
        ? 0
        : Number(courseReducers.majorMinorCongratsDetails.earScore) * 1000,
      lession_id: courseReducers.selectedCourseItem.id,
      course_id: courseReducers.selectedCourseItem.course_id,
    };
    await POST(recognize_score_add, requestBody, function (response) {
      if (response.status == '1') {
        Toast.show(response.responseData.message);
      } else {
        onGetMajorMinorExercise(
          userDetails,
          courseReducers.selectedCourseItem.chapter[
            Number(courseReducers.selectedCourseItem.chapter_index)
          ].id,
          dispatch,
        );
        callBack();
      }
    });
  };
};

export const onClearMajorMinorHighScore = () => {
  return dispatch => {
    dispatch({
      type: types.GET_MAJOR_MINOR_HIGH_SCORE,
      payload: {
        best_time: 0,
      },
    });
  };
};
export const onSelectDailyTime = (
  selectedHour,
  selectedMin,
  hArray,
  minArray,
  courseReducers,
  userDetails,
) => {
  return async dispatch => {
    // saveData('selectedDailyTime', { selectedHour, selectedMin });
    let selectedDailyTime = `${
      DEVICE_OS === 'ios'
        ? selectedHour === 0
          ? '0'
          : selectedHour.substring(0, selectedHour.length - 1)
        : hArray[selectedHour]
    }:${
      DEVICE_OS === 'ios'
        ? selectedMin === 0
          ? '0'
          : selectedMin.substring(
              0,
              selectedMin.length === 4
                ? selectedMin.length - 2
                : selectedMin.length - 1,
            )
        : minArray[selectedMin]
    }`;
    dispatch({type: types.ON_SELECT_DAILY_TIME, payload: selectedDailyTime});
    let progressFormula = await timeGreenProgress(
      selectedDailyTime,
      courseReducers.trackedTime,
    );
    dispatch({
      type: types.ON_TRACKED_TIME,
      payload: courseReducers.trackedTime,
      progressFormula: selectedDailyTime == '0:0' ? 0 : progressFormula,
    });
    userDetails !== undefined &&
      onStoreDailySelectedTime(userDetails, selectedDailyTime, dispatch);
  };
};
const onStoreDailySelectedTime = async (
  userDetails,
  selectedDailyTime,
  dispatch,
) => {
  var requestBody = {
    user_id: userDetails.id,
    daily_goal: selectedDailyTime,
  };
  await POST(daily_goal_store, requestBody, function (response) {});
};
const timeGreenProgress = (selectedDailyTime, trackedTime) => {
  let convertedMins = Util.convertHourstoMinute(
    selectedDailyTime?.split(':')[0],
  );
  let selectedTimeCount =
    Number(convertedMins) + selectedDailyTime?.split(':')[1];

  let timeArray = trackedTime?.split(':');
  let hrsMS = timeArray[2] === undefined ? '0' : timeArray[0];
  let minMS = timeArray[2] === undefined ? timeArray[0] : timeArray[1];
  let secMS = timeArray[2] === undefined ? timeArray[1] : timeArray[2];
  let trackedTimeCount =
    Number(Util.convertHourstoMinute(hrsMS)) +
    Number(minMS) +
    Number(Util.convertSecondstoMinute(secMS));

  let progressFormula =
    ((timeArray[2] === undefined ? 15.2 : 22.7) * trackedTimeCount) /
    Number(selectedTimeCount);
  // return (progressFormula >= Number(selectedTimeCount)) ? Number(selectedTimeCount) : progressFormula;
  return progressFormula;
};
export const onStartTimer = (trackedTime, selectedDailyTime) => {
  return async dispatch => {
    let progressFormula = await timeGreenProgress(
      selectedDailyTime,
      trackedTime,
    );
    dispatch({
      type: types.ON_TRACKED_TIME,
      payload: trackedTime,
      progressFormula: selectedDailyTime == '0:0' ? 0 : progressFormula,
    });
  };
};
export const onAppBackgroundTime = isClear => {
  return dispatch => {
    let curretTime = moment().format('hh:mm:ss');
    dispatch({
      type: types.ON_APP_BACKGROUND_TIME,
      payload: isClear ? '' : curretTime,
    });
  };
};
export const onStoreTrackedTime = (
  userDetails,
  courseReducers,
  isGetGoals,
  callBack,
) => {
  return async dispatch => {
    var requestBody = {
      user_id: userDetails.id,
      goal_timer: courseReducers.trackedTime,
    };
    await POST(daily_goal_timer_store, requestBody, function (response) {
      response.status !== '1' &&
        isGetGoals &&
        dispatch(
          authActions.onGetDailyGoalDetails(userDetails),
          callBack !== undefined && callBack(),
        );
    });
  };
};
export const onAddTrackedDays = (userDetails, courseReducers, callBack) => {
  return async dispatch => {
    var requestBody = {
      user_id: userDetails.id,
      is_dayTracked: 1,
      goal_timer: courseReducers.trackedTime,
    };
    await POST(update_current_day, requestBody, function (response) {
      callBack();
    });
  };
};
// export const onTimerCalculation = (courseReducers, callBack) => {
//     return async dispatch => {
//         var now = moment(moment().format('hh:mm:ss'), "hh:mm:ss");
//         var thenT = moment(courseReducers.appBackgroundTime, "hh:mm:ss");
//         const ms = now.diff(thenT);

//         let timeArray = courseReducers.trackedTime?.split(":");
//         let hrsMS = timeArray[2] === undefined ? 0 : Util.convertHourstoMilliSeconds(timeArray[0]);
//         let minMS = Util.convertMinutestoMilliSeconds(timeArray[2] === undefined ? timeArray[0] : timeArray[1]);
//         let secMS = Util.convertSectoMilliSeconds(timeArray[2] === undefined ? timeArray[1] : timeArray[2]);
//         let finalMS = ms + Number(hrsMS) + Number(minMS) + Number(secMS);

//         let finalTime = `${moment.utc(Number(finalMS)).format('mm:ss')}`.toString();
//         let progressFormula = await timeGreenProgress(courseReducers.selectedDailyTime, finalTime);

//         dispatch({ type: types.ON_TRACKED_TIME, payload: finalTime, progressFormula });
//         callBack();
//     }
// }
export const onGetEarGraphScore = (
  userDetails,
  courseReducers,
  isFromMajorMinor,
  levelName,
) => {
  return async dispatch => {
    const selectedLevelId = courseReducers?.selectedEarLevel?.id;
    let requestBody = {
      user_id: userDetails.id,
      chapter_id: courseReducers.selectedCourseItem.chapter[0].id,
      major_minor: isFromMajorMinor
        ? ''
        : courseReducers?.selectedEarLevel?.is_major
        ? 'major'
        : 'minor',
      level: isFromMajorMinor
        ? ''
        : `Level ${
            selectedLevelId === 3 || selectedLevelId === 8
              ? '4'
              : selectedLevelId === 4 || selectedLevelId === 9
              ? '5'
              : courseReducers?.selectedEarLevel?.title?.replace('level', '')
          }`,
    };
    await POST(ear_score_graph, requestBody, function (response) {
      if (
        response?.responseData?.data?.length !== 0 ||
        response?.responseData?.data !== null ||
        response?.responseData?.data !== ''
      ) {
        let scoreDifference = 0;
        if (
          response.responseData.data[0].best_time > 0 &&
          response.responseData.data[response.responseData.data.length - 1]
            .best_time > 0
        ) {
          if (
            Number(
              response.responseData.data[response.responseData.data.length - 1]
                .best_time,
            ) > Number(response.responseData.data[0].best_time)
          ) {
            scoreDifference =
              Number(
                response.responseData.data[
                  response.responseData.data.length - 1
                ].best_time,
              ) / Number(response.responseData.data[0].best_time);
          }
        }
        let graphData = [];
        response.responseData.data.forEach(element => {
          graphData.push(element.best_time);
        });
        dispatch({
          type: types.ON_GET_EAR_SCORE_GRAPH,
          payload: {
            graphData,
            scores: response.responseData.data,
            scoreDifference: scoreDifference.toString().includes('-')
              ? scoreDifference.toString().replace('-', '')
              : scoreDifference,
          },
        });
      }
    });
  };
};
export const onUpdateCourse = userDetails => {
  return dispatch => {
    onGetCourse(userDetails, dispatch);
  };
};
