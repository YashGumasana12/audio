//#region import
//#region RN
import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  Keyboard,
} from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import {Spacer} from '../../res/spacer';
import {validateUserName} from '../../utils/validations';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {images} from '../../res/images';
import {colors} from '../../res/colors';
import {fonts} from '../../res/fonts';
import TextInputCustom from '../../components/TextInputCustom';
import {Toolbar} from '../../components/Toolbar';
import OnBackPressed from '../../components/OnBackPressed';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as action from '../../redux/actions/authActions';
import * as setingActions from '../../redux/actions/settingsAction';
//#endregion
//#region third party libs
import Toast from 'react-native-simple-toast';
import {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  finishTransaction,
  consumePurchaseAndroid,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import * as RNIap from 'react-native-iap';

import {IAPModal} from '../../components/IAPModal';
import {isIphoneX} from 'react-native-iphone-x-helper';
//#endregion
//#endregion

let purchaseUpdateSubscription;
let purchaseErrorSubscription;
export default profile = props => {
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  //#region local state
  const [name, setName] = useState(authReducers.userDetails.name);
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isIAPLoading, setIsIAPLoading] = useState(false);
  const [isRestoreLoading, setIsRestoreLoading] = useState(false);
  const [isIapModal, setIsIapModal] = useState(false);
  //#endregion local state

  //#region IAP
  const onUnlockMemnership = () => {
    // setIsIAPLoading(true);
    dispatch(setingActions.onUpgradeModal(true, 'profile'));
    // dispatch(action.onUnlockCourse(authReducers.userDetails, ((data) => {
    //     if (data) {
    //         setIsIAPLoading(false);
    //         // dispatch(setingActions.onIAPModalVisibility(!settingsReducers.isIapModal));
    //         setIsIapModal(true);
    //     }
    // })))
  };
  const initIAP = async () => {
    try {
      const result = await RNIap.initConnection();
      //  const Consume = await RNIap.consumeAllItemsAndroid();
    } catch (err) {
      console.log(err.code, err.message);
    }
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            if (Platform.OS === 'ios') {
              const ackResult = await finishTransactionIOS(
                purchase.transactionId,
              );
            } else if (Platform.OS === 'android') {
              // consumePurchaseAndroid(purchase.purchaseToken);
              acknowledgePurchaseAndroid(purchase.purchaseToken);
            }
            // const ackResult = await finishTransaction(purchase, true);
          } catch (ackErr) {
            setIsIAPLoading(false);
          }
        }
      },
    );
    purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        setIsIAPLoading(false);
      },
    );
  };
  useEffect(() => {
    initIAP();
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
      RNIap.endConnection();
    };
  }, []);
  //#endregion IAP
  return (
    <View style={globalStyles.flex}>
      <OnBackPressed onBackPressed={() => props.navigation.goBack()} />
      <ScrollView keyboardShouldPersistTaps={'always'}>
        <View style={{alignItems: 'center'}}>
          <Toolbar onPress={() => props.navigation.goBack()} isProfile={true} />
          <Spacer space={wp('5%')} />
          <View style={styles.profileContainer}>
            <Text style={styles.optionTxt}>
              This information is kept 100% private.
            </Text>
            <Spacer space={wp('1.2%')} />
            <Text
              style={[
                styles.optionTxt,
                styles.headerTxt,
                {color: colors.black},
              ]}>
              NAME
            </Text>
            <TextInputCustom
              placeTxt={'First name'}
              words={true}
              isProfile={true}
              onChangeText={setName}
              placeholderTextColor={colors.grayDark}
              value={name}
              autoFocus={false}
            />
            <Spacer space={wp('0.2%')} />
            <Text
              style={[
                styles.optionTxt,
                styles.headerTxt,
                {color: colors.black},
              ]}>
              EMAIL
            </Text>
            <TextInputCustom
              placeTxt={'Email'}
              words={true}
              isProfile={true}
              placeholderTextColor={colors.grayDark}
              value={authReducers.userDetails.email}
              editable={false}
              autoFocus={false}
            />
            <Spacer space={wp('0.2%')} />
            <Text
              style={[
                styles.optionTxt,
                styles.headerTxt,
                {color: colors.black},
              ]}>
              PASSWORD
            </Text>
            <TextInputCustom
              placeTxt={'If you need a new password, type it here.'}
              words={true}
              isProfile={true}
              onChangeText={setPassword}
              placeholderTextColor={colors.grayDark}
              value={password}
              secureTextEntry={true}
              autoFocus={false}
            />
          </View>
          <Spacer space={wp('3%')} />
          <TouchableOpacity
            style={styles.saveBtn}
            disabled={isSaving}
            onPress={() => {
              if (!name.replace(/\s/g, '').length) {
                Keyboard.dismiss();
                setTimeout(() => {
                  Toast.show('Please write your Name');
                }, 100);
              } else {
                setIsSaving(true);
                dispatch(
                  action.onProfileUpdate(
                    authReducers.userDetails,
                    {name, password},
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
              SAVE CHANGES
            </Text>
          </TouchableOpacity>
          <Spacer space={wp('6%')} />
          <View style={styles.profileContainer}>
            <Text
              style={[
                styles.optionTxt,
                styles.headerTxt,
                {color: colors.grayDark},
              ]}>
              MEMBERSHIP :{' '}
              <Text style={{color: colors.black}}>
                {authReducers.userDetails.pro_status
                  ? 'All Access USER'
                  : 'FREE USER'}
              </Text>
            </Text>
          </View>
          <Spacer space={wp('2%')} />

          {!authReducers.userDetails.pro_status && (
            <TouchableOpacity
              style={[styles.profileContainer, {flexDirection: 'row'}]}
              onPress={() => onUnlockMemnership()}>
              <Text style={{fontFamily: fonts.FM, color: colors.black}}>
                Get All Access now for 29.99$/month
              </Text>
              <Image
                style={[
                  globalStyles.img,
                  {
                    height: wp('3.5%'),
                    marginTop: hp('0.3%'),
                    width: wp('5%'),
                    tintColor: colors.black,
                  },
                ]}
                source={images.right_arrow}
              />
              {isIAPLoading && (
                <ActivityIndicator size="small" color={colors.white} />
              )}
            </TouchableOpacity>
          )}
          <Spacer space={wp('1.5%')} />
          <TouchableOpacity
            style={[styles.profileContainer, {flexDirection: 'row'}]}
            onPress={() => {
              setIsRestoreLoading(true);
              dispatch(
                action.onRestorePurchase(authReducers.userDetails, () => {
                  setIsRestoreLoading(false);
                }),
              );
            }}>
            <Text style={{fontFamily: fonts.FM, color: colors.black}}>
              Restore my All Access membership
            </Text>
            <Image
              style={[
                globalStyles.img,
                {
                  height: wp('3.5%'),
                  marginTop: hp('0.3%'),
                  width: wp('5%'),
                  tintColor: colors.black,
                },
              ]}
              source={images.right_arrow}
            />
            {isRestoreLoading && (
              <ActivityIndicator size="small" color={colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View
        style={{
          ...styles.profileContainer,
          flex: isIphoneX() || DEVICE_OS === 'android' ? 0.5 : 1,
          paddingTop: wp(2),
          paddingRight: wp(5),
        }}>
        <Text style={{fontFamily: fonts.FM, color: colors.black}}>
          The All Access membership unlocks all the daily exercises and tabs for
          29.99$. It lasts 30 days and is renewed automatically. You can cancel
          at any time.
        </Text>
      </View>

      <IAPModal
        isIapModal={isIapModal}
        onBeginClicked={() => {
          global.isIapSuccess = true;
          setIsIapModal(false);
          props.navigation.goBack();
          setTimeout(() => {
            global.isIapSuccess = false;
          }, 300);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  logo: {
    height: hp('5%'),
    width: wp('25%'),
  },
  profileContainer: {
    width: wp('91%'),
    alignSelf: 'flex-end',
  },
  optionTxt: {
    fontFamily: fonts.FM,
    color: colors.grayDark,
    fontSize: wp('4%'),
  },
  headerTxt: {
    fontFamily: fonts.QE,
    color: colors.blackShade,
    fontSize: wp('4%'),
  },
  saveBtn: {
    backgroundColor: colors.creamBase3,
    borderRadius: wp('2%'),
    // width: wp('38%'),
    // height: hp('4.5%'),
    padding: wp('1.5%'),
    paddingLeft: wp('6%'),
    paddingRight: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
