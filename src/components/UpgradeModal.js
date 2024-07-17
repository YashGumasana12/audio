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
  ActivityIndicator,
  Platform,
} from 'react-native';
//#endregion
//#region  third party libs
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

//#endregion third party libs
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
import * as authActions from '../redux/actions/authActions';
import AutoHeightImage from 'react-native-auto-height-image';
import {images} from '../res/images';
import Util from '../utils/utils';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
//#endregion
//#endregion

export const UpgradeModal = props => {
  //#region redux
  const dispatch = useDispatch();
  const settingsReducers = useSelector(state => state.settingsReducers);
  const authReducers = useSelector(state => state.authReducers);
  const courseReducers = useSelector(state => state.courseReducers);
  //#endregion redux
  const [isIAPLoading, setIsIAPLoading] = useState(false);
  const [isCongratsView, setIsCongratsView] = useState(false);

  useEffect(() => {
    initIAP();
    // Clear subscription operation states
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
  // #region IAP
  const initIAP = async () => {
    try {
      const result = await RNIap.initConnection();
      console.log('result', result);
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
  const onUnlockMemnership = () => {
    Util.onHapticFeedback();
    setIsIAPLoading(true);
    dispatch(
      authActions.onUnlockCourse(authReducers.userDetails, data => {
        if (data) {
          setIsIAPLoading(false);
          setIsCongratsView(true);
        }
      }),
    );
  };
  //#endregion IAP
  return (
    <Modal animationType="slide" visible={settingsReducers.isUpgradeModal}>
      <View
        style={[
          styles.container,
          isCongratsView && {justifyContent: 'center'},
        ]}>
        {!isCongratsView ? (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{...globalStyles.paddingTop1, alignItems: 'center'}}>
                <Image
                  style={[
                    globalStyles.img,
                    {height: wp('16%'), width: wp('16%')},
                  ]}
                  source={images.lessonTitleIcon}
                />
                <Spacer space={wp(4)} />
                <TouchableOpacity
                  style={styles.unlockBtn}
                  disabled={isIAPLoading}
                  onPress={() => onUnlockMemnership()}>
                  <Text
                    style={{
                      ...styles.unlockTxt,
                      color: isIAPLoading ? colors.TRANS : colors.creamBase4,
                    }}>
                    Try{' '}
                    <Text
                      style={{
                        color: isIAPLoading ? colors.TRANS : colors.white,
                      }}>
                      all access
                    </Text>{' '}
                    <Text
                      style={{
                        color: isIAPLoading ? colors.TRANS : colors.creamBase4,
                      }}>
                      for 7 days, free !
                    </Text>
                  </Text>
                  {/* <Text style={{ ...styles.unlockTxt, color: isIAPLoading ? colors.TRANS : colors.white }}>Get all access for <Text style={{ color: isIAPLoading ? colors.TRANS : colors.creamBase4 }}>29.99$<Text style={{ fontFamily: fonts.FM, fontSize: wp(3) }}>/</Text>month</Text></Text> */}
                  {isIAPLoading && (
                    <ActivityIndicator
                      size="small"
                      color={colors.white}
                      style={{position: 'absolute'}}
                    />
                  )}
                </TouchableOpacity>
                <View style={styles.cancelContainer}>
                  <Text style={styles.cancelTxt}>
                    Then 29.99$/month. Cancel anytime.
                  </Text>
                </View>
                <Spacer space={wp(6)} />
                <AutoHeightImage
                  width={wp(90)}
                  source={images.upgrade_content}
                />
                <Spacer space={wp(4)} />
                {/* <AutoHeightImage width={wp(8.5)} source={images.liveUserImg} /> */}
                <FastImage
                  source={images.liveUserImg}
                  resizeMode={'contain'}
                  style={[globalStyles.img, {width: wp(8.5), height: wp(8.5)}]}
                />
                {/* <FastImage source={images.liveUser} style={{ width: wp(8.5), height: wp(8.5), resizeMode: 'cover', backgroundColor: 'red' }} /> */}
                {/* <Image source={images.liveUser} style={[globalStyles.img, { width: wp(8.5), height: wp(8.5) }]} /> */}
                <Spacer space={wp(1)} />
                <Text
                  style={{
                    ...styles.unlockTxt,
                    color: colors.white,
                    fontSize: wp(4),
                  }}>
                  Join{' '}
                  <Text style={{color: colors.creamBase3}}>
                    {courseReducers.totalFreeUsers}{' '}
                  </Text>
                  Pianohackers worldwide !
                </Text>
                <Spacer space={wp(7)} />
                <Text
                  style={[
                    styles.cancelTxt,
                    {
                      color: colors.grayBold,
                      fontSize: wp(2.9),
                      textDecorationLine: 'underline',
                    },
                  ]}>
                  Terms of Use
                </Text>
                <Spacer space={wp(1)} />
                <Text
                  style={[
                    styles.cancelTxt,
                    {
                      color: colors.grayDark,
                      fontSize: wp(2.9),
                      width: wp(85),
                      textAlign: 'center',
                    },
                  ]}>
                  Payment will be charged to your store after the confirmation
                  of purchase. Subscriptions will automatically renew unless
                  canceled at least 24 hours before the end of the current
                  period. You can cancel anytime with your device account
                  settings.
                </Text>
                <Spacer space={wp(5)} />
              </View>
            </ScrollView>
            <TouchableOpacity
              style={[globalStyles.paddingTop1, styles.closeImg]}
              disabled={isIAPLoading}
              onPress={() => dispatch(actions.onUpgradeModal(false))}>
              <Image
                style={[globalStyles.img, {height: wp(8.5), width: wp(8.5)}]}
                source={images.close_dark}
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <AutoHeightImage width={wp(80)} source={images.welcome} />
            <TouchableOpacity
              style={styles.beginBtn}
              onPress={() => {
                Util.onHapticFeedback();
                dispatch(actions.onUpgradeModal(false));
                dispatch(actions.onBeginClicked(true));
                setTimeout(() => {
                  setIsCongratsView(false);
                }, 100);

                // props.onBeginClicked();
                // dispatch(actions.onIAPModalVisibility(!settingsReducers.isIapModal));
              }}>
              <AutoHeightImage width={wp(80)} source={images.begin} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    backgroundColor: colors.creamBase1,
    flex: 1,
    alignItems: 'center',
  },
  closeImg: {
    position: 'absolute',
    left: wp('5.5%'),
    top: hp('0.6%'),
  },
  unlockBtn: {
    backgroundColor: colors.creamBase3,
    width: wp(83),
    alignItems: 'center',
    justifyContent: 'center',
    height: wp(13),
    borderRadius: wp(2.5),
  },
  unlockTxt: {
    fontFamily: fonts.QE,
    fontSize: wp(4.5),
    color: colors.creamBase4,
  },
  cancelTxt: {
    fontFamily: fonts.FM,
    fontSize: wp(3.8),
    color: colors.grayBold,
  },
  cancelContainer: {
    backgroundColor: colors.blackBase6,
    padding: wp(2),
    paddingLeft: wp(4.5),
    paddingRight: wp(4.5),
    borderRadius: wp(2.5),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  beginBtn: {
    position: 'absolute',
    bottom: isIphoneX() ? getBottomSpace() + wp(5) : wp(12),
  },
});
