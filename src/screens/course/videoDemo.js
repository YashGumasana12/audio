// import React in our code
import React, {useState, useRef, useEffect} from 'react';
// import all the components we are going to use
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../redux/actions/courseActions';
//#endregion
import {StyleSheet, Text, View, Animated, AppState} from 'react-native';
//Import React Native Video to play video
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
//Media Controls to control Play/Pause/Seek and full screen
// import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import globalStyles from '../../res/globalStyles';
import {colors} from '../../res/colors';
const VideoDemo = props => {
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const courseReducers = useSelector(state => state.courseReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  // const props = Props.props;
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [paused, setPaused] = useState(true);
  // const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);
  const [screenType, setScreenType] = useState('contain');
  const [isScreenTappedOnce, setIsScreenTappedOnce] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [isVideoPause, setIsVideoPause] = useState(false);

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        setAppState(nextAppState);
        if (nextAppState === 'inactive') {
          setPaused(true);
          //   setPlayerState(1);
        }
      },
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);

  useEffect(() => {
    if (paused === false && courseReducers.isVideoPause) {
      setIsVideoPause(true);
      setPaused(true);
      //   setPlayerState(1);
    } else {
      setIsVideoPause(false);
    }
  }, [courseReducers.isVideoPause]);

  const onSeek = seek => {
    //Handler for change in seekbar
    videoPlayer.current.seek(seek);
  };

  const onPaused = playerState => {
    !isScreenTappedOnce && setIsScreenTappedOnce(true);
    setIsLoading(!isScreenTappedOnce ? true : isBuffering);
    //Handler for Video Pause
    setPaused(!paused);
    // setPlayerState(playerState);
  };

  const onReplay = () => {
    //Handler for Replay
    !isScreenTappedOnce && setIsScreenTappedOnce(true);
    // setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayer.current.seek(0);
  };

  const onProgress = data => {
    if (isBuffering) {
      setIsBuffering(false);
      setIsLoading(false);
    } else {
      if (isLoading && DEVICE_OS === 'android') {
        setIsLoading(false);
      }
    }
    // Video Player will progress continue even if it ends
    // if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
    //     setCurrentTime(data.currentTime);
    // }
  };

  const onLoad = data => {
    setDuration(data.duration);
    // setIsLoading(false);
    props.onVideoLoad();
  };

  const onLoadStart = data => setIsLoading(false);

  const onEnd = () => {
    // setPlayerState(PLAYER_STATES.ENDED);
    setIsScreenTappedOnce(false);
    isFullScreen && onFullScreen();
  };

  const onFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    props.onFullScreen(!isFullScreen);
    if (screenType == 'contain') setScreenType('contain');
    else setScreenType('contain');
  };

  const onSeeking = currentTime => setCurrentTime(currentTime);

  return (
    <View style={globalStyles.flex}>
      <View
        style={[
          {...styles.videoContainer},
          isFullScreen && styles.fullScreenVideo,
        ]}>
        <Video
          controls={true}
          onEnd={onEnd}
          ref={videoPlayer}
          onProgress={onProgress}
          source={{uri: convertToProxyURL(props.source)}}
          // paused={paused}
          onFullScreen={isFullScreen}
          style={[
            {
              borderRadius: wp(4),
            },
            isFullScreen
              ? {
                  height: DEVICE.DEVICE_HEIGHT,
                  width: DEVICE.DEVICE_WIDTH,
                }
              : {
                  aspectRatio: 0.563,
                  width: '100%',
                },
          ]}
          // onBuffer={() => {
          //   setIsBuffering(true);
          //   // playerState === 0 && setIsLoading(true);
          // }}
        />
        {/* <Video
          ref={videoPlayer}
          onEnd={onEnd}
          onLoad={onLoad}
          onProgress={onProgress}
          paused={paused}
          resizeMode={screenType}
          onFullScreen={isFullScreen}
          source={{uri: convertToProxyURL(props.source)}}
          style={[ 
            {
              borderRadius: wp(4),
            },
            isFullScreen
              ? {
                  height: DEVICE.DEVICE_HEIGHT,
                  width: DEVICE.DEVICE_WIDTH,
                }
              : {
                  aspectRatio: 0.563,
                  width: '100%',
                },
          ]}
          onBuffer={() => {
            setIsBuffering(true);
            // playerState === 0 && setIsLoading(true);
          }}
          ignoreSilentSwitch={'ignore'}
        /> */}
        {/* <MediaControls
          isFullScreenVideo={isFullScreen}
          playButtonText={props.playButtonText}
          duration={duration}
          isLoading={isLoading}
          mainColor="#333"
          onFullScreen={onFullScreen}
          onPaused={onPaused}
          onReplay={onReplay}
          // onSeek={onSeek}
          // onSeeking={onSeeking}
          playerState={playerState}
          progress={currentTime}
          isScreenTappedOnce={isScreenTappedOnce}
          appState={appState}
          isVideoPause={isVideoPause}
          onSlidingStart={value => props.onSliderChangeValue(true)}
          onSlidingComplete={value => props.onSliderChangeValue(false)}
        /> */}
      </View>
    </View>
  );
};

export default VideoDemo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
    // width: DEVICE.DEVICE_WIDTH
  },
  videoContainer: {
    backgroundColor: colors.blackBase6,
    borderRadius: wp(3.5),
    // height: hp(55),
    // width: wp(90)
    // aspectRatio: DEVICE.DEVICE_WIDTH / DEVICE.DEVICE_HEIGHT,
    // width: wp(90),
    // aspectRatio: 0.565,
    // width: '100%',
    // overflow:'hidden'
  },
  fullScreenVideo: {
    borderRadius: wp(3.5),
    height: DEVICE.DEVICE_HEIGHT,
    width: DEVICE.DEVICE_WIDTH,
    // position: 'absolute',
    // top: 0,
    // zIndex: 1
  },
});
