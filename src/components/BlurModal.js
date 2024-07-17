
//#region import 
//#region RN
import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Modal } from 'react-native';
//#endregion
//#region libs
import { BlurView, VibrancyView } from '@react-native-community/blur';
import ImageSlider from 'react-native-image-slider';
import AutoHeightImage from 'react-native-auto-height-image';
//#endregion
//#region common files
import globalStyles from '../res/globalStyles';
import { DEVICE, DEVICE_OS, hp, wp } from "../utils/constants";
import { colors } from '../res/colors';
import { fonts } from '../res/fonts';
import { Spacer } from '../res/spacer';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import { images } from '../res/images';
import { AppButton } from './AppButton';
//#endregion
//#endregion

export const BlurModal = (props) => {
    const [slider, setSlider] = useState([images.q1, images.q2, images.q3, images.q4]);
    return (
        <Modal
            animationType='fade'
            visible={props.isBlurModalVisible}
            transparent={true}
            onRequestClose={props.onRequestClose}>
            <>
                <BlurView
                    style={styles.absolute}
                    blurType={DEVICE_OS === 'ios' ? "dark" : "dark"}
                    blurAmount={10} />
                {/* <View style={[styles.container, props.container]}> */}
                <View style={styles.absolute}>
                    <ImageSlider
                        style={[{ backgroundColor: colors.TRANS }]}
                        images={slider}
                        position={props.currentPosition}
                        onPositionChanged={(number) => {
                            props.setCurrentPosition(number);
                        }}
                        indicatorStyle={{ marginBottom: DEVICE_OS === 'android' ? wp(4) : wp(8) }}
                        isLessons={true}
                        onChapterCompleted={() => props.onRequestClose()}
                        proStatus={true}
                        customSlide={({ index, item, style, width }) => (
                            <View style={{ ...globalStyles.paddingTop1, top: (index === 0 || index === 1) ? -wp(1) : -wp(2.5), width: DEVICE.DEVICE_WIDTH, alignItems: 'center' }}>
                                {/* <AutoHeightImage width={wp(90)} source={slider[props.isUnAvailableChapter ? props.currentPosition : index]} onLoadEnd={() => props.setIsUnAvailableChapter()} /> */}
                                <AutoHeightImage width={wp(90)} source={slider[index]} style={[props.isUnAvailableChapter && { tintColor: colors.TRANS }]} />
                            </View>
                        )}
                        // courseReducers={courseReducers}
                        isMajorMinor={true}
                        isBlurModal={true}
                    // onStartMajorMinor={() => {
                    //     Props.onStartMajorMinorTraining();
                    // }} 
                    />
                    <View style={{ ...globalStyles.paddingTop1, position: 'absolute', top: 0, left: wp(5) }}>
                        <AppButton
                            img={images.close}
                            imgStyle={{ height: wp(9), width: wp(9) }}
                            onBtnClicked={() => props.onRequestClose()} />
                    </View>
                </View>
            </>
        </Modal>
    )
}
const styles = StyleSheet.create({
    container: {
        // justifyContent: 'flex-end',
        backgroundColor: colors.redBase1,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    absolute: {
        position: 'absolute',
        width: DEVICE.DEVICE_WIDTH,
        height: DEVICE.DEVICE_HEIGHT,
        zIndex: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
