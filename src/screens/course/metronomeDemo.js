// //#region import 
// //#region RN
// import React, { useState, useEffect } from 'react';
// import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
// //#endregion
// //#region third party libs
// import AutoHeightImage from 'react-native-auto-height-image';
// import Sound from 'react-native-sound';
// //#endregion
// //#region redux
// import { useSelector, useDispatch } from 'react-redux';
// //#endregion
// //#region common files
// import Util from '../../utils/utils';
// import globalStyles from '../../res/globalStyles';
// import { wp } from '../../utils/constants';
// import { images } from '../../res/images';
// import { colors } from '../../res/colors';
// //#endregion
// //#endregion

// export default MetronomeDemo = (props) => {
//     //#region redux
//     const dispatch = useDispatch();
//     const authReducers = useSelector(state => state.authReducers);
//     const courseReducers = useSelector(state => state.courseReducers);
//     const settingsReducers = useSelector(state => state.settingsReducers);
//     //#endregion redux
//     //#region local state        
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [isPause, setIsPause] = useState(false);
//     const [currentBpm, setCurrentBpm] = useState(80);
//     const [bpmData, setBpmData] = useState([
//         { icon: images.grayLessFive, isTapped: false, type: 'LF' },
//         { icon: images.grayLessOne, isTapped: false, type: 'LO' },
//         { icon: images.greenMoreOne, isTapped: false, type: 'MO' },
//         { icon: images.greenMoreFive, isTapped: false, type: 'MF' },
//     ]);
//     //#endregion local state  
//     //#region ref
//     Sound.setCategory('Playback');
//     var beep = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
//         if (error) {
//             console.log('failed to load the sound', error);
//             return;
//         }
//         // console.log('duration in seconds: ' + beep.getDuration() + 'number of channels: ' + beep.getNumberOfChannels())
//     });
//     var higherBeep = new Sound('beeps.mp3', Sound.MAIN_BUNDLE, (error) => {
//         if (error) {
//             return;
//         }
//     });
//     //#endregion ref 
//     //#region local functions
//     useEffect(() => {
//         beep.setVolume(1);
//         return () => {
//             beep.release();
//         };
//     }, []);
//     useEffect(() => {
//         let interval = null;
//         if (isPlaying) {
//             interval = setInterval(() => {
//                 beep.play();
//             }, Math.round(60000 / currentBpm));
//         } else if (!isPlaying) {
//             clearInterval(interval);
//         }
//         return () => clearInterval(interval);
//     }, [isPlaying]);
//     //#endregion local functions
//     return (
//         <View style={{ ...globalStyles.flex, justifyContent: 'center' }}>
//             {/* <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: wp(90) }}>
//                 <TouchableOpacity onPress={() => {
//                     if ((currentBpm - 5) >= 40) {
//                         setIsPlaying(!isPlaying);
//                         setCurrentBpm(currentBpm - 5);
//                         setTimeout(() => {
//                             setIsPlaying(true);
//                         }, 100);
//                     }
//                 }}>
//                     <Text style={{ color: colors.white, fontSize: wp(6), fontFamily: fonts.FM }}>-5</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
//                     <Text style={{ color: colors.white, fontSize: wp(6), fontFamily: fonts.FM }}>{!isPlaying ? 'Metronome' : 'Pause'}</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => {
//                     if ((currentBpm + 5) <= 250) {
//                         setIsPlaying(!isPlaying);
//                         setCurrentBpm(currentBpm + 5);
//                         setTimeout(() => {
//                             setIsPlaying(true);
//                         }, 100);
//                     }
//                 }}>
//                     <Text style={{ color: colors.white, fontSize: wp(6), fontFamily: fonts.FM }}>+5</Text>
//                 </TouchableOpacity>
//             </View> */}

