//#region import
//#region RN
import React, {useState, useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Animated,
  AppState,
} from 'react-native';
//#endregion
//#region third party libs
import {isIphoneX} from 'react-native-iphone-x-helper';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as action from '../../redux/actions/authActions';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import {hp, wp, DEVICE, DEVICE_OS} from '../../utils/constants';
import {images} from '../../res/images';
import {colors} from '../../res/colors';
import OnBackPressed from '../../components/OnBackPressed';
import {fonts} from '../../res/fonts';
import Home from './home';
import Settings from '../settings/settings';
import Util from '../../utils/utils';
import Track from './track';
import Course from '../course/course';
import Chating from '../chat/chating';
import {fcmService} from '../../apiHelper/FCMService';
import {onGetChat} from '../../utils/svgImagesAction';
//#endregion
//#endregion

const moveTabAnimation = new Animated.Value(0);
// const moveMenuBarAnimation = new Animated.ValueXY({ x: 0, y: 0 });
let moveMenuBarAnimation = new Animated.Value(0);
// const moveTrackAnimation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 });
const moveTrackAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
// const moveTrackViewAnimation = new Animated.ValueXY({ x: 0, y: DEVICE.DEVICE_HEIGHT });
const moveHomeAnimation = new Animated.Value(0);
const movePopularAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);

