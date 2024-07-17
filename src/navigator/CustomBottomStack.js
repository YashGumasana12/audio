import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AppState,
  Dimensions,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../res/colors';
import {useDispatch, useSelector} from 'react-redux';
import * as action from '../redux/actions/authActions';
const {width, height} = Dimensions.get('window');
import {fcmService} from '../apiHelper/FCMService';
import {onGetChat} from '../utils/svgImagesAction';
import {hp, wp, DEVICE, DEVICE_OS} from '../utils/constants';
export default function CustomBottomStack(props) {
  const Focus = props.state.index;
  const [focusedScreen, setFocusedScreen] = useState(null);

  const [visible, setVisible] = useState(true);

  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  global.dispatch = useDispatch();
  global.authReducers = useSelector(state => state.authReducers);
  //#endregion redux
  //#region local state
  const [tabIndex, setTabIndex] = useState(0);
  const [isTrackVisible, setIsTrackVisible] = useState(false);
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const appState = useRef(AppState.currentState);
  //#endregion local state
  const bottomBarRef = useRef();

  useEffect(() => {
    dispatch(action.onStoreUserDetails());
  }, []);
  useEffect(() => {
    fcmService.createNotificationListeners(() => {
      if (global.isNotificationOpen) {
        if (bottomBarRef.current) {
          bottomBarRef.current.measure((x, y, width, height, pageX, pageY) => {
            if (DEVICE_OS === 'ios' ? y != 0 : y == 0) {
              setTabIndex(2);
              global.isNotificationOpen = false;
            }
          });
        }
      }
    });
  }, []);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        onGetChat();
      }
      appState.current = nextAppState;
    });
  }, []);

  const _keyboardDidShow = useCallback(() => {
    setVisible(false);
  });
  const _keyboardDidHide = useCallback(() => {
    setVisible(true);
  });

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
  }, []);
  const selectedColor = colors.redBase1;
  const unSelectedColor = colors.black;
  const tabListArray = [
    {
      title: 'Home',
      onPress: () => {
        setFocusedScreen('newhome');
        if (focusedScreen == 'newhome') {
          props.navigation.navigate('newhome');
        } else {
          props.navigation.navigate('newhome');
        }
      },
    },
    // {
    //   title: 'Course',
    //   onPress: () => {
    //     setFocusedScreen('course');
    //     if (focusedScreen == 'course') {
    //       props.navigation.navigate('course');
    //     } else {
    //       props.navigation.navigate('course');
    //     }
    //   },
    // },
    // {
    //   title: 'Tab',
    //   onPress: () => {
    //     setFocusedScreen('home');
    //     props.navigation.navigate('home');
    //   },
    // },
    {
      title: 'Chating',
      onPress: () => {
        setFocusedScreen('chating');
        props.navigation.navigate('chating');
      },
    },
    {
      title: 'More',
      onPress: () => {
        setFocusedScreen('settings');
        props.navigation.navigate('settings');
      },
    },
  ];
  return (
    <>
      {visible && (
        <View style={styles.bottomContainerStyle}>
          <>
            <View style={styles.bottomSubContainerStyle}>
              {tabListArray.map((data, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => data.onPress()}
                    style={styles.itemContainerStyle}>
                    <Text
                      style={[
                        styles.textStyle,
                        {
                          color:
                            Focus === index ? colors.creamBase5 : colors.Black,
                        },
                      ]}>
                      {data.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        </View>
      )}
      <SafeAreaView style={{backgroundColor: colors.creamBase1}} />
    </>
  );
}
const styles = StyleSheet.create({
  bottomContainerStyle: {
    width: width,
    height: width / 7.5,
    backgroundColor: colors.creamBase1,
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.creamBase3,
  },
  bottomSubContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  itemContainerStyle: {
    alignItems: 'center',
    width: width / 5,
    height: width / 7.5,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    padding: 10,
  },
  textStyle: {
    fontSize: width / 30,
    fontWeight: '500',
  },
  titleStyle: {
    color: colors.primary,
    marginHorizontal: 10,
    fontWeight: 'bold',

    paddingLeft: 0,
  },
});
