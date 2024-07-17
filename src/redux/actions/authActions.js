//#region import
import {Keyboard} from 'react-native';
//#region common files
import * as authActions from '../actionTypes/authActionTypes';
import * as courseActions from '../actionTypes/courseActionTypes';
import * as settingActions from '../actionTypes/settingsActionTypes';
import {
  update_profile,
  track_list,
  get_single_track,
  add_remove_favorite,
  added_recently_visit,
  chords_status,
  playlist_list,
  get_playlist_track,
  create_playlist,
  remove_playlist,
  remove_track_playlist,
  mistake_track,
  playlist_sorting,
  all_track,
  all_playlist_with_track,
  course,
  track_request,
  chat_get,
  daily_goal_get,
} from '../../apiHelper/APIs.json';
import {getData, saveData} from '../../utils/asyncStorageHelper';
import {GET, POST} from '../../apiHelper/apiService';
import Util from '../../utils/utils';
import {colors} from '../../res/colors';
import {Strings} from '../../res/string';
//#endregion
//#region third party libs
import Toast from 'react-native-simple-toast';
import SplashScreen from 'react-native-splash-screen';
import {
  isSubscriptionActive,
  productPurchase,
  isSubscriptionActiveAndRestore,
} from '../../apiHelper/IAP';
import {call} from 'react-native-reanimated';
import {DEVICE_OS} from '../../utils/constants';
//#endregion
//#endregion

export const onStoreUserDetails = () => {
  return async dispatch => {
    getData(
      'objLogin',
      success => {
        dispatch({
          type: authActions.USER_DETAILS,
          userDetails: JSON.parse(success),
        });
        onGetDailyGoal(JSON.parse(success), dispatch);
        onGetCourse(JSON.parse(success), dispatch);
        onGetTrackList(JSON.parse(success), dispatch);
        onGetPlayList(JSON.parse(success), dispatch);
        onDownloadData(JSON.parse(success));
        onGetChat(JSON.parse(success), dispatch);
        isSubscriptionActive(JSON.parse(success), dispatch);
      },
      failure => {},
    );
  };
};

