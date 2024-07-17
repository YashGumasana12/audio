//#region import
//#region RN
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
//#endregion
//#region common files
import globalStyles from '../res/globalStyles';
import {DEVICE_OS, hp, wp} from '../utils/constants';
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

export const CourseTimeview = props => {
  //#region redux
  const dispatch = useDispatch();
  const courseReducers = useSelector(state => state.courseReducers);
  //#endregion redux
  const [timeArray, setTimeArray] = useState(props?.time?.split(':'));

  useEffect(() => {
    setTimeArray(props?.time?.split(':'));
  }, [props.time]);
  return (
    <View
      style={[
        styles.container,
        props.isGreen && {backgroundColor: colors.creamBase3},
      ]}>
      <View style={[{...globalStyles.row}]}>
        <View
          style={[
            {
              ...styles.container,
              paddingLeft: wp(2),
              paddingRight: timeArray[2] !== undefined ? wp(1) : wp(1),
            },
            props.isGreen
              ? {backgroundColor: colors.TRANS, paddingLeft: wp(3)}
              : {width: timeArray[2] !== undefined ? wp(26) : wp(18.5)},
          ]}>
          {/* {!props.isGreen ? <Text style={{ ...globalStyles.textHome, fontSize: wp(5) }}>{props.time}</Text>  */}
          {!props.isGreen ? (
            <View style={{...globalStyles.row}}>
              <Text
                style={{...globalStyles.textHome, ...styles.singleTimeDigitTxt}}
                numberOfLines={1}>
                {timeArray[0].charAt(0)}
              </Text>
              <Text
                style={{...globalStyles.textHome, ...styles.singleTimeDigitTxt}}
                numberOfLines={1}>
                {timeArray[0].slice(-1)}
              </Text>
              <Text style={{...globalStyles.textHome, fontSize: wp(5)}}>:</Text>
              <Text
                style={{...globalStyles.textHome, ...styles.singleTimeDigitTxt}}
                numberOfLines={1}>
                {timeArray[1].charAt(0)}
              </Text>
              <Text
                style={{...globalStyles.textHome, ...styles.singleTimeDigitTxt}}
                numberOfLines={1}>
                {timeArray[1].slice(-1)}
              </Text>
              {timeArray[2] !== undefined && (
                <>
                  <Text style={{...globalStyles.textHome, fontSize: wp(5)}}>
                    :
                  </Text>
                  <Text
                    style={{
                      ...globalStyles.textHome,
                      ...styles.singleTimeDigitTxt,
                    }}
                    numberOfLines={1}>
                    {timeArray[2].charAt(0)}
                  </Text>
                  <Text
                    style={{
                      ...globalStyles.textHome,
                      ...styles.singleTimeDigitTxt,
                    }}
                    numberOfLines={1}>
                    {timeArray[2].slice(-1)}
                  </Text>
                </>
              )}
            </View>
          ) : (
            <Text style={{...globalStyles.textHome, fontSize: wp(5)}}>
              {timeArray[0] !== '0' && timeArray[0] !== '00' && (
                <Text>
                  {timeArray[0]}
                  <Text style={{fontSize: wp(5), color: colors.creamBase4}}>
                    h
                  </Text>
                </Text>
              )}
              <Text>
                {timeArray[1]}
                <Text style={{fontSize: wp(5), color: colors.creamBase4}}>
                  min
                </Text>
              </Text>
            </Text>
          )}
          {/* {props.isGreen && <Text style={{ ...globalStyles.textHome, fontSize: wp(5), color: colors.creamBase4 }}>min</Text>} */}
        </View>
        <View
          style={[
            {
              ...styles.container,
              ...styles.doneView,
              backgroundColor:
                courseReducers?.trackedTimeProgress >=
                (timeArray[2] !== undefined ? 22.7 : 15.2)
                  ? colors.creamBase3
                  : colors.Dark_Gray,
            },
            props.isGreen && {...styles.icDoneContainer},
          ]}>
          <AutoHeightImage
            width={wp(5)}
            source={props.isGreen ? images.pencil : images.ic_done}
          />
        </View>
        {!props.isGreen && (
          <View
            style={[
              styles.progressLine,
              timeArray[2] !== undefined && {width: wp(22.7)},
            ]}
          />
        )}
        {!props.isGreen && (
          <View
            style={[
              styles.progressLine,
              {
                ...styles.greenProgressLine,
                width: wp(courseReducers.trackedTimeProgress),
              },
              timeArray[2] !== undefined && {
                width: wp(courseReducers.trackedTimeProgress),
                maxWidth: wp(22.7),
              },
            ]}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blackBase6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(3.5),
    flexDirection: 'row',
  },
  doneView: {
    backgroundColor: colors.Dark_Gray,
    padding: wp(2),
    // paddingVertical: wp(2),
    borderBottomLeftRadius: 0,
  },
  progressLine: {
    backgroundColor: colors.Dark_Gray,
    // padding: wp(0.7),
    height: wp(1.4),
    borderRadius: wp(10),
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    position: 'absolute',
    bottom: 0,
    left: wp(2.7),
    width: wp(15.2),
  },
  singleTimeDigitTxt: {
    fontSize: wp(5),
    width: DEVICE_OS === 'ios' ? wp(3.1) : wp(3.2),
    textAlign: 'right',
  },
  icDoneContainer: {
    paddingLeft: 0,
    paddingTop: wp(2),
    paddingRight: wp(3),
    paddingBottom: wp(2),
    backgroundColor: colors.TRANS,
  },
  greenProgressLine: {
    backgroundColor: colors.creamBase3,
    maxWidth: wp(15.2),
  },
});
