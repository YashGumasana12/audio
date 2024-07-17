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
//#endregion

export const AppModal = props => {
  //#region local state
  let isVisible = props.isChildren
    ? props.isVisible
    : props.isModalVisible.visibility;
  const [deleteOptions, setDeleteOptions] = useState([]);
  //#endregion local state
  useEffect(() => {
    !props.isChildren &&
      setDeleteOptions([
        `Remove this ${
          props.isModalVisible.selectedItem.total_song === undefined
            ? 'track from this playlist'
            : 'playlist'
        }?`,
        'Remove',
        'Cancel',
      ]);
  }, [isVisible]);
  return (
    <Modal
      animationType="fade"
      visible={isVisible}
      transparent={true}
      onRequestClose={props.onRequestClose}>
      <View
        style={[
          styles.container,
          props.container,
          props.isChildren && {
            justifyContent: 'flex-start',
            backgroundColor: colors.creamBase1,
          },
        ]}>
        {props.isChildren
          ? props.children
          : deleteOptions.map((data, index) => {
              return (
                <>
                  <TouchableOpacity
                    style={[
                      styles.subContainer,
                      index === deleteOptions.length - 1
                        ? styles.deleteLastIndex
                        : styles.borderWidth,
                      index === 0 && styles.deleteIndex1,
                      index === deleteOptions.length - 2 && styles.deleteIndex0,
                    ]}
                    activeOpacity={0.5}
                    disabled={index === 0}
                    onPress={() =>
                      props.onRequestClose(
                        index === deleteOptions.length - 2 && 'delete',
                      )
                    }>
                    <Text
                      style={[
                        globalStyles.text,
                        styles.deleteOptionTxt,
                        {
                          color:
                            index === deleteOptions.length - 1
                              ? '#4c91f6'
                              : index === deleteOptions.length - 2
                              ? '#e54b4b'
                              : '#a3a3a3',
                          fontSize: index === 0 ? wp('4%') : wp('5%'),
                        },
                      ]}>
                      {data}
                    </Text>
                  </TouchableOpacity>
                </>
              );
            })}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    backgroundColor: colors.blackTransparent,
    flex: 1,
    alignItems: 'center',
  },
  subContainer: {
    backgroundColor: colors.blackBase6,
    paddingTop: wp('5%'),
    padding: wp('2%'),
    paddingBottom: wp('5%'),
    borderRadius: wp('4%'),
    width: wp('95%'),
  },
  deleteIndex0: {
    borderBottomLeftRadius: wp('4%'),
    borderBottomRightRadius: wp('4%'),
    borderBottomWidth: 0,
  },
  deleteIndex1: {
    borderTopRightRadius: wp('4%'),
    borderTopLeftRadius: wp('4%'),
  },
  deleteLastIndex: {
    marginBottom: isIphoneX() ? getBottomSpace() : getBottomSpace() + wp('5%'),
    marginTop: hp('1.2%'),
  },
  borderWidth: {
    borderRadius: 0,
    borderBottomWidth: 1,
    borderColor: colors.Dark_Gray,
  },
  deleteOptionTxt: {
    fontFamily: fonts.FM,
    fontSize: wp('5%'),
    textAlign: 'center',
  },
});