export const onProfileUpdate = (
  userDetails,
  updatedDetails,
  props,
  callBack,
) => {
  return async dispatch => {
    var requestBody = {
      user_id: userDetails.id,
      name: updatedDetails.name,
    };
    updatedDetails.password !== '' &&
      (requestBody.password = updatedDetails.password);
    await POST(update_profile, requestBody, function (response) {
      console.log('onProfileUpdate responseData : ', response);
      if (response.status == '1') {
        Toast.show(response.responseData.message);
        callBack();
      } else {
        props.navigation.goBack();
        response.responseData.data.pro_status = userDetails.pro_status;
        dispatch({
          type: authActions.USER_DETAILS,
          userDetails: response.responseData.data,
        });
        saveData('objLogin', JSON.stringify(response.responseData.data));
      }
    });
  };
};
const onGetDailyGoal = async (userDetails, dispatch) => {
  await POST(
    daily_goal_get,
    {user_id: userDetails.id},
    async function (response) {
      if (response.status == '1') {
        Toast.show(response.responseData.message);
      } else {
        if (
          response.responseData.data !== undefined ||
          response.responseData.data !== null
        ) {
          let trackedDays = response?.responseData?.data?.day;
          let selectedDailyGoal = response?.responseData?.data?.daily_goal;
          let trackedTime = response?.responseData?.data?.goal_timer;

          dispatch({type: courseActions.ON_TRACKED_DAYS, payload: trackedDays});
          dispatch({
            type: courseActions.ON_SELECT_DAILY_TIME,
            payload: selectedDailyGoal,
          });
          let progressFormula = await timeGreenProgress(
            selectedDailyGoal,
            trackedTime,
          );
          dispatch({
            type: courseActions.ON_TRACKED_TIME,
            payload: trackedTime,
            progressFormula: selectedDailyGoal == '0:0' ? 0 : progressFormula,
          });

          dispatch({
            type: authActions.GET_DAILY_GOAL,
            payload: response?.responseData?.data,
          });
        }
      }
    },
  );
};
export const onGetDailyGoalDetails = userDetails => {
  return dispatch => {
    onGetDailyGoal(userDetails, dispatch);
  };
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
const onGetCourse = async (userDetails, dispatch) => {
  var requestBody = {
    user_id: userDetails.id,
  };
  console.log('userDetails :', userDetails);
  await POST(course, requestBody, function (response) {
    SplashScreen.hide();
    if (response.status == '1') {
      Toast.show(response.responseData.message);
    } else {
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
        type: courseActions.COURSES,
        payload: response.responseData.courseList,
        courseScreenDetails: response.responseData.course_details,
        freeUser: response.responseData.total_free_user,
      });
    }
  });
};
const onGetTrackList = async (userDetails, dispatch) => {
  var requestBody = {
    user_id: userDetails.id,
  };
  await POST(track_list, requestBody, function (response) {
    if (response.status == '1') {
      Toast.show(response.responseData.message);
    } else {
      let nullData = {title: 'null@123', artist: 'null@123'};
      response.responseData.favorite.push(nullData);
      response.responseData.popular.push(nullData);
      response.responseData.recent.push(nullData);
      dispatch({
        type: authActions.GET_TRACK_LIST,
        payload: response.responseData,
      });
      saveData('songs', response.responseData);
    }
  });
};
const onGetPlayList = async (userDetails, dispatch) => {
  var requestBody = {
    user_id: userDetails.id,
  };
  await POST(playlist_list, requestBody, function (response) {
    if (response.status == '1') {
      dispatch({type: authActions.GET_PLAY_LIST, payload: []});
    } else {
      let nullData = {name: 'null@123'};
      response.responseData.data.push(nullData);
      dispatch({
        type: authActions.GET_PLAY_LIST,
        payload: response.responseData,
      });
    }
  });
};
const onDownloadData = async (userDetails, dispatch) => {
  var requestBody = {
    user_id: userDetails.id,
  };
  await POST(all_playlist_with_track, requestBody, function (response) {
    response.status == '0' && saveData('playList', response.responseData);
  });
  await POST(all_track, requestBody, function (response) {
    response.status == '0' &&
      saveData('trackDetails', response.responseData.data);
  });
};

