//#region import
//#region RN
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
//#endregion
//#region common files
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {images} from '../../res/images';
import {colors} from '../../res/colors';
import {fonts} from '../../res/fonts';
import {Spacer} from '../../res/spacer';
import globalStyles from '../../res/globalStyles';
import {Toolbar} from '../../components/Toolbar';
import OnBackPressed from '../../components/OnBackPressed';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as action from '../../redux/actions/settingsAction';
//#endregion
//#region third party libs
import Toast from 'react-native-simple-toast';
import {isIphoneX} from 'react-native-iphone-x-helper';
//#endregion
//#endregion

export default contactUs = props => {
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  //#endregion redux
  //#region local state
  const [contactUsText, setContactusText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  //#endregion local state
  return (
    <View style={globalStyles.flex}>
      <OnBackPressed onBackPressed={() => props.navigation.goBack()} />
      <Toolbar onPress={() => props.navigation.goBack()} isProfile={true} />
      <View style={{marginTop: hp('9%')}}>
        <TextInput
          placeholder={
            'Type your question here, a member of the\nPianohack team will respond to you asap !'
          }
          placeholderTextColor={colors.gray}
          style={[styles.textInputStyle, {paddingLeft: wp('1%')}]}
          onChangeText={setContactusText}
          value={contactUsText}
          multiline={true}
          autoFocus={true}
          selectionColor={DEVICE_OS === 'ios' && colors.white}
        />
      </View>
      <Spacer space={wp('9%')} />
      <TouchableOpacity
        style={styles.saveBtn}
        disabled={isSaving}
        onPress={() => {
          if (!contactUsText.replace(/\s/g, '').length) {
            Keyboard.dismiss();
            setTimeout(() => {
              Toast.show('Please write your Feedback');
            }, 100);
          } else {
            setIsSaving(true);
            dispatch(
              action.onFeedbackSend(
                authReducers.userDetails,
                contactUsText,
                props,
                () => {
                  setIsSaving(false);
                },
              ),
            );
          }
        }}>
        <ActivityIndicator
          size="small"
          color={!isSaving ? colors.TRANS : colors.white}
          style={{position: 'absolute'}}
        />
        <Text
          style={[
            styles.headerTxt,
            {
              color: isSaving ? colors.TRANS : colors.white,
              fontSize: wp('5.5%'),
            },
          ]}>
          SEND
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  textInputStyle: {
    height: Platform.OS === 'ios' ? hp('15%') : hp('15%'),
    width: wp('84'),
    fontSize: wp('3.9%'),
    fontFamily: fonts.FM,
    textAlignVertical: 'top',
    color: colors.black,
    lineHeight: wp('5.5%'),
    backgroundColor: colors.creamBase3,
    borderRadius: 8,
  },
  logo: {
    height: hp('5%'),
    width: wp('25%'),
  },
  headerTxt: {
    fontFamily: fonts.QE,
    color: colors.blackShade,
    fontSize: wp('5%'),
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: colors.creamBase3,
    borderRadius: wp('2%'),
    // width: wp('38%'),
    // height: hp('4.5%'),
    padding: wp('1.5%'),
    paddingLeft: wp('20%'),
    paddingRight: wp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