//             <AutoHeightImage width={wp(90)} source={images.bpmBackground}>
//                 <View style={styles.bpmMainContainer}>
//                     <View style={styles.bpmContainer}>
//                         {bpmData.map((item, index) => {
//                             return (
//                                 <TouchableOpacity onPress={() => {
//                                     !item.isTapped && (item.isTapped = true);
//                                     if (item.type === 'LF' || item.type === 'LO') {
//                                         if ((currentBpm - (item.type === 'LF' ? 5 : 1)) >= 40) {
//                                             setIsPlaying(!isPlaying);
//                                             setCurrentBpm(currentBpm - (item.type === 'LF' ? 5 : 1));
//                                             setTimeout(() => {
//                                                 setIsPlaying(true);
//                                             }, 100);
//                                         }
//                                     } else if (item.type === 'MF' || item.type === 'MO') {
//                                         if ((currentBpm + (item.type === 'MF' ? 5 : 1)) <= 250) {
//                                             setIsPlaying(!isPlaying);
//                                             setCurrentBpm(currentBpm + (item.type === 'MF' ? 5 : 1));
//                                             setTimeout(() => {
//                                                 setIsPlaying(true);
//                                             }, 100);
//                                         }
//                                     }
//                                 }} disabled={item.type === 'LF' ? (currentBpm - 5) < 40 : item.type === 'LO' ? (currentBpm - 1) < 40 : item.type === 'MF' ? (currentBpm + 5) > 250 : (currentBpm + 1) > 250}>
//                                     {/* <AutoHeightImage width={wp(16)} source={item.isTapped ?
//                                         (item.type === 'LF' ? images.greenLessFive :
//                                             item.type === 'LO' ? images.greenLessOne :
//                                                 item.type === 'MO' ? images.greenMoreOne :
//                                                     images.greenMoreFive) :
//                                         item.icon} /> */}
//                                     <AutoHeightImage width={wp(16)} source={item.icon} />
//                                 </TouchableOpacity>
//                             )
//                         })}
//                     </View>
//                     <Text style={{ ...globalStyles.textHome, fontSize: wp(20), textAlign: 'center' }}>{currentBpm}<Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: colors.grayDark, alignSelf: 'flex-end' }}>bpm</Text></Text>
//                     <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => {
//                         Util.onHapticFeedback();
//                         setIsPlaying(!isPlaying);
//                         setIsPause(!isPlaying);
//                     }}>
//                         <AutoHeightImage width={wp(74)} source={!isPause ? images.play : images.pause} />
//                     </TouchableOpacity>
//                 </View>
//             </AutoHeightImage>
//         </View>
//     );
// };
// const styles = StyleSheet.create({
//     bpmMainContainer: {
//         padding: wp(5),
//         paddingTop: wp(6),
//         paddingBottom: wp(6),
//         flex: 1,
//         justifyContent: 'space-between'
//     },
//     bpmContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-evenly'
//     }
// });

//#region import 
//#region RN
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
//#endregion
//#region third party libs
import AutoHeightImage from 'react-native-auto-height-image';
import Sound from 'react-native-sound';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as actions from "../../redux/actions/courseActions";
//#endregion
//#region common files
import Util from '../../utils/utils';
import globalStyles from '../../res/globalStyles';
import { DEVICE_OS, wp } from '../../utils/constants';
import { images } from '../../res/images';
import { colors } from '../../res/colors';
//#endregion
//#endregion