export const getChat = (userDetails, callBack) => {
  return dispatch => {
    onGetChat(userDetails, dispatch, callBack);
  };
};
const onGetChat = async (userDetails, dispatch, callBack) => {
  var requestBody = {
    user_id: userDetails.id,
  };
  await POST(chat_get, requestBody, function (response) {
    if (response.status == '0') {
      dispatch({
        type: settingActions.ON_GET_CHAT,
        payload: response.responseData,
      });
      callBack !== undefined && callBack();
    }
  });
};
export const onTapSongItem = (
  authReducers,
  item,
  index,
  trackOptionsMenu,
  props,
  callBack,
) => {
  return async dispatch => {
    if (!authReducers.isNetworkDisable) {
      var requestBody = {
        user_id: authReducers.userDetails.id,
        track_id: item.id,
      };
      await POST(get_single_track, requestBody, function (response) {
        callBack();
        if (response.status == '1') {
          Toast.show(response.responseData.message);
        } else {
          manageTrackDetails(
            response.responseData.data,
            index,
            trackOptionsMenu,
            dispatch,
          );
        }
      });
    } else {
      if (authReducers.offlineTracks !== '') {
        setTimeout(() => {
          authReducers.offlineTracks.forEach(element => {
            if (item.id === element.id) {
              callBack();
              manageTrackDetails(element, index, trackOptionsMenu, dispatch);
            }
          });
        }, 1);
      }
    }
  };
};
const manageTrackDetails = (array, index, trackOptionsMenu, dispatch) => {
  //#region The logic of first line disble or not
  array.section.forEach((element, index) => {
    let tempSameArray = [];
    let isDisable = false;
    let xValue = '';
    let isSame = '';
    var BreakException = {};
    element.first_line.forEach((item, index) => {
      if (item.toLowerCase() === 'x') {
        xValue = item;
      } else {
        if (xValue !== '') {
          element.first_line[index] = 'x';
        }
      }
      if (item.toLowerCase() === 'same') {
        if (isSame === '') {
          element.first_line[index] = 'same as ';
        } else {
          element.first_line[index] = 'N!A';
        }
        tempSameArray.push(index);
        isSame = item;
      }
    });
    try {
      element.first_line.forEach((item, index) => {
        if (item === 'N!A') {
          isDisable = true;
          element.first_line[index] = 'isFirstNumber';
        } else {
          isDisable = false;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    array.section[index].isFirstLineDisabled = isDisable;
    array.section[index].tempSameArray = tempSameArray;
  });
  //#endregion
  array.index = index;

  //#region Set option menu for the Track screen
  trackOptionsMenu[0].tintColor = !array.is_favorite
    ? colors.grayDark
    : colors.white;
  trackOptionsMenu[1].tintColor = !array.in_playlist_status
    ? colors.grayDark
    : colors.white;
  trackOptionsMenu[2].isOn = array.creamBase4 === 'off' ? false : true;
  //#endregion Set option menu for the Track screen
  dispatch({
    type: authActions.TAPPED_SONG,
    tappedSongResponse: array,
    trackOptionsMenu,
  });
  Keyboard.dismiss();
};
export const onSaveTrackToFav = authReducers => {
  return async dispatch => {
    Util.onHapticFeedback();
    var requestBody = {
      user_id: authReducers.userDetails.id,
      track_id: authReducers.tappedSongResponse.id,
      type:
        authReducers.tappedSongResponse.is_favorite === 0
          ? 'favorite'
          : 'unfavorite',
    };
    authReducers.tappedSongResponse.is_favorite =
      authReducers.tappedSongResponse.is_favorite === 0 ? 1 : 0;
    authReducers.trackOptionsMenu[0].tintColor =
      authReducers.tappedSongResponse.is_favorite === 0
        ? colors.grayDark
        : colors.white;
    await POST(add_remove_favorite, requestBody, function (response) {
      if (response.status == '1') {
        Toast.show(response.responseData.message);
      } else {
        // authReducers.tappedSongResponse.is_favorite !== 0 ?
        //     authReducers.favSongs.favorite.push(authReducers.tappedSongResponse) :
        //     authReducers.favSongs.favorite.splice(authReducers.tappedSongResponse.index, 1);
        // dispatch({ type: authActions.TAPPED_SONG, tappedSongResponse: authReducers.tappedSongResponse });
        onGetTrackList(authReducers.userDetails, dispatch);
      }
    });
  };
};
export const onAddedRecently = authReducers => {
  return async dispatch => {
    var requestBody = {
      user_id: authReducers.id,
    };
    await POST(added_recently_visit, requestBody, function (response) {});
  };
};
export const onChordsStatus = (authReducers, isChords) => {
  return async dispatch => {
    var requestBody = {
      user_id: authReducers.userDetails.id,
      track_id: authReducers.tappedSongResponse.id,
      status: isChords ? 'on' : 'off',
    };
    authReducers.trackOptionsMenu[2].isOn = isChords;
    dispatch({
      type: authActions.TAPPED_SONG,
      tappedSongResponse: authReducers.tappedSongResponse,
      trackOptionsMenu: authReducers.trackOptionsMenu,
    });
    await POST(chords_status, requestBody, function (response) {});
  };
};
export const onTapPlaylistItem = (authReducers, item, callBack) => {
  return async dispatch => {
    if (!authReducers.isNetworkDisable) {
      onGetPlaylistTrack(authReducers.userDetails, item, callBack, dispatch);
    } else {
      setTimeout(() => {
        let nullData = {title: 'null@123', artist: 'null@123'};
        item.track.push(nullData);
        dispatch({
          type: authActions.SELECTED_PLAYLIST,
          tappedSongResponse: item,
          item,
        });
        callBack();
      }, 1);
    }
  };
};
const onGetPlaylistTrack = async (userDetails, item, callBack, dispatch) => {
  var requestBody = {
    user_id: userDetails.id,
    playlist_id: item.id,
  };
  await POST(get_playlist_track, requestBody, function (response) {
    callBack !== undefined ? callBack() : onGetPlayList(userDetails, dispatch);
    if (response.status == '1') {
      dispatch({
        type: authActions.SELECTED_PLAYLIST,
        tappedSongResponse: [],
        item,
      });
    } else {
      let nullData = {title: 'null@123', artist: 'null@123'};
      response.responseData.track.push(nullData);
      dispatch({
        type: authActions.SELECTED_PLAYLIST,
        tappedSongResponse: response.responseData,
        item,
      });
    }
  });
};
export const onClearPlaylist = () => {
  return async dispatch => {
    setTimeout(() => {
      dispatch({
        type: authActions.SELECTED_PLAYLIST,
        tappedSongResponse: [],
        item: '',
      });
    }, 400);
  };
};
export const onCreateNewPlaylist = (
  userDetails,
  name,
  callBack,
  data,
  tappedSongResponse,
  trackOptionsMenu,
) => {
  return async dispatch => {
    var requestBody;
    data === undefined
      ? (requestBody = {
          user_id: userDetails.id,
          name: name,
        })
      : (requestBody = {
          user_id: userDetails.id,
          track_id: tappedSongResponse.id,
          playlist_id: data.id,
        });
    await POST(create_playlist, requestBody, function (response) {
      Keyboard.dismiss();
      callBack();
      if (response.status == '1') {
        Toast.show(response.responseData.message);
      } else {
        if (data !== undefined) {
          tappedSongResponse.in_playlist_status = 1;
          trackOptionsMenu[1].tintColor = colors.white;
          dispatch({
            type: authActions.TAPPED_SONG,
            tappedSongResponse: tappedSongResponse,
            trackOptionsMenu,
          });
        }
        onGetPlayList(userDetails, dispatch);
      }
    });
  };
};
export const onDeletePlaylist = (
  selectedItem,
  userDetails,
  callBack,
  selectedPlaylistItem,
) => {
  return async dispatch => {
    var requestBody;
    selectedPlaylistItem === ''
      ? (requestBody = {
          user_id: userDetails.id,
          playlist_id: selectedItem.id,
        })
      : (requestBody = {
          user_id: userDetails.id,
          playlist_id: selectedPlaylistItem.id,
          track_id: selectedItem.id,
        });
    await POST(
      selectedPlaylistItem === '' ? remove_playlist : remove_track_playlist,
      requestBody,
      function (response) {
        callBack();
        if (response.status !== '1') {
          selectedPlaylistItem === ''
            ? onGetPlayList(userDetails, dispatch)
            : onGetPlaylistTrack(
                userDetails,
                selectedPlaylistItem,
                undefined,
                dispatch,
              );
        }
      },
    );
  };
};
export const onTabMistake = authReducers => {
  return async dispatch => {
    var requestBody = {
      user_id: authReducers.userDetails.id,
      track_id: authReducers.tappedSongResponse.id,
    };
    await POST(mistake_track, requestBody, function (response) {});
  };
};
export const onChangeSorting = (authReducers, name, sorting, type) => {
  return async dispatch => {
    var requestBody = {
      user_id: authReducers.userDetails.id,
      playlist_id: authReducers.selectedPlaylistItem.id,
      name: name,
      sorting: sorting,
    };
    await POST(playlist_sorting, requestBody, function (response) {
      type === 'title' && onGetPlayList(authReducers.userDetails, dispatch);
    });
  };
};
export const onClearTappedItem = trackOptionsMenu => {
  return dispatch => {
    dispatch({
      type: authActions.TAPPED_SONG,
      tappedSongResponse: '',
      trackOptionsMenu,
    });
  };
};
export const onRequestSong = (userDetails, searchKeyword, token, callBack) => {
  return async dispatch => {
    var requestBody = {
      user_id: userDetails.id,
      track_title: searchKeyword,
      device_token: token,
      device_type: DEVICE_OS == 'ios' ? 'I' : 'A',
    };
    await POST(track_request, requestBody, function (response) {
      callBack();
      if (response.status == '1') {
        Toast.show(response.responseData.message);
      }
    });
  };
};

export const onUnlockCourse = (userDetails, callBack) => {
  return async dispatch => {
    productPurchase(userDetails, dispatch, callBack);
  };
};

export const onRestorePurchase = (userDetails, callBack) => {
  return async dispatch => {
    isSubscriptionActiveAndRestore(userDetails, dispatch, callBack);
  };
};
