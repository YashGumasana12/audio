//#region import
//#region RN
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Animated,
  Image,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import {colors} from '../../res/colors';
import {images} from '../../res/images';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {Spacer} from '../../res/spacer';
import Util from '../../utils/utils';
import TextAuth from '../../components/textAuth';
import {fonts} from '../../res/fonts';
import TextInputCustom from '../../components/TextInputCustom';
import {
  base_url,
  logins,
  forgot_password,
  register,
} from '../../apiHelper/APIs.json';
import {saveData, getData} from '../../utils/asyncStorageHelper';
import {POST} from '../../apiHelper/apiService';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as action from '../../redux/actions/authActions';
//#endregion
//#region third party libs
import AsyncStorage from '@react-native-community/async-storage';
import {getBottomSpace, isIphoneX} from 'react-native-iphone-x-helper';
import * as RNLocalize from 'react-native-localize';
import Toast from 'react-native-simple-toast';
import ImageSlider from 'react-native-image-slider';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import * as Keychain from 'react-native-keychain';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
//#endregion
//#endregion

let moveSocialAnimation = new Animated.Value(0);
let moveLoginAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
export default login = props => {
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  //#endregion redux
  //#region local state
  const [activeIndex, setActiveIndex] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passsword, setPasssword] = useState('');
  const [loginemail, setLoginemail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [forgetEmail, setForgetEmail] = useState('');
  const [appleState, setAppleState] = useState({
    appleEmail: '',
    appleName: '',
  });
  const [credentialStateForUser, setCredentialStateForUser] = useState(-1);
  const [isShowFocus, setIsShowFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //#endregion local state

  //#region
  const _OnRegistration = async () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (name.trim() == '') {
      _errorMessage('Please enter your name.');
    } else if (email == '') {
      _errorMessage('Please enter your email.');
    } else if (reg.test(email) == 0) {
      _errorMessage('Please enter vaild email.');
    } else if (passsword == '') {
      _errorMessage('Please enter your passsword.');
    } else {
      setIsLoading(true);
      let requestBody = {
        email: email,
        name: name,
        password: passsword,
        device_type: DEVICE_OS == 'ios' ? 'I' : 'A',
        device_token: global.fcmToken,
        is_react_user: 1,
        // timezone: RNLocalize.getTimeZone(),
      };
      await POST(register, requestBody, function (response) {
        setIsLoading(false);
        if (response.status == '1') {
          _errorMessage(response.responseData.message);
        } else {
          saveData('objLogin', JSON.stringify(response.responseData.data));
          props.navigation.replace('tabBar');
          setTimeout(() => {
            setActiveIndex(0);
            setIsShowFocus(false);
            Util.slideAnimation(moveSocialAnimation, 0);
            Util.slideAnimation(moveLoginAnimation, DEVICE.DEVICE_WIDTH);
          }, 1000);
        }
      });
    }
  };
  const _onLogin = async () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (loginemail == '') {
      _errorMessage('Please enter your email.');
    } else if (reg.test(loginemail) == 0) {
      _errorMessage('Please enter vaild email.');
    } else if (loginPassword == '') {
      _errorMessage('Please enter your passsword.');
    } else {
      //   setIsLoading(true);
      let requestBody = {
        email: loginemail,
        password: loginPassword,
        device_type: DEVICE_OS == 'ios' ? 'I' : 'A',
        device_token: global.fcmToken,
        is_react_user: 1,
        // timezone: RNLocalize.getTimeZone(),
      };

      console.log('requestBody: ', requestBody);
      await POST(logins, requestBody, function (response) {
        //   setIsLoading(false);
        console.log('response: ', response);
        if (response.status == '1') {
          _errorMessage(response.responseData.message);
        } else {
          saveData('objLogin', JSON.stringify(response.responseData.data));
          props.navigation.replace('tabBar');
          setTimeout(() => {
            setActiveIndex(0);
            setIsShowFocus(false);
            Util.slideAnimation(moveSocialAnimation, 0);
            Util.slideAnimation(moveLoginAnimation, DEVICE.DEVICE_WIDTH);
          }, 1000);
        }
      });
    }
  };
  const _onForget = async () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (forgetEmail == '') {
      _errorMessage('Please enter your email.');
    } else if (reg.test(forgetEmail) == 0) {
      _errorMessage('Please enter vaild email.');
    } else {
      setIsLoading(true);
      let requestBody = {
        email: forgetEmail,
      };
      await POST(forgot_password, requestBody, function (response) {
        setIsLoading(false);
        if (response.status == '1') {
          _errorMessage(response.responseData.message);
        } else {
          _errorMessage(response.responseData.message);
          setTimeout(() => {
            setForgetEmail('');
            setActiveIndex(1);
          }, 1000);
          // apiThis.setState({
          //   activeIndex: 1,
          //   transition: true,
          // });
          // // apiThis.props.navigation.replace('WorkoutDashbord');
          // apiThis.props.navigation.replace("WorkoutSet");
        }
      });
    }
  };
  const handleFacebookLoginTap = () => {
    LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      // "instagram_basic",
    ]).then(
      result => {
        //  alert(result);
        if (!result.isCancelled) {
          AccessToken.getCurrentAccessToken().then(async data => {
            initUser(data.accessToken);
          });
        }
      },
      error => {
        console.log(error);
      },
    );
  };

  const initUser = token => {
    fetch(
      'https://graph.facebook.com/v3.2/me?fields=id,email,name,picture&access_token=' +
        token,
    )
      .then(response => response.json())
      .then(json => {
        let name = json.name.split(' ');
        let givenName = name[0];
        let familyName = name[1];
        let jsondata = {
          id: json.id,
          name: json.name,
          email: json.email,
          photo: json.picture.data.url,
          givenName: givenName,
          familyName: familyName,
        };

        setIsLoading(true);
        let formData = new FormData();
        formData.append('email', json.email);
        formData.append('name', json.name);
        formData.append('social_key', json.id);
        formData.append('device_type', DEVICE_OS == 'ios' ? 'I' : 'A');
        formData.append('device_token', global.fcmToken);
        // formData.append("timezone", RNLocalize.getTimeZone());
        formData.append('profile_pic', json.picture.data.url);

        fetch(base_url + 'social_login.php', {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(response => {
            setIsLoading(false);
            if (response.status === true) {
              saveData('objLogin', JSON.stringify(response.data));
              props.navigation.replace('tabBar');
            }
          })
          .catch(err => {
            setIsLoading(false);
          });
      })
      .catch(() => {
        setIsLoading(false);
        reject('ERROR GETTING DATA FROM FACEBOOK');
      });
  };
  //Apple Method--->
  const appleSignIn = async () => {
    // start a login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });
      const username = appleAuthRequestResponse.email;
      const password = appleAuthRequestResponse.fullName.givenName;

      // Store the credentials
      if (appleAuthRequestResponse.email !== null) {
        await Keychain.setGenericPassword(username, password);
      }
      let credentials;
      try {
        // Retrieve the credentials
        credentials = await Keychain.getGenericPassword();
        if (credentials) {
          setAppleState({
            ...appleState,
            appleEmail: credentials.username,
            appleName: credentials.password,
          });
        }
      } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
      }
      const {
        user: newUser,
        nonce,
        identityToken,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;

      this.user = newUser;
      let formData = new FormData();
      formData.append('email', credentials.username);
      formData.append('name', credentials.password);
      formData.append('social_key', 12345677);
      formData.append('device_type', 'I');
      formData.append('device_token', global.fcmToken);
      formData.append('is_react_user', 1);
      // formData.append("timezone", RNLocalize.getTimeZone());
      if (appleState.appleEmail === null) {
        _errorMessage('Email is missing');
      } else if (appleState.appleName === null) {
        _errorMessage('Name is missing');
      } else if (identityToken === null) {
        _errorMessage('Token is missing');
      } else {
        fetch(base_url + 'social_login.php', {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(response => {
            if (response.status === true) {
              saveData('objLogin', JSON.stringify(response.data));
              props.navigation.replace('tabBar');
            } else {
              _errorMessage(response.message);
            }
          })
          .catch(err => {
            console.log('================ ', err);
          });
      }

      this.fetchAndUpdateCredentialState()
        .then(res => {
          setCredentialStateForUser(res);
        })
        .catch(error => setCredentialStateForUser(`Error: ${error.code}`));

      if (identityToken) {
        // e.g. sign in with Firebase Auth using `nonce` & `identityToken`
        console.log(nonce, identityToken);
      } else {
        // no token - failed sign-in?
      }

      if (realUserStatus === AppleAuthRealUserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }
    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.log(error);
      }
    }
  };

  fetchAndUpdateCredentialState = async () => {
    if (this.user === null) {
      setCredentialStateForUser('N/A');
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(
        this.user,
      );
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        setCredentialStateForUser('AUTHORIZED');
      } else {
        setCredentialStateForUser(credentialState);
      }
    }
  };

  //<------Apple Method
  const _errorMessage = text => {
    Keyboard.dismiss();
    setTimeout(() => {
      Toast.show(text);
    }, 100);
  };

  //#endregion

  //#region render functions
  renderSocialBtn = () => {
    return ['email', 'fb', 'apple'].map((data, index) => {
      return (
        <>
          <Spacer space={wp('1.5%')} />
          {DEVICE_OS === 'android' && index === 2 ? null : (
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() =>
                index === 0
                  ? (setIsShowFocus(true),
                    Util.slideAnimation(
                      moveSocialAnimation,
                      -DEVICE.DEVICE_WIDTH,
                    ),
                    Util.slideAnimation(moveLoginAnimation, 0))
                  : index === 1
                  ? handleFacebookLoginTap()
                  : appleSignIn()
              }>
              <Image
                style={[globalStyles.img, styles.socialBtn]}
                source={
                  index === 0
                    ? images.emailBtn
                    : index === 1
                    ? images.fbBtn
                    : images.apple
                }
              />
            </TouchableOpacity>
          )}
        </>
      );
    });
  };
  renderLoginWithEmail = () => {
    return (
      <View>
        {activeIndex !== 2 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}>
            <TextAuth
              title={'SIGN UP'}
              TextColor={activeIndex === 0 ? colors.white : colors.grayDark}
              onPress={() => setActiveIndex(0)}
            />
            <View style={styles.separator} />
            <TextAuth
              title={'LOG IN'}
              TextColor={activeIndex === 1 ? colors.white : colors.grayDark}
              onPress={() => setActiveIndex(1)}
            />
          </View>
        )}
        {activeIndex === 0 ? (
          <>
            <View style={styles.formContainer}>
              <TextInputCustom
                placeTxt={'First name'}
                words={true}
                onChangeText={setName}
                placeholderTextColor={colors.grayDark}
                autoFocus={true}
              />
              <TextInputCustom
                placeTxt={'Email'}
                email={true}
                placeholderTextColor={colors.grayDark}
                onChangeText={setEmail}
              />
              <TextInputCustom
                placeTxt={'Password'}
                onChangeText={setPasssword}
                placeholderTextColor={colors.grayDark}
                secureTextEntry={true}
              />
            </View>
            {!isLoading ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Keyboard.dismiss(), _OnRegistration();
                }}
                style={{marginTop: wp('10%'), alignSelf: 'center'}}>
                <Image
                  source={images.start}
                  style={[
                    globalStyles.img,
                    {height: hp('6%'), width: wp('30%')},
                  ]}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.loaderContainer}>
                <Image
                  source={images.loaderRect}
                  style={[
                    globalStyles.img,
                    {height: hp('6%'), width: wp('30%')},
                  ]}
                />
                <ActivityIndicator
                  size="small"
                  color={colors.white}
                  style={{position: 'absolute'}}
                />
              </View>
            )}
          </>
        ) : activeIndex === 1 ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
              }}
            />
            <View style={styles.formContainer}>
              <TextInputCustom
                placeTxt={'Email'}
                email={true}
                onChangeText={setLoginemail}
                placeholderTextColor={colors.grayDark}
                value={loginemail}
                autoFocus={true}
              />
              <TextInputCustom
                placeTxt={'Password'}
                forgot={'yes'}
                onPress={() => setActiveIndex(2)}
                placeholderTextColor={colors.grayDark}
                onChangeText={setLoginPassword}
                secureTextEntry={true}
                value={loginPassword}
              />
            </View>
            {!isLoading ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Keyboard.dismiss(), _onLogin();
                }}
                style={{marginTop: wp('10%'), alignSelf: 'center'}}>
                <Image
                  source={images.start}
                  style={[
                    globalStyles.img,
                    {height: hp('6%'), width: wp('30%')},
                  ]}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.loaderContainer}>
                <Image
                  source={images.loaderRect}
                  style={[
                    globalStyles.img,
                    {height: hp('6%'), width: wp('30%')},
                  ]}
                />
                <ActivityIndicator
                  size="small"
                  color={colors.white}
                  style={{position: 'absolute'}}
                />
              </View>
            )}
          </>
        ) : (
          <>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setActiveIndex(1)}>
                <Image
                  source={images.back}
                  style={[
                    globalStyles.img,
                    {height: hp('5%'), width: wp('8%')},
                  ]}
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: colors.white,
                  fontFamily: fonts.FC,
                  fontSize: hp('2%'),
                  marginLeft: wp('5%'),
                }}>
                FORGOT YOUR PASSWORD ?
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: wp('6%'),
              }}>
              <TextInputCustom
                placeTxt={'Email'}
                email={true}
                onChangeText={setForgetEmail}
                value={forgetEmail}
                placeholderTextColor={colors.grayDark}
                autoFocus={true}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: fonts.FM,
                  color: colors.grayDark,
                  marginTop: hp('2%'),
                }}>
                We will send you a new passsword by email.{'\n'}Don't forget to
                check your spam.
              </Text>
            </View>
            {!isLoading ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Keyboard.dismiss(), _onForget();
                }}
                style={{marginTop: wp('10%'), alignSelf: 'center'}}>
                <Image
                  source={images.send}
                  style={[
                    globalStyles.img,
                    {height: hp('6%'), width: wp('30%')},
                  ]}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.loaderContainer}>
                <Image
                  source={images.loaderRect}
                  style={[
                    globalStyles.img,
                    {height: hp('6%'), width: wp('30%')},
                  ]}
                />
                <ActivityIndicator
                  size="small"
                  color={colors.white}
                  style={{position: 'absolute'}}
                />
              </View>
            )}
          </>
        )}
      </View>
    );
  };
  //#endregion render functions
  return (
    <View style={globalStyles.flex}>
      {/* <Animated.View style={[moveSocialAnimation.getLayout(), { position: 'absolute', width: DEVICE.DEVICE_WIDTH, height: DEVICE.DEVICE_HEIGHT, alignItems: 'center' }]}> */}
      <Animated.View
        style={{
          transform: [{translateX: moveSocialAnimation}],
          position: 'absolute',
          width: DEVICE.DEVICE_WIDTH,
          height: DEVICE.DEVICE_HEIGHT,
          alignItems: 'center',
        }}>
        {/* <Image style={[globalStyles.img, styles.logo, globalStyles.paddingTop]} source={images.appLogo} /> */}
        <View
          style={{
            flex: isIphoneX() ? 2.8 : DEVICE_OS === 'ios' ? 2.1 : 1.6,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              flex: isIphoneX() ? 0.7 : DEVICE_OS === 'ios' ? 0.9 : 0.85,
              marginBottom: wp('8%'),
            }}>
            <ImageSlider
              autoPlayWithInterval={3000}
              style={{backgroundColor: colors.TRANS}}
              images={[images.slide1, images.slide2, images.slide3]}
              customSlide={({index, item, style, width}) => (
                <View key={index} style={style}>
                  <Image source={item} style={styles.sliderImages} />
                </View>
              )}
            />
          </View>
        </View>
        <View style={{flex: DEVICE_OS === 'ios' ? 1 : 0.4}}>
          {renderSocialBtn()}
        </View>
        <Text
          style={{
            ...globalStyles.textHome,
            flex: isIphoneX() ? 0.3 : 0.2,
            fontFamily: fonts.FM,
            textAlign: 'center',
            fontSize: wp(3.3),
            color: colors.blackBase7,
          }}>
          By creating an account, you agree{'\n'} with our{' '}
          <Text
            style={{textDecorationLine: 'underline'}}
            onPress={() =>
              props.navigation.navigate('privacyPolicy', {from: 'privacy'})
            }>
            privacy policy
          </Text>
        </Text>
      </Animated.View>
      {/* <Animated.View style={[moveLoginAnimation.getLayout(), { alignItems: 'center' }]}> */}
      <Animated.View
        style={{
          transform: [{translateX: moveLoginAnimation}],
          alignItems: 'center',
        }}>
        <Image
          style={[globalStyles.img, styles.smallLogo]}
          source={images.appLogo}
        />
        <View style={{flex: 1}}>{isShowFocus && renderLoginWithEmail()}</View>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  logo: {
    height: wp('40%'),
    width: wp('55%'),
    flex: isIphoneX() ? 2.1 : 1.5,
  },
  smallLogo: {
    height: wp('15%'),
    width: wp('20%'),
    flex: 0.25,
    // marginTop: wp('8%')
  },
  imgBackground: {
    height: DEVICE.DEVICE_HEIGHT,
    width: DEVICE.DEVICE_WIDTH,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  socialBtn: {
    // backgroundColor: 'red',
    height: wp('12%'),
    width: wp('80%'),
  },
  separator: {
    width: wp('0.5%'),
    height: hp('3%'),
    backgroundColor: colors.grayDark,
    marginHorizontal: wp('3%'),
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  loaderContainer: {
    // marginTop: hp("2%"),
    // backgroundColor: '#007A49',
    // alignItems: 'center',
    // width: wp("28%"),
    // alignSelf: 'center',
    // borderRadius: wp('2.5%'),
    // height: wp('10%'),
    // justifyContent: 'center',
    marginTop: wp('10%'),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderImages: {
    // backgroundColor: 'red',
    width: wp('80%'),
    height: wp('85%'),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
