//#region import
//#region RN
import React, {useState, useEffect, useRef} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Modal} from 'react-native';
//#endregion
//#region common files
import globalStyles from '../res/globalStyles';
import {hp, wp} from '../utils/constants';
import {colors} from '../res/colors';
import {fonts} from '../res/fonts';
import {Spacer} from '../res/spacer';
import {getBottomSpace, isIphoneX} from 'react-native-iphone-x-helper';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../redux/actions/settingsAction';
import AutoHeightImage from 'react-native-auto-height-image';
import {images} from '../res/images';
import Util from '../utils/utils';
//#endregion
//#endregion

export const IAPModal = props => {
  //#region redux
  const dispatch = useDispatch();
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  return (
    <Modal
      animationType="fade"
      // visible={settingsReducers.isIapModal}>
      visible={props.isIapModal}>
      <View style={styles.container}>
        <AutoHeightImage width={wp(80)} source={images.welcome} />
        <TouchableOpacity
          style={styles.beginBtn}
          onPress={() => {
            Util.onHapticFeedback();
            props.onBeginClicked();
            // dispatch(actions.onIAPModalVisibility(!settingsReducers.isIapModal));
          }}>
          <AutoHeightImage width={wp(80)} source={images.begin} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: colors.creamBase1,
    flex: 1,
    alignItems: 'center',
  },
  beginBtn: {
    position: 'absolute',
    bottom: isIphoneX() ? getBottomSpace() + wp(5) : wp(12),
  },
});