export default metronomeDemo = (props) => {
    //#region redux
    const dispatch = useDispatch();
    const authReducers = useSelector(state => state.authReducers);
    const courseReducers = useSelector(state => state.courseReducers);
    const settingsReducers = useSelector(state => state.settingsReducers);
    //#endregion redux
    //#region local state        
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayingSong, setIsPlayingSong] = useState(false);
    const [isPause, setIsPause] = useState(false);
    const [currentBpm, setCurrentBpm] = useState(80);
    const [sound, setSound] = useState();
    const [bpmData, setBpmData] = useState([
        { icon: images.grayLessFive, isTapped: false, type: 'LF' },
        { icon: images.grayLessOne, isTapped: false, type: 'LO' },
        { icon: images.greenMoreOne, isTapped: false, type: 'MO' },
        { icon: images.greenMoreFive, isTapped: false, type: 'MF' },
    ]);
    const [metronomeTimeout, setMetronomeTimeout] = useState(false);
    //#endregion local state  
    //#region ref
    const audioRef = useRef();
    Sound.setCategory('Playback', false);
    var beep = new Sound('lowqualityl.mp3', Sound.MAIN_BUNDLE, (error) => {
        // var beep = new Sound(DEVICE_OS === 'android' ? 'beep_demo.mp3' : 'beep.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
    });
    var higherBeep = new Sound(DEVICE_OS === 'android' ? 'lowqualityfh.mp3' : 'higherBeep.mp3', Sound.MAIN_BUNDLE, (error) => {
        // var higherBeep = new Sound(DEVICE_OS === 'android' ? 'beep_demo.mp3' : 'higherBeep.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
            return;
        }
    });
    //#endregion ref 
    //#region local functions
    useEffect(() => {
        beep.setVolume(1);
        // return () => {
        //     beep.release();
        // };
    }, []);
    // useEffect(() => {
    //     courseReducers?.selectedPatternItem?.bpm_detail !== undefined && setCurrentBpm(Number(courseReducers?.selectedPatternItem?.bpm_detail));
    // }, [courseReducers?.selectedPatternItem, courseReducers?.selectedCourseItem]);
    // useEffect(() => {

    //     // console.log("2nd useEffect");
    //     // console.log("props.isLessons :", props.isLessons);
    //     console.log("props.currentSlider :", props.currentSlider);
    //     console.log("courseReducers?.selectedCourseItem?.chapter[props.currentSlider]?.chapter_detail : ", courseReducers?.selectedCourseItem?.chapter);
    //     if (props.isLessons) {
    //         var bpmBreakException = {};
    //         try {
    //             courseReducers?.selectedCourseItem?.chapter[props.currentSlider]?.chapter_detail.forEach(element => {
    //                 console.log("element : ", element);
    //                 if (element.type === 'metronome') {
    //                     console.log("element.type : ", element.type);
    //                     console.log("setCurrentBpm : ", Number(element.chapter_bpm));
    //                     setCurrentBpm(Number(element.chapter_bpm));
    //                     throw bpmBreakException;
    //                 } else {
    //                     console.log("else");
    //                 }
    //             });
    //         } catch (e) {
    //             console.log("e : ", e);
    //             if (e !== bpmBreakException) throw e;
    //         }
    //     }
    // }, [courseReducers?.selectedCourseItem, props.currentSlider]);

    useEffect(() => {
        props.currentBpm !== undefined && setCurrentBpm(Number(props.currentBpm));
    }, [props.currentBpm]);
    useEffect(() => {
        if (props.clearAudio) {
            sound != null && sound.stop();
            setIsPlaying(false);
            setIsPause(false);
            setIsPlayingSong(false);
        }
    }, [props.clearAudio]);

    useEffect(() => {
        // let bpm = props.currentBpm !== undefined ? Number(props.currentBpm) : currentBpm;
        let interval = null;
        let counter = 0;
        if (isPlaying) {
            interval = setInterval(async () => {
                if (counter === 3) {
                    higherBeep.play();
                    // await sounds(higherBeep);
                    counter = 0;
                } else {
                    // beep.play().setSpeed(currentBpm / 60);
                    // await sounds(beep);
                    beep.play();
                    counter++

                }

            }, Math.round((60 / currentBpm) * 1000));
        } else if (!isPlaying) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const sounds = (sound) => {
        sound.play();

    }
    // const onPlaySong = (playing) => {
    //     props.setClearAudio(false);
    //     var stay = new Sound('http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3', null, (error) => {
    //         if (error) {
    //             console.log('failed to load the sound', error);
    //             return;
    //         } else {
    //             if (playing) {
    //                 setSound(stay);
    //                 stay.play()
    //             } else {
    //                 if (sound) sound.stop();
    //             }
    //         }
    //     });
    //     setIsPlayingSong(playing);
    // }
    //#endregion local functions
    return (
        <View style={{ ...globalStyles.flex, justifyContent: 'center', ...props.style }}>
            <AutoHeightImage width={wp(90)} source={images.bpmBackground}>
                <View style={styles.bpmMainContainer}>
                    <View style={styles.bpmContainer}>
                        {bpmData.map((item, index) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    // setMetronomeTimeout(true);                                    
                                    !item.isTapped && (item.isTapped = true);
                                    if (item.type === 'LF' || item.type === 'LO') {
                                        if ((currentBpm - (item.type === 'LF' ? 5 : 1)) >= 40) {
                                            isPause && setIsPlaying(!isPlaying);
                                            setCurrentBpm(currentBpm - (item.type === 'LF' ? 5 : 1));
                                            props.isLessons ?
                                                dispatch(actions.onChapterUpdateBpm(authReducers.userDetails, courseReducers, props.currentSlider, currentBpm - (item.type === 'LF' ? 5 : 1))) :
                                                dispatch(actions.onUpdateBpm(authReducers.userDetails, courseReducers, courseReducers.selectedPatternItem, currentBpm - (item.type === 'LF' ? 5 : 1)));
                                            setTimeout(() => {
                                                // // !isPlaying &&
                                                // higherBeep.play();
                                                isPlaying && higherBeep.play();
                                                isPause && setIsPlaying(true);
                                            }, 500);
                                        }
                                    } else if (item.type === 'MF' || item.type === 'MO') {
                                        if ((currentBpm + (item.type === 'MF' ? 5 : 1)) <= 250) {
                                            isPause && setIsPlaying(!isPlaying);
                                            setCurrentBpm(currentBpm + (item.type === 'MF' ? 5 : 1));
                                            props.isLessons ?
                                                dispatch(actions.onChapterUpdateBpm(authReducers.userDetails, courseReducers, props.currentSlider, currentBpm + (item.type === 'MF' ? 5 : 1))) :
                                                dispatch(actions.onUpdateBpm(authReducers.userDetails, courseReducers, courseReducers.selectedPatternItem, currentBpm + (item.type === 'MF' ? 5 : 1)));
                                            setTimeout(() => {
                                                // // !isPlaying &&
                                                // higherBeep.play();
                                                isPlaying && higherBeep.play();
                                                isPause && setIsPlaying(true);
                                            }, 500);
                                        }
                                    }

                                    // setTimeout(() => {
                                    //     setMetronomeTimeout(false);
                                    // }, 1000);
                                }}
                                // disabled={item.type === 'LF' ? (currentBpm - 5) < 40 : item.type === 'LO' ? (currentBpm - 1) < 40 : item.type === 'MF' ? (currentBpm + 5) > 250 : (currentBpm + 1) > 250}
                                >
                                    {/* }} disabled={metronomeTimeout ? true : item.type === 'LF' ? (currentBpm - 5) < 40 : item.type === 'LO' ? (currentBpm - 1) < 40 : item.type === 'MF' ? (currentBpm + 5) > 250 : (currentBpm + 1) > 250}> */}
                                    {/* <AutoHeightImage width={wp(16)} source={item.isTapped ?
                                        (item.type === 'LF' ? images.greenLessFive :
                                            item.type === 'LO' ? images.greenLessOne :
                                                item.type === 'MO' ? images.greenMoreOne :
                                                    images.greenMoreFive) :
                                        item.icon}></AutoHeightImage> */}
                                    <AutoHeightImage width={wp(16)} source={item.icon} />
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    <Text style={{ ...globalStyles.textHome, fontSize: wp(20), textAlign: 'center' }}>{currentBpm}<Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: colors.grayDark, alignSelf: 'flex-end' }}>bpm</Text></Text>
                    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => {
                        Util.onHapticFeedback();
                        !isPlaying && higherBeep.play()
                        setIsPlaying(!isPlaying);
                        setIsPause(!isPlaying);
                        props.setClearAudio(false);
                    }}>
                        <AutoHeightImage width={wp(74)} source={!isPause ? images.play : images.pause} />
                    </TouchableOpacity>
                </View>
            </AutoHeightImage>
        </View>
    );
};
const styles = StyleSheet.create({
    bpmMainContainer: {
        padding: wp(5),
        paddingTop: wp(6),
        paddingBottom: wp(6),
        flex: 1,
        justifyContent: 'space-between'
    },
    bpmContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
});