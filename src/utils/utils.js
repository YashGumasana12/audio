import {Component} from 'react';
import {Dimensions, Platform, Animated, Easing, Share} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import AsyncStorage from '@react-native-community/async-storage';

const screen_height = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default class Util extends Component {
  static isScrollToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  static onHapticFeedback = () => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: true,
    };
    Platform.OS === 'ios'
      ? ReactNativeHapticFeedback.trigger('impactHeavy', options)
      : ReactNativeHapticFeedback.trigger('impactLight', options);
  };

  static getIapPassword = () => {
    return '36e81dc6ba6842938a3bf213b7d8921c';
  };

  static onAgeCalculation = selectedDate => {
    var today = new Date();
    var birthDate = new Date(selectedDate);
    var ageNow = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      ageNow--;
    }
    return ageNow;
  };
  static slideLeftAnim = (moveAnimation, xValue, axis, type, callBack) => {
    axis === 'track'
      ? Animated.spring(moveAnimation, {
          toValue: {x: axis !== 'y' ? xValue : 0, y: axis === 'y' ? xValue : 0},
          duration: 300,
          friction: 7,
          // easing: Easing.bounce,
        }).start(() => callBack !== undefined && callBack())
      : Animated.timing(moveAnimation, {
          toValue: {x: axis !== 'y' ? xValue : 0, y: axis === 'y' ? xValue : 0},
          duration:
            type === 'toolBar'
              ? 250
              : axis === 'newTabs'
              ? 350
              : type === 'hideOption'
              ? 500
              : 300,
        }).start(() => callBack !== undefined && callBack());
  };
  static slideAnimation = (moveAnimation, xValue, axis, type, callBack) => {
    axis === 'track'
      ? Animated.spring(moveAnimation, {
          toValue: xValue,
          duration: 300,
          friction: 7,
          useNativeDriver: true,
          // easing: Easing.bounce,
        }).start(() => callBack !== undefined && callBack())
      : Animated.timing(moveAnimation, {
          toValue: xValue,
          duration:
            type === 'toolBar'
              ? 250
              : axis === 'newTabs'
              ? 350
              : type === 'hideOption'
              ? 500
              : 300,
          useNativeDriver: true,
        }).start(() => callBack !== undefined && callBack());
  };
  static slideUpAnim = (moveAnimation, xValue, duration) => {
    Animated.spring(moveAnimation, {
      toValue: {x: 0, y: xValue},
      duration: duration,
      friction: 7,
    }).start();
  };
  static keyTrainingLetters = (array, flag, index, isMultiLetters) => {
    array.forEach((element, i) => {
      if (index === undefined) {
        element.isSelected = flag;
      } else if (isMultiLetters) {
        index === i && (element.isSelected = element.isSelected ? false : true);
      } else {
        index === i
          ? (element.isSelected = element.isSelected ? false : true)
          : (element.isSelected = false);
      }
    });
  };
  static keyShuffleArray = o => {
    // let tempArray = [];
    // for (var a = array, i = a.length; i--;) {
    //     var random = a.splice(Math.floor(Math.random() * (i + 1)), 1)[0];
    //     // console.log({ random });
    //     tempArray.push(random);
    // }
    // return tempArray;
    try {
      for (
        var j, x, i = o.length;
        i;
        j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
      );
      return o;
    } catch (error) {
      console.log({error});
    }
  };
  static secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    // var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    // var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    var hDisplay = h > 0 ? h + ':' : '';
    var mDisplay = m > 0 ? m + ':' : '0:';
    var sDisplay = s > 0 ? s : '0';
    return hDisplay + mDisplay + sDisplay;
  }
  static msToHms(milliseconds) {
    const ms = Math.floor((milliseconds % 1000) / 100);
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
      ms.toString().padStart(2, '0'),
    ].join(':');
  }
  static onShare = async () => {
    try {
      const result = await Share.share({
        // message: `Hey I thought you might like this app, it teaches piano through a new method, without sheet music !\n\nLINK : ${DEVICE_OS === 'ios' ? 'https://apps.apple.com/us/app/pianohack-skip-sheet-music/id1595060274' : 'https://play.google.com/store/apps/details?id=com.pianohack.android'}`,
        message: `Hey I thought you might like this app, it teaches piano through a new method, without sheet music !\n\nLINK : https://onelink.to/gmxkve`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  static onGetCurrentTime = () => {
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();

    return `${hours}:${min}:${sec}`;
  };
  static convertHourstoMilliSeconds(hours) {
    return Math.floor(hours * 60 * 60 * 1000);
  }
  static convertMinutestoMilliSeconds(minutes) {
    return Math.floor(minutes * 60 * 1000);
  }
  static convertSectoMilliSeconds(sec) {
    return Math.floor(sec * 1000);
  }
  static convertHourstoMinute(hours) {
    // return Math.floor(hours * 60);
    return hours * 60;
  }
  static convertSecondstoMinute(secs) {
    // return Math.floor(secs % 3600 / 60);
    return (secs % 3600) / 60;
  }
}
