//#region import 
//#region RN
import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Image, StyleSheet, ActivityIndicator, Animated } from 'react-native';
//#endregion
//#region third party libs
import ImageSlider from 'react-native-image-slider';
import AutoHeightImage from 'react-native-auto-height-image';
import Sound from 'react-native-sound';
import convertToProxyURL from 'react-native-video-cache';
import Video from 'react-native-video';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import * as actions from "../../redux/actions/courseActions";
//#endregion
//#region common files
import Util from '../../utils/utils';
import { image_videos_base_url } from "../../apiHelper/APIs.json";
import globalStyles from '../../res/globalStyles';
import { DEVICE, DEVICE_OS, hp, wp } from '../../utils/constants';
import { images } from '../../res/images';
import { colors } from '../../res/colors';
import { Spacer } from '../../res/spacer';
import { fonts } from '../../res/fonts';
import VideoDemo from './videoDemo';
import OnBackPressed from '../../components/OnBackPressed';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
//#endregion
//#endregion
let moveLetter1Animation = new Animated.ValueXY({ x: 0, y: 0 });
let moveLetter2Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 });
let moveNumber1Animation = new Animated.ValueXY({ x: 0, y: 0 });
let moveNumber2Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 });
global.isStartKeyTraining = false;
export default KeyTraining = (Props) => {
    const props = Props.props;
    //#region redux
    const dispatch = useDispatch();
    const authReducers = useSelector(state => state.authReducers);
    const courseReducers = useSelector(state => state.courseReducers);
    const settingsReducers = useSelector(state => state.settingsReducers);
    //#endregion redux
    //#region local state    
    const [isShowTheKey, setIsShowTheKey] = useState(false);
    const [currentLetterSlider, setCurrentLetterSlider] = useState(0);
    const [currentLetter2Slider, setCurrentLetter2Slider] = useState(1);

    const [currentNumberSlider, setCurrentNumberSlider] = useState(0);
    const [currentMajorNumberSlider, setCurrentMajorNumberSlider] = useState(0);

    const [currentNumber2Slider, setCurrentNumber2Slider] = useState(1);
    const [currentMajorNumber2Slider, setCurrentMajorNumber2Slider] = useState(1);

    const [isLetterAnimated, setIsLetterAnimated] = useState(true);
    const [isDoneBtnClicked, setIsDoneBtnClicked] = useState(false);
    const [isMinorLetter, setIsMinorLetter] = useState(false);
    const [isMinor2Letter, setIsMinor2Letter] = useState(false);
    const [staticNumbersIndex, setStaticNumbersIndex] = useState({ majorIndex: 0, minorIndex: 0 });
    const [lettersArray, setLettersArray] = useState([]);
    const [majorArray, setMajorArray] = useState([]);
    const [minorArray, setMinorArray] = useState([]);
    //#endregion local state  
    //#region ref

    //#endregion ref 
    //#region local functions
    useEffect(() => {
        courseReducers?.selectedCourseItem?.minorKeys && setMinorArray(Util.keyShuffleArray(courseReducers?.selectedCourseItem?.minorKeys));
        courseReducers?.selectedCourseItem?.majorKeys && setMajorArray(Util.keyShuffleArray(courseReducers?.selectedCourseItem?.majorKeys));

        // let randomIndex = courseReducers.selectedLetters.length >= 2 ? Math.floor((Math.random() * (courseReducers?.selectedLetters?.length - 1)) + 1) : 0;
        // // setCurrentLetterSlider(randomIndex);

        // courseReducers?.selectedLetters[randomIndex]?.type === 0 ? (setCurrentNumberSlider(Math.floor((Math.random() * (courseReducers?.selectedCourseItem?.majorKeys?.length - 1)) + 1)), setIsMinorLetter(false)) :
        //     (setCurrentNumberSlider(Math.floor((Math.random() * (courseReducers?.selectedCourseItem?.minorKeys?.length - 1)) + 1)), setIsMinorLetter(true));

        // if (courseReducers.selectedTrainingIndex === 1) {
        //     setStaticNumbersIndex({
        //         majorIndex: Math.floor((Math.random() * (courseReducers?.selectedCourseItem?.majorKeys?.length - 1)) + 1),
        //         minorIndex: Math.floor((Math.random() * (courseReducers?.selectedCourseItem?.minorKeys?.length - 1)) + 1)
        //     });
        // }

    }, [courseReducers.selectedLetters]);

    useEffect(() => {
        if (courseReducers?.selectedLetters) {
            // let randomLetters = Util.keyShuffleArray(courseReducers?.selectedLetters);
            // setLettersArray(randomLetters);
            // setCurrentLetterSlider(0);
            // setCurrentLetter2Slider(1);
            onManageRandomArray(0, 0);
        }
    }, [global.isStartKeyTraining]);
    //#endregion local functions

    const onManageRandomArray = (aSlider, bSlider) => {
        let randomLetters = Util.keyShuffleArray(courseReducers?.selectedLetters);
        setLettersArray(randomLetters);
        setTimeout(() => {
            setCurrentLetterSlider(aSlider);
            setCurrentLetter2Slider(bSlider);
            randomLetters[aSlider]?.type === 0 ? setIsMinorLetter(false) : setIsMinorLetter(true);
            randomLetters[bSlider]?.type === 0 ? setIsMinor2Letter(false) : setIsMinor2Letter(true);

        }, 500);
    }

    const onHandleSliders = () => {
        let isIsLetterArrayUpdated = false;

        //#region conditions
        let letterCondition = lettersArray?.length >= 2;
        let numberMinorCondition = minorArray?.length >= 2;
        let numberMajorCondition = majorArray?.length >= 2;
        let trainingIndexCondition = courseReducers.selectedTrainingIndex === 1;
        //#endregion conditions
        setIsDoneBtnClicked(true);
        // let randomIndex = letterCondition ? Math.floor((Math.random() * lettersArrayLength)) : 0;

        if (isLetterAnimated) {
            let index = letterCondition ? (currentLetterSlider + 1) : 0;
            //#region condition for first slider
            if (letterCondition) {
                // setCurrentLetter2Slider(randomIndex);
                if (index === lettersArray.length) {
                    isIsLetterArrayUpdated = true;
                    // global.isStartKeyTraining = !global.isStartKeyTraining;
                    let previousLetter = lettersArray[currentLetterSlider].title;
                    let randomLetters = Util.keyShuffleArray(courseReducers?.selectedLetters);
                    var breakException = {};
                    try {
                        randomLetters.forEach((element, i) => {
                            if (previousLetter === element.title) {
                                setCurrentLetterSlider(i);
                                element.type === 0 ? setIsMinorLetter(false) : setIsMinorLetter(true);
                                throw breakException;
                            }
                        });
                    } catch (e) {
                        if (e !== breakException) throw e;
                    }
                    setLettersArray(randomLetters);
                    setCurrentLetter2Slider(0);
                    randomLetters[0]?.type === 0 ? setIsMinor2Letter(false) : setIsMinor2Letter(true);
                } else setCurrentLetter2Slider(index);

            }
            //#region minor/major images for the first slider
            if (lettersArray[isIsLetterArrayUpdated ? 0 : index === lettersArray.length ? 0 : index].type === 1) {
                let numberIndex = trainingIndexCondition ? 0 : (numberMinorCondition ? currentNumberSlider + 1 : 0);
                setIsMinor2Letter(true);
                if (numberIndex === minorArray.length) {
                    let previousNumber = minorArray[currentNumberSlider].id;
                    let randomNumbers = Util.keyShuffleArray(courseReducers?.selectedCourseItem?.minorKeys);
                    var breakException = {};
                    try {
                        randomNumbers.forEach((element, i) => {
                            if (previousNumber === element.id) {
                                setCurrentNumberSlider(i);
                                trainingIndexCondition && (setIsMinor2Letter(true), setCurrentNumber2Slider(0));
                                throw breakException;
                            }
                        });
                    } catch (e) {
                        if (e !== breakException) throw e;
                    }
                    setMinorArray(randomNumbers);
                    // setTimeout(() => {
                    setCurrentNumber2Slider(0);
                    trainingIndexCondition && (setIsMinorLetter(true), setCurrentNumberSlider(0));
                    // }, 500);
                } else {
                    setCurrentNumber2Slider(isIsLetterArrayUpdated ? 0 : numberIndex);
                    trainingIndexCondition && (setIsMinorLetter(true), setCurrentNumberSlider(isIsLetterArrayUpdated ? 0 : numberIndex));
                }
            } else {
                let numberIndex = trainingIndexCondition ? 0 : (numberMajorCondition ? currentMajorNumberSlider + 1 : 0);
                setIsMinor2Letter(false);
                if (numberIndex === majorArray.length) {
                    let previousNumber = majorArray[currentMajorNumberSlider].id;
                    let randomNumbers = Util.keyShuffleArray(courseReducers?.selectedCourseItem?.majorKeys);
                    var breakException = {};
                    try {
                        randomNumbers.forEach((element, i) => {
                            if (previousNumber === element.id) {
                                setCurrentMajorNumberSlider(i);
                                trainingIndexCondition && (setIsMinor2Letter(true), setCurrentMajorNumber2Slider(0));
                                throw breakException;
                            }
                        });
                    } catch (e) {
                        if (e !== breakException) throw e;
                    }
                    setMajorArray(randomNumbers);
                    // setTimeout(() => {
                    setCurrentMajorNumber2Slider(0);
                    trainingIndexCondition && (setIsMinorLetter(false), setCurrentMajorNumberSlider(0));
                    // }, 500);
                } else {
                    setCurrentMajorNumber2Slider(isIsLetterArrayUpdated ? 0 : numberIndex);
                    trainingIndexCondition && (setIsMinorLetter(false), setCurrentMajorNumberSlider(isIsLetterArrayUpdated ? 0 : numberIndex));
                }
            }
            setTimeout(() => {
                if (letterCondition) {
                    Util.slideLeftAnim(moveLetter1Animation, -DEVICE.DEVICE_WIDTH);
                    Util.slideLeftAnim(moveLetter2Animation, 0);
                }
                if (!trainingIndexCondition) {
                    Util.slideLeftAnim(moveNumber1Animation, -DEVICE.DEVICE_WIDTH);
                    Util.slideLeftAnim(moveNumber2Animation, 0);
                }
                setIsLetterAnimated(false);
                setTimeout(() => {
                    setIsDoneBtnClicked(false);
                    letterCondition && (moveLetter1Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 }));
                    !trainingIndexCondition && (moveNumber1Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 }));
                }, 500);
            }, isIsLetterArrayUpdated ? 500 : 200);
            // if (courseReducers?.selectedLetters[randomIndex].type === 1) {
            //     let randomMinor = trainingIndexCondition ? staticNumbersIndex.minorIndex : (numberMinorCondition ? Math.floor((Math.random() * minorArrayLength)) : 0);
            //     setIsMinor2Letter(true);
            //     setCurrentNumber2Slider(randomMinor);
            //     trainingIndexCondition && (setIsMinorLetter(true), setCurrentNumberSlider(randomMinor));
            // } else {
            //     Math.floor((Math.random() * 10) + 1);
            //     let randomMajor = trainingIndexCondition ? staticNumbersIndex.majorIndex : (numberMajorCondition ? Math.floor((Math.random() * majorArrayLength)) : 0);
            //     setIsMinor2Letter(false);
            //     setCurrentNumber2Slider(randomMajor);
            //     trainingIndexCondition && (setIsMinorLetter(false), setCurrentNumberSlider(randomMajor));
            // }
            // if (!trainingIndexCondition) {
            //     Util.slideLeftAnim(moveNumber1Animation, -DEVICE.DEVICE_WIDTH);
            //     Util.slideLeftAnim(moveNumber2Animation, 0);
            // }
            // setTimeout(() => {
            //     setIsLetterAnimated(false);
            //     setIsDoneBtnClicked(false);
            //     letterCondition && (moveLetter1Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 }));
            //     !trainingIndexCondition && (moveNumber1Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 }));
            // }, 200);
            //#endregion minor/major images for the first slider
            //#endregion condition for first slider
        } else {
            let index = letterCondition ? (currentLetter2Slider + 1) : 0;
            //#region condition for second slider
            if (letterCondition) {
                if (index === lettersArray.length) {
                    isIsLetterArrayUpdated = true;
                    let previousLetter = lettersArray[currentLetter2Slider].title;
                    let randomLetters = Util.keyShuffleArray(courseReducers?.selectedLetters);
                    var breakException = {};
                    try {
                        randomLetters.forEach((element, i) => {
                            if (previousLetter === element.title) {
                                setCurrentLetter2Slider(i);
                                element.type === 0 ? setIsMinor2Letter(false) : setIsMinor2Letter(true);
                                throw breakException;
                            }
                        });
                    } catch (e) {
                        if (e !== breakException) throw e;
                    }
                    setLettersArray(randomLetters);
                    setCurrentLetterSlider(0);
                    randomLetters[0]?.type === 0 ? setIsMinorLetter(false) : setIsMinorLetter(true);
                } else setCurrentLetterSlider(index);

            }
            //#region minor/major images for the second slider
            if (lettersArray[isIsLetterArrayUpdated ? 0 : index === lettersArray.length ? 0 : index].type === 1) {
                let numberIndex = trainingIndexCondition ? 0 : (numberMinorCondition ? currentNumber2Slider + 1 : 0);
                setIsMinorLetter(true);
                if (numberIndex === minorArray.length) {
                    let previousNumber = minorArray[currentNumber2Slider].id;
                    let randomNumbers = Util.keyShuffleArray(courseReducers?.selectedCourseItem?.minorKeys);
                    var breakException = {};
                    try {
                        randomNumbers.forEach((element, i) => {
                            if (previousNumber === element.id) {
                                setCurrentNumber2Slider(i);
                                trainingIndexCondition && (setIsMinorLetter(true), setCurrentNumberSlider(0));
                                throw breakException;
                            }
                        });
                    } catch (e) {
                        if (e !== breakException) throw e;
                    }
                    setMinorArray(randomNumbers);
                    // setTimeout(() => {
                    setCurrentNumberSlider(0);
                    trainingIndexCondition && (setIsMinor2Letter(true), setCurrentNumber2Slider(0));
                    // }, 500);
                } else {
                    setCurrentNumberSlider(isIsLetterArrayUpdated ? 0 : numberIndex);
                    trainingIndexCondition && (setIsMinor2Letter(true), setCurrentNumber2Slider(isIsLetterArrayUpdated ? 0 : numberIndex));
                }
            } else {
                let numberIndex = trainingIndexCondition ? 0 : (numberMajorCondition ? currentMajorNumber2Slider + 1 : 0);
                setIsMinorLetter(false);
                if (numberIndex === majorArray.length) {
                    let previousNumber = majorArray[currentMajorNumber2Slider].id;
                    let randomNumbers = Util.keyShuffleArray(courseReducers?.selectedCourseItem?.majorKeys);
                    var breakException = {};
                    try {
                        randomNumbers.forEach((element, i) => {
                            if (previousNumber === element.id) {
                                setCurrentMajorNumber2Slider(i);
                                trainingIndexCondition && (setIsMinorLetter(true), setCurrentMajorNumberSlider(0));
                                throw breakException;
                            }
                        });
                    } catch (e) {
                        if (e !== breakException) throw e;
                    }
                    setMajorArray(randomNumbers);
                    // setTimeout(() => {
                    setCurrentMajorNumberSlider(0);
                    trainingIndexCondition && (setIsMinor2Letter(false), setCurrentMajorNumber2Slider(0));
                    // }, 500);
                } else {
                    setCurrentMajorNumberSlider(isIsLetterArrayUpdated ? 0 : numberIndex);
                    trainingIndexCondition && (setIsMinor2Letter(false), setCurrentMajorNumber2Slider(isIsLetterArrayUpdated ? 0 : numberIndex));
                }
            }
            setTimeout(() => {
                if (letterCondition) {
                    Util.slideLeftAnim(moveLetter2Animation, -DEVICE.DEVICE_WIDTH);
                    Util.slideLeftAnim(moveLetter1Animation, 0);
                }
                if (!trainingIndexCondition) {
                    Util.slideLeftAnim(moveNumber2Animation, -DEVICE.DEVICE_WIDTH);
                    Util.slideLeftAnim(moveNumber1Animation, 0);
                }
                setIsLetterAnimated(true);
                setTimeout(() => {

                    setIsDoneBtnClicked(false);
                    letterCondition && (moveLetter2Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 }));
                    !trainingIndexCondition && (moveNumber2Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 }));
                }, 500);
            }, isIsLetterArrayUpdated ? 500 : 200);
            // if (courseReducers?.selectedLetters[randomIndex].type === 1) {
            //     let randomMinor = trainingIndexCondition ? staticNumbersIndex.minorIndex : (numberMinorCondition ? Math.floor((Math.random() * minorArrayLength)) : 0);
            //     setIsMinorLetter(true);
            //     setCurrentNumberSlider(randomMinor);
            //     trainingIndexCondition && (setIsMinor2Letter(true), setCurrentNumber2Slider(randomMinor));
            // } else {
            //     let randomMajor = trainingIndexCondition ? staticNumbersIndex.majorIndex : (numberMajorCondition ? Math.floor((Math.random() * majorArrayLength)) : 0);
            //     setIsMinorLetter(false);
            //     setCurrentNumberSlider(randomMajor);
            //     trainingIndexCondition && (setIsMinor2Letter(false), setCurrentNumber2Slider(randomMajor));
            // }
            // if (!trainingIndexCondition) {
            //     Util.slideLeftAnim(moveNumber2Animation, -DEVICE.DEVICE_WIDTH);
            //     Util.slideLeftAnim(moveNumber1Animation, 0);
            // }
            // setTimeout(() => {
            //     setIsLetterAnimated(true);
            //     setIsDoneBtnClicked(false);
            //     letterCondition && (moveLetter2Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 }));
            //     !trainingIndexCondition && (moveNumber2Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 }));
            // }, 200);
            //#endregion
            //#region minor/major images for the second slider
            //#endregion condition for second slider
        }
    }

    return (
        <View style={{ ...globalStyles.flex, width: DEVICE.DEVICE_WIDTH, height: DEVICE.DEVICE_HEIGHT }}>
            <OnBackPressed onBackPressed={() => {
                // Props.onBack();
            }} />
            <View style={{ flex: 1.2 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <>
                        <View style={[styles.sliderContainer, { ...globalStyles.paddingTop1, top: -wp(2) }]}>
                            <Image style={[globalStyles.img, { height: wp("16%"), width: wp("16%") }]} source={images.lessonTitleIcon} />
                            <Spacer space={wp(2)} />
                            <View style={{ width: wp(85) }}>
                                <Text style={{ ...globalStyles.textHome, fontSize: wp(4.8), color: colors.white }}>{courseReducers.trainingTypes[courseReducers.selectedTrainingIndex].title}</Text>
                                <Spacer space={wp(1.5)} />
                                <Text style={{ ...globalStyles.textHome, ...styles.italicTxt }}>Play the numbers, using the notes from the key. You can play only the bass, only the chords, or both…</Text>
                            </View>
                            <Spacer space={wp(6)} />
                            <View style={{ alignItems: 'center', width: wp(100) }}>
                                {courseReducers.selectedLetters.length !== 0 &&
                                    <>
                                        <Animated.View style={moveLetter1Animation.getLayout()}>
                                            <View style={styles.trainingTabsBtns}>
                                                <Text style={{ ...globalStyles.textHome, color: colors.white, fontSize: wp(7), textAlign: 'center' }}>{lettersArray[currentLetterSlider]?.title}</Text>
                                            </View>
                                        </Animated.View>
                                        <Animated.View style={[moveLetter2Animation.getLayout(), { position: 'absolute', width: wp(100) }]}>
                                            <View style={styles.trainingTabsBtns}>
                                                <Text style={{ ...globalStyles.textHome, color: colors.white, fontSize: wp(7), textAlign: 'center' }}>{lettersArray[currentLetter2Slider]?.title}</Text>
                                            </View>
                                        </Animated.View>
                                    </>}
                                <Spacer space={wp(3)} />
                                {courseReducers.selectedCourseItem.unlimited_key_training === '1' &&
                                    <View>
                                        <Animated.View style={moveNumber1Animation.getLayout()}>
                                            <AutoHeightImage width={wp(90)} source={{ uri: `${image_videos_base_url}${isMinorLetter ? minorArray[currentNumberSlider]?.media : majorArray[currentMajorNumberSlider]?.media}` }} style={{ alignSelf: 'center' }} />
                                        </Animated.View>
                                        <Animated.View style={[moveNumber2Animation.getLayout(), { position: 'absolute' }]}>
                                            <AutoHeightImage width={wp(90)} source={{ uri: `${image_videos_base_url}${isMinor2Letter ? minorArray[currentNumber2Slider]?.media : majorArray[currentMajorNumber2Slider]?.media}` }} style={{ alignSelf: 'center' }} />
                                        </Animated.View>
                                    </View>}
                                <Spacer space={wp(6)} />
                                <TouchableOpacity disabled={isDoneBtnClicked} onPress={() => {
                                    Util.onHapticFeedback();
                                    isShowTheKey && setIsShowTheKey(false);
                                    onHandleSliders();
                                }}>
                                    <AutoHeightImage source={(isLetterAnimated && isMinorLetter) ? images.doneNxtO : (!isLetterAnimated && isMinor2Letter) ? images.doneNxtO : images.doneNxt} width={wp(80)} />
                                </TouchableOpacity>
                                <Spacer space={wp(8)} />
                                <TouchableOpacity style={styles.showKeyContainer} onPress={() => {
                                    Util.onHapticFeedback();
                                    setIsShowTheKey(!isShowTheKey);
                                }}>
                                    <Text style={{ ...globalStyles.textHome, ...styles.italicTxt, color: colors.grayBold }}>{isShowTheKey ? 'Hide' : 'Show'} the answer</Text>
                                    <Spacer row={wp(1)} />
                                    <AutoHeightImage source={images.keyDown} width={wp(4)} style={[{ marginTop: wp('1') }, isShowTheKey && { transform: [{ rotate: '180deg' }] }]} />
                                </TouchableOpacity>
                                {isShowTheKey && <>
                                    <Spacer space={wp(4)} />
                                    {/* <AutoHeightImage width={wp(80)} source={images[`${isLetterAnimated ? courseReducers?.selectedLetters[currentLetterSlider]?.title : courseReducers?.selectedLetters[currentLetter2Slider]?.title}_piano`]} /> */}
                                    {/* <AutoHeightImage width={wp(80)} source={images[`${isLetterAnimated ? courseReducers?.selectedLetters[currentLetterSlider]?.title : courseReducers?.selectedLetters[currentLetter2Slider]?.title}_piano`]} /> */}

                                    <Image source={images[`${isLetterAnimated ? lettersArray[currentLetterSlider]?.title : lettersArray[currentLetter2Slider]?.title}_piano`]} style={{ ...globalStyles.img, width: wp(82), height: wp(22), resizeMode: 'stretch' }} />
                                    <Spacer space={wp(5)} />
                                </>}
                            </View>
                        </View>
                    </>
                </ScrollView>
            </View>
            <View style={styles.endBtnContainer}>
                <TouchableOpacity onPress={() => {
                    Util.onHapticFeedback();
                    Props.onBack();
                    setTimeout(() => {
                        setIsShowTheKey(false);
                        setCurrentLetterSlider(0);
                        setCurrentLetter2Slider(0);
                        setCurrentNumberSlider(0);
                        setCurrentMajorNumberSlider(0);
                        setCurrentNumber2Slider(0);
                        setCurrentMajorNumber2Slider(0);
                        setIsLetterAnimated(true);
                        setIsMinorLetter(false);
                        setIsMinor2Letter(false);
                        setStaticNumbersIndex({ majorIndex: 0, minorIndex: 0 });
                        moveLetter1Animation = new Animated.ValueXY({ x: 0, y: 0 });
                        moveLetter2Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 });
                        moveNumber1Animation = new Animated.ValueXY({ x: 0, y: 0 });
                        moveNumber2Animation = new Animated.ValueXY({ x: DEVICE.DEVICE_WIDTH, y: 0 });
                    }, 500);
                }}>
                    <AutoHeightImage source={images.endTraining} width={wp(40)} />
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    sliderContainer: {
        alignItems: 'center',
        width: DEVICE.DEVICE_WIDTH
    },
    italicTxt: {
        fontFamily: fonts.FM,
        color: colors.grayDark4,
        fontStyle: 'italic',
        fontWeight: 'normal',
        fontSize: wp(4.1),
        lineHeight: wp(5.5)
    },
    endBtnContainer: {
        width: wp(100),
        flex: 0.16,
        alignItems: 'center',
        justifyContent: 'flex-start',
        // marginBottom: wp(4),
        // backgroundColor: 'red',
        paddingTop: wp(3)
    },
    showKeyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trainingTabsBtns: {
        padding: wp(0.3),
        paddingLeft: DEVICE_OS === 'android' ? wp(2) : wp(2.8),
        paddingRight: DEVICE_OS === 'android' ? wp(2) : wp(2.8),
        paddingTop: DEVICE_OS === 'android' ? wp(1) : 0,
        backgroundColor: colors.blackBase8,
        borderRadius: wp(2),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'center'
    },
});