export default tabBar = props => {
  //#region redux
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
  return (
    <View style={globalStyles.flex}>
      {/* //#region Tabbar animation */}
      {/* <Animated.View style={[moveTabAnimation.getLayout(), globalStyles.flex]}> */}
      <Animated.View
        style={[
          {transform: [{translateX: moveTabAnimation}]},
          globalStyles.flex,
        ]}>
        {tabIndex !== 0 && (
          <OnBackPressed
            onBackPressed={() => {
              setTabIndex(0);
              Util.slideAnimation(moveHomeAnimation, 0, 'newTabs');
              Util.slideAnimation(
                movePopularAnimation,
                DEVICE.DEVICE_WIDTH,
                'newTabs',
              );
            }}
          />
        )}
        <View
          style={[
            globalStyles.subContainer,
            {height: DEVICE.DEVICE_HEIGHT, flex: 0},
          ]}>
          {tabIndex === 0 ? (
            <Course
              props={props}
              onBottomBarAnim={value => {
                value === 0 &&
                  (setIsBottomBarVisible(true),
                  (moveMenuBarAnimation = new Animated.Value(hp('20%'))));
                Util.slideAnimation(moveMenuBarAnimation, value, 'y');
                value !== 0 &&
                  setTimeout(() => {
                    setIsBottomBarVisible(false);
                  }, 300);
              }}
              onSongsClicked={value => {
                setTabIndex(1);
                global.isExploreSongs = false;
              }}
            />
          ) : tabIndex === 1 ? (
            <Home
              isTrackVisible={isTrackVisible}
              props={props}
              tabIndex={tabIndex}
              moveHomeAnimation={moveHomeAnimation}
              movePopularAnimation={movePopularAnimation}
              onTracklistItemTapped={() => {
                Util.slideAnimation(moveMenuBarAnimation, hp('20%'), 'y');
                Util.slideAnimation(moveTabAnimation, -DEVICE.DEVICE_WIDTH);
                setTimeout(() => {
                  Util.slideAnimation(moveTrackAnimation, 0);
                }, 100);
                setTimeout(() => {
                  // Util.slideLeftAnim(moveTrackViewAnimation, 0, 'y');
                  setIsTrackVisible(!isTrackVisible);
                  setIsBottomBarVisible(false);
                }, 300);
              }}
              onBottomBarAnim={value => {
                value === 0 && setIsBottomBarVisible(true);
                Util.slideAnimation(moveMenuBarAnimation, value, 'y');
                value !== 0 &&
                  setTimeout(() => {
                    setIsBottomBarVisible(false);
                  }, 300);
              }}
              onTabChange={() => setTabIndex(0)}
            />
          ) : tabIndex === 2 ? (
            <Chating props={props} />
          ) : (
            <Settings props={props} onTabChange={() => setTabIndex(0)} />
          )}
        </View>
      </Animated.View>

      {isBottomBarVisible && (
        // <Animated.View style={[moveMenuBarAnimation.getLayout(), styles.tabBar, globalStyles.shadow, { width: DEVICE.DEVICE_WIDTH, paddingTop: hp('1%'), paddingBottom: isIphoneX() ? hp('2.6%') : hp('1.5%'), backgroundColor: colors.creamBase1 }]} ref={bottomBarRef}>
        <Animated.View
          style={[
            styles.tabBar,
            globalStyles.shadow,
            {
              transform: [{translateY: moveMenuBarAnimation}],
              width: DEVICE.DEVICE_WIDTH,
              paddingTop: hp('1%'),
              paddingBottom: isIphoneX() ? hp('2.6%') : hp('1.5%'),
              backgroundColor: colors.creamBase1,
            },
          ]}
          ref={bottomBarRef}>
          {['COURSE', 'TABS', 'CHAT', 'MORE'].map((data, index) => {
            return (
              <TouchableOpacity
                style={styles.tabIcon}
                onPress={() => {
                  Util.onHapticFeedback();
                  setTabIndex(index);
                  Util.slideAnimation(moveHomeAnimation, 0, 'newTabs');
                  Util.slideAnimation(
                    movePopularAnimation,
                    DEVICE.DEVICE_WIDTH,
                    'newTabs',
                  );
                }}>
                <Image
                  style={[
                    globalStyles.img,
                    {height: wp('14%'), width: wp('12%')},
                    index === 1 && {
                      height: wp('10.8%'),
                      width: wp('10%'),
                      marginTop: wp(2.7),
                    },
                    index === 2 && {
                      height: wp(12.5),
                      width: wp(12),
                      marginTop: wp(1),
                    },
                  ]}
                  source={
                    index === 0
                      ? tabIndex === 0
                        ? images.courseActive
                        : images.course
                      : index === 1
                      ? tabIndex === 1
                        ? images.tabPianoActive
                        : images.tabPiano
                      : index === 2
                      ? tabIndex === 2
                        ? images.chatActive
                        : images.chat
                      : tabIndex === 3
                      ? images.menuActive
                      : images.menu
                  }
                />
                {settingsReducers.chats.length !== 0 &&
                  settingsReducers.chats.unread_msg &&
                  index === 2 && (
                    <Image
                      style={[
                        globalStyles.img,
                        {
                          position: 'absolute',
                          width: wp(3),
                          height: wp(3),
                          top: wp(2.3),
                          right: wp(2),
                        },
                      ]}
                      source={images.unreadMsg}
                    />
                  )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}

      {/* //#endregion Tabbar animation */}
      {/* //#region Track screen animation  */}
      {/* <Animated.View style={[moveTrackAnimation.getLayout(), { alignItems: 'center', position: 'absolute', width: DEVICE.DEVICE_WIDTH, bottom: 0 }]}> */}
      <Animated.View
        style={{
          alignItems: 'center',
          position: 'absolute',
          width: DEVICE.DEVICE_WIDTH,
          bottom: 0,
          transform: [{translateX: moveTrackAnimation}],
        }}>
        {/* <View style={[globalStyles.flex, { backgroundColor: 'red' }]}> */}
        {/* <Animated.View style={[moveTrackViewAnimation.getLayout(), { alignItems: 'center', position: 'absolute', width: DEVICE.DEVICE_WIDTH, bottom: 0 }]}> */}
        {/* <View style={{ alignItems: 'center', position: 'absolute', width: DEVICE.DEVICE_WIDTH, bottom: 0 }}> */}
        <Track
          props={props}
          isTrackVisible={isTrackVisible}
          onBackPressed={() => {
            setIsBottomBarVisible(true);
            moveMenuBarAnimation = new Animated.Value(hp('20%'));
            // Util.slideLeftAnim(moveTrackViewAnimation, DEVICE.DEVICE_HEIGHT, 'y');
            Util.slideAnimation(moveTrackAnimation, DEVICE.DEVICE_WIDTH);
            setTimeout(() => {
              Util.slideAnimation(moveTabAnimation, 0);
              Util.slideAnimation(moveMenuBarAnimation, 0, 'y');
              setIsTrackVisible(!isTrackVisible);
            }, 100);
            dispatch(action.onClearTappedItem(authReducers.trackOptionsMenu));
          }}
        />
        {/* </View> */}
        {/* </Animated.View> */}
        {/* </View> */}
      </Animated.View>

      {/* //#endregion  Track screen animation  */}
    </View>
  );
};
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingLeft: wp(4),
    paddingRight: wp(4),
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1
  },
  tabText: {
    fontFamily: fonts.QE,
    fontSize: wp('3.5%'),
    color: colors.white,
    textAlign: 'center',
  },
});
