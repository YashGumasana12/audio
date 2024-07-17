//#region import
//#region RN
import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Share,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import {Spacer} from '../../res/spacer';
import {Toolbar} from '../../components/Toolbar';
import {clearAllData} from '../../utils/asyncStorageHelper';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {images} from '../../res/images';
import {colors} from '../../res/colors';
import {fonts} from '../../res/fonts';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../redux/actions/settingsAction';
//#endregion
//#region third party libs
import {useNavigation} from '@react-navigation/native';
import Util from '../../utils/utils';
//#endregion
//#endregion
global.isIapSuccess = false;
export default settings = Props => {
  //#region redux
  const props = Props.props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);

  //#endregion redux
  //#region local state
  const [options, setOptions] = useState([
    'Account details',
    // "Unlock Unlimited Tabs",
    'Privacy Policy',
    'Terms of Service',
    'Contact us',
    'Share the app',
    'Delete Account ',
    'Log out',
  ]);
  //#endregion local state

  const onLogout = async () => {
    return Alert.alert(
      'Logout',
      'Are you sure want to logout ? ',
      [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          onPress: () => {
            // AsyncStorage.clear();
            // let keys = ["objLogin"];
            // AsyncStorage.multiRemove(keys, (err) => {
            //   navigation.navigate("login");
            // });

            clearAllData(() => {
              navigation.replace('login');
            });
          },
          style: 'Yes',
        },
      ],
      {cancelable: false},
    );
  };
  const onDeleteAccount = async () => {
    return Alert.alert(
      'Are you sure?',
      'Deleting your account will erase all your data permanently',
      [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          onPress: () => {
            dispatch(
              actions.onDeleteAccount(authReducers.userDetails, navigation),
            );
          },
          style: 'Yes',
        },
      ],
      {cancelable: false},
    );
  };

  const onOptionItemClicked = index => {
    switch (index) {
      case 0:
        navigation.navigate('profile');
        break;
      // case 1:
      //   handle_modal();
      //   break;
      case 1:
        navigation.navigate('privacyPolicy', {from: 'privacy'});
        break;
      case 2:
        navigation.navigate('privacyPolicy', {from: 'terms'});
        break;
      case 3:
        navigation.navigate('contactUs');
        break;
      case 4:
        Util.onShare();
        break;
      case 5:
        onDeleteAccount();
        break;
      case 6:
        onLogout();
      default:
        break;
    }
  };

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     global.isIapSuccess && Props.onTabChange();
  //   });
  //   return unsubscribe;
  // }, [props.navigation]);

  return (
    <View style={globalStyles.flex}>
      <Toolbar
        settings
        isNavDisable={true}
        onPress={() => navigation.goBack()}
      />
      <Spacer space={wp('5%')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{width: DEVICE.DEVICE_WIDTH}}>
          {options.map((data, index) => {
            return (
              <>
                <Spacer space={wp('1.8%')} />
                <TouchableOpacity
                  style={styles.optionItemContainer}
                  onPress={() => onOptionItemClicked(index)}>
                  {/* <Text style={index == 1 ? styles.optionTxtSelected : styles.optionTxt}>{data}</Text> */}
                  <Text style={styles.optionTxt}>{data}</Text>
                  <Image
                    style={[
                      globalStyles.img,
                      {
                        height: wp('4%'),
                        width: wp('4%'),
                        marginRight: wp('4%'),
                        tintColor: colors.creamBase5,
                      },
                    ]}
                    source={images.rightArrow}
                  />
                </TouchableOpacity>
                <Spacer space={wp('1.8%')} />
                {index !== options.length - 1 && (
                  <View style={styles.bottomLine} />
                )}
              </>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  logo: {
    height: hp('5%'),
    width: wp('25%'),
  },
  optionItemContainer: {
    width: wp('91%'),
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTxt: {
    fontFamily: fonts.FM,
    color: colors.black,
    fontSize: wp('4%'),
  },
  optionTxtSelected: {
    fontFamily: fonts.FM,
    color: colors.creamBase3,
    fontSize: wp('4%'),
  },
  bottomLine: {
    height: hp('0.1%'),
    width: wp('91%'),
    backgroundColor: colors.grayDark,
    alignSelf: 'flex-end',
  },
});
