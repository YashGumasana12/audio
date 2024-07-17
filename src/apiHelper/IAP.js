//#region import
//#region RN
import {Platform, Alert} from 'react-native';
//#endregion
//#region common files
import {POST} from './apiService';
import {
  make_pro_user,
  check_pro,
  check_google_purchase,
  save_subscription,
} from '../apiHelper/APIs.json';
import Util from '../utils/utils';
import {saveData} from '../utils/asyncStorageHelper';
//#endregion
//#region third party libs
import * as RNIap from 'react-native-iap';
import Toast from 'react-native-simple-toast';
import {useSelector, useDispatch} from 'react-redux';
import * as authActions from '../redux/actionTypes/authActionTypes';
import * as courseActions from '../redux/actions/courseActions';
import {updateUserDetail} from '../redux/actions/authActions';
//#endregion
//#endregion
import {
  isIosStorekit2,
  PurchaseError,
  requestSubscription,
  useIAP,
} from 'react-native-iap';
import {log} from 'console';
const itemSkus = Platform.select({
  ios: [
    // 'com.pianohack.apple_pianohackpro_monthly'
    'com.pianohack.apple_pianohackpro_monthly1',
  ],
  android: [
    // 'com.pianohack.android_pianohackpro_month'
    'com.pianohack.android_pro_monthly',
  ],
});
//userDetails, navigation, callBack
export const productPurchase = async (userDetails, dispatch, callBack) => {
  //   console.log('userDetails', userDetails);
  try {
    if (Platform.OS == 'ios') {
      await RNIap.clearTransactionIOS();
      RNIap.getProducts({skus: itemSkus}).then(async products => {
        console.log('products', products);
        let Product_ID = products[0].productId;
        console.log('Product_ID', Product_ID);

        RNIap.requestSubscription({sku: Product_ID})
          .then(async purchase => {
            try {
              storeSubscription(
                userDetails,
                purchase.transactionReceipt,
                'iOS',
              );
            } catch (error) {
              console.log('error : ', error);
            }
            makeProUser(userDetails, 1, dispatch, callBack, true);
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
    if (Platform.OS == 'android') {
      console.log('Hello', itemSkus);
      RNIap.getSubscriptions({skus: itemSkus}).then(async products => {
        console.log('products', products);

        try {
          let Product_ID = products[0].productId;
          let offerToken = products[0].subscriptionOfferDetails[0].offerToken;

          console.log('Product_ID', Product_ID, offerToken);

          try {
            const purchase = await requestSubscription({
              sku: Product_ID,
              ...(offerToken && {
                subscriptionOffers: [{sku: Product_ID, offerToken}],
              }),
            });

            console.log('purchase:0=>', purchase);
            //   if(purchase){
            RNIap.purchaseUpdatedListener(data => {
              console.log('Result: ', data);
              try {
                storeSubscription(userDetails, data.purchaseToken, 'Android');
              } catch (error) {
                console.log('error : ', error);
              }
            });

            makeProUser(userDetails, 1, dispatch, callBack, true);
          } catch (error) {
            if (error instanceof PurchaseError) {
              console.log({
                message: `[${error.code}]: ${error.message}`,
                error,
              });
            } else {
              console.log({message: 'handleBuySubscription', error});
            }
          }

          // RNIap.requestSubscription(Product_ID).then(async (purchase) => {
          //     console.log("purchase:-->",purchase);
          //     try {
          //         storeSubscription(userDetails, purchase.purchaseToken, 'Android');
          //     } catch (error) {
          //         console.log("error : ", error);
          //     }
          //     makeProUser(userDetails, 1, dispatch, callBack, true);
          // }).catch((error) => {
          //     console.log("------error-----", error)
          // })
        } catch (error) {
          console.log('error', error);
          alert('Invalid ProductId');
        }
      });
    }
  } catch (err) {
    console.log('error', err);
  }
};

const makeProUser = async (
  userDetails,
  status,
  dispatch,
  callBack,
  is_new_subscription,
) => {
  let requestBody = {
    user_id: userDetails.id,
    value: status,
  };
  is_new_subscription && (requestBody.is_new_subscription = 1);
  await POST(make_pro_user, requestBody, function (response) {
    if (response.status === '0') {
      userDetails.pro_status = status === 1 ? true : false;
      saveData('objLogin', JSON.stringify(userDetails));
      dispatch({type: authActions.USER_DETAILS, userDetails: userDetails});
      dispatch(courseActions.onUpdateCourse(userDetails));
      callBack !== undefined && callBack(userDetails);
    } else {
      Toast.show(response.responseData.message);
    }
  });
};

const storeSubscription = async (userDetails, purchaseToken, device) => {
  try {
    let requestBody = {
      user_id: userDetails.id,
      device_type: device,
      purchase_token: purchaseToken,
    };
    await POST(save_subscription, requestBody, function (response) {
      console.log('storeSubscription response : ', response);
    });
  } catch (e) {
    console.log('Error storeSubscription -> ', e);
  }
};

export const isSubscriptionActiveAndRestore = async (
  userDetails,
  dispatch,
  callBack,
) => {
  if (Platform.OS === 'ios') {
    const latestReceipt = await RNIap.getReceiptIOS();
    if (latestReceipt !== undefined || latestReceipt !== '') {
      const decodedReceipt = await RNIap.validateReceiptIos(
        {
          'receipt-data': latestReceipt,
          password: Util.getIapPassword(),
        },
        false,
      );
      try {
        const {latest_receipt_info: latestReceiptInfo} = decodedReceipt;
        const isSubValid = !!latestReceiptInfo.find(receipt => {
          const expirationInMilliseconds = Number(receipt.expires_date_ms);
          const nowInMilliseconds = Date.now();
          return expirationInMilliseconds > nowInMilliseconds;
        });
        if (isSubValid) {
          Alert.alert(
            'Restore Successful',
            'You successfully restored purchase',
          );
          makeProUser(userDetails, 1, dispatch, callBack);
        } else {
          Alert.alert('Alert', 'You have to required subscription again');
          callBack();
        }
      } catch (error) {
        callBack();
      }
    } else {
      Alert.alert('Alert', "You have'nt subscribed any product yet.");
      callBack();
    }
  }

  if (Platform.OS === 'android') {
    const availablePurchases = await RNIap.getAvailablePurchases();
    console.log('availablePurchases-->', availablePurchases);
    const sortedAvailablePurchases = availablePurchases.sort(
      (a, b) => b.transactionDate - a.transactionDate,
    );
    console.log('sortedAvailablePurchases', sortedAvailablePurchases);
    if (sortedAvailablePurchases.length > 0) {
      // // if consumable again
      // RNIap.consumePurchaseAndroid(sortedAvailablePurchases[0].purchaseToken).then(val => {
      //     console.log("val23:---->",val);

      //     if (val) {
      //         Alert.alert('Restore Successful', 'You successfully restored purchase');
      //         makeProUser(userDetails, 1, dispatch, callBack);
      //     }
      // })
      // Acknowledge the purchase to let the Billing Library handle consumption
      //
      // // if not consumable again
      RNIap.acknowledgePurchaseAndroid(
        sortedAvailablePurchases[0].purchaseToken,
      ).then(val => {
        console.log('val:---->', val);
        if (val) {
          Alert.alert(
            'Restore Successful',
            'You successfully restored purchases',
          );
          makeProUser(userDetails, 1, dispatch, callBack);
        }
      });
    } else {
      Alert.alert('Alert', "You have'nt subscribed any product yet.");
      callBack();
    }
  }
};

export const isSubscriptionActive = async (userDetails, dispatch) => {
  if (Platform.OS === 'ios') {
    const latestReceipt = await RNIap.getReceiptIOS();
    if (latestReceipt !== undefined || latestReceipt !== '') {
      let requestBody = {
        user_id: userDetails.id,
        password: Util.getIapPassword(),
        'receipt-data': latestReceipt,
        isSandbox: 'No',
      };
      await POST(check_pro, requestBody, function (response) {
        if (response.status === '0') {
          userDetails.pro_status = response.responseData.pro_status;
          saveData('objLogin', JSON.stringify(userDetails));
          dispatch({type: authActions.USER_DETAILS, userDetails: userDetails});
          makeProUser(
            userDetails,
            response.responseData.pro_status ? 1 : 0,
            dispatch,
          );
        } else {
          userDetails.pro_status = false;
          saveData('objLogin', JSON.stringify(userDetails));
          dispatch({type: authActions.USER_DETAILS, userDetails: userDetails});
          makeProUser(userDetails, 0, dispatch);
        }
      });
    } else {
      userDetails.pro_status = false;
      saveData('objLogin', JSON.stringify(userDetails));
      dispatch({type: authActions.USER_DETAILS, userDetails: userDetails});
      makeProUser(userDetails, 0, dispatch);
    }
  } else {
    const availablePurchases = await RNIap.getAvailablePurchases();
    const sortedAvailablePurchases = availablePurchases.sort(
      (a, b) => b.transactionDate - a.transactionDate,
    );
    // if (sortedAvailablePurchases.length > 0) {
    let requestBody = {
      package_name: 'com.pianohack.android',
      product_id: itemSkus[0],
      purchase_token:
        sortedAvailablePurchases.length > 0
          ? sortedAvailablePurchases[0].purchaseToken
          : '',
      user_id: userDetails.id,
    };
    await POST(check_google_purchase, requestBody, function (response) {
      if (response.status === '0') {
        userDetails.pro_status = response.responseData.pro_status;
        saveData('objLogin', JSON.stringify(userDetails));
        dispatch({type: authActions.USER_DETAILS, userDetails: userDetails});
        makeProUser(
          userDetails,
          response.responseData.pro_status ? 1 : 0,
          dispatch,
        );
      } else {
        userDetails.pro_status = false;
        saveData('objLogin', JSON.stringify(userDetails));
        dispatch({type: authActions.USER_DETAILS, userDetails: userDetails});
        makeProUser(userDetails, 0, dispatch);
      }
    });
    // } else {
    //     userDetails.pro_status = false;
    //     saveData("objLogin", JSON.stringify(userDetails));
    //     dispatch({ type: authActions.USER_DETAILS, userDetails: userDetails });
    //     makeProUser(userDetails, 0, dispatch);
    // }
  }
};
