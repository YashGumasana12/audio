//#region import
//#region RN
import {StyleSheet} from 'react-native';
//#endregion
//#region common files
import {colors} from './colors';
import {fonts} from './fonts';
import {hp, wp, DEVICE_OS, DEVICE} from '../utils/constants';
//#endregion
//#region third party libs
import {
  getBottomSpace,
  getStatusBarHeight,
  ifIphoneX,
} from 'react-native-iphone-x-helper';
//#endregion
//#endregion

const globalStyles = StyleSheet.create({
  paddingTop: {
    ...ifIphoneX(
      {
        // paddingTop: getStatusBarHeight() + hp('2.5%')
        marginTop: getStatusBarHeight() + hp('6%'),
      },
      {
        // paddingTop: DEVICE_OS === 'ios' ? getStatusBarHeight() + hp('2.5%') : hp('2.5%')
        marginTop:
          DEVICE_OS === 'android'
            ? getStatusBarHeight()
            : getStatusBarHeight() + hp('6%'),
      },
    ),
  },
  paddingTop1: {
    ...ifIphoneX(
      {
        marginTop: getStatusBarHeight() + hp('2.5%'),
      },
      {
        marginTop:
          DEVICE_OS === 'ios' ? getStatusBarHeight() + hp('2.5%') : hp('2.5%'),
      },
    ),
  },
  paddingTop2: {
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight() + hp('2.5%'),
      },
      {
        paddingTop:
          DEVICE_OS === 'ios' ? getStatusBarHeight() + hp('2.5%') : hp('2.5%'),
      },
    ),
  },
  absoluteTop: {
    ...ifIphoneX(
      {
        top: getStatusBarHeight() + 15,
      },
      {
        top: getStatusBarHeight(),
      },
    ),
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: DEVICE.DEVICE_WIDTH,
    alignSelf: 'center',
  },
  flex: {
    flex: 1,
    backgroundColor: colors.creamBase1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomSpace: {
    ...ifIphoneX(
      {
        marginBottom: getBottomSpace(),
      },
      {
        marginBottom: 13,
      },
    ),
  },
  img: {
    resizeMode: 'contain',
    height: wp('8%'),
    width: wp('8%'),
  },
  text: {
    fontFamily: fonts.FC,
    fontSize: wp('3%'),
    color: colors.black,
  },
  textHome: {
    fontFamily: fonts.QE,
    fontSize: wp('4%'),
    color: colors.white,
  },
  shadow: {
    backgroundColor: colors.creamBase1,
    shadowColor: colors.Black,
    shadowOffset: {width: 0, height: -8},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 6,
  },
  searchBox: {
    backgroundColor: colors.blackBase6,
    padding: wp('2%'),
    paddingTop: wp('1.7%'),
    paddingBottom: wp('1.7%'),
    // width: wp('90%'),
    borderRadius: 8,
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContainer: {
    width: wp('90%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp('2.5%'),
    paddingLeft: wp('4.4%'),
    marginBottom: wp('1.5%'),
    paddingTop: wp('1.8%'),
    paddingBottom: wp('1.8%'),
  },
});

export default globalStyles;
