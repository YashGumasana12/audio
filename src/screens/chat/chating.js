//#region import
//#region RN
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Share,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
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
import * as authActions from '../../redux/actions/authActions';
import * as actions from '../../redux/actions/settingsAction';
//#endregion
//#region third party libs
import {useNavigation} from '@react-navigation/native';
import Util from '../../utils/utils';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {fcmService} from '../../apiHelper/FCMService';
//#endregion
//#endregion
global.isIapSuccess = false;
export default Chating = Props => {
  //#region redux
  const props = Props.props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  //#region local state
  const [focus, setFocus] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const scrollRef = useRef();
  const inputRef = useRef();
  //#endregion local state

  useEffect(() => {
    dispatch(
      actions.onReadMessage(
        authReducers.userDetails.id,
        settingsReducers.chats,
      ),
    );
    setTimeout(() => {
      scrollRef.current.scrollToEnd(false);
    }, 10);
  }, [settingsReducers.chats]);
  return (
    <View style={globalStyles.flex}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <Spacer space={wp('5%')} />
        <View
          style={{
            marginBottom: focus
              ? DEVICE_OS === 'android'
                ? wp(30)
                : wp(5)
              : DEVICE_OS === 'ios'
              ? wp('25%')
              : wp('30%'),
          }}>
          <View style={{width: DEVICE.DEVICE_WIDTH}}>
            <Image
              source={images.chatPeople}
              style={styles.chatPeople}
              resizeMode="contain"
            />
            <Text style={styles.header}>We’re here for you !</Text>
          </View>
          <Spacer space={hp(14)} />
          <View style={styles.msgWrapper}>
            <Text style={styles.msg}>
              Hi {authReducers.userDetails.name}, welcome !{'\n'}
              {'\n'}If you have any question, feedback or issues please let us
              know here.{'\n'}
              {'\n'}We will respond to you asap :)
            </Text>
            <Image
              source={images.polygon}
              style={styles.polygon}
              resizeMode="contain"
            />
          </View>
          <Spacer space={wp(2)} />
          {settingsReducers?.chats?.length !== 0 &&
            settingsReducers?.chats?.data[0] !== undefined &&
            settingsReducers?.chats?.data[0]?.map(item => {
              return (
                <>
                  <View
                    style={[
                      styles.msgWrapper,
                      item.from_id === authReducers.userDetails.id && {
                        alignSelf: 'flex-end',
                        backgroundColor: colors.creamBase3,
                      },
                    ]}>
                    <Text style={styles.msg}>{item.message}</Text>
                    <Image
                      source={images.polygon}
                      style={[
                        styles.polygon,
                        item.from_id === authReducers.userDetails.id
                          ? {
                              tintColor: colors.creamBase3,
                              right: wp(1),
                              transform: [{rotate: '270deg'}],
                              bottom: -wp(2.9),
                            }
                          : {left: wp(1)},
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                  <Spacer space={wp(2)} />
                </>
              );
            })}
        </View>
      </ScrollView>
      <View
        style={[
          styles.typeMessageWrapper,
          {
            bottom: 0,
            width: wp(100),
            height: wp(30),
            backgroundColor: colors.creamBase1,
            position: 'absolute',
          },
        ]}></View>
      {/* <View style={[styles.typeMessageWrapper, focus && { bottom: isIphoneX() ? wp('5%') : wp('2%') }]}> */}
      <View
        style={[
          styles.typeMessageWrapper,
          DEVICE_OS === 'ios' &&
            focus && {bottom: isIphoneX() ? wp('5%') : wp('2%')},
        ]}>
        <TextInput
          ref={inputRef}
          onFocus={() => {
            setFocus(true);
            setTimeout(() => {
              scrollRef.current.scrollToEnd(true);
            }, 100);
          }}
          onBlur={() => setFocus(false)}
          style={styles.input}
          placeholder="Type anything here…"
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity
          disabled={
            (inputMessage === '' ||
              inputMessage.match(/([^ \n]+)/g) === null) &&
            true
          }
          onPress={() => {
            fcmService.checkPermission(token => {
              setIsSending(true);
              dispatch(
                actions.onStoreChat(
                  authReducers.userDetails,
                  inputMessage,
                  () => {
                    scrollRef.current.scrollToEnd(true);
                    setInputMessage('');
                    Keyboard.dismiss();
                    Util.onHapticFeedback();
                    setIsSending(false);
                  },
                ),
              );
            });
          }}>
          {isSending ? (
            <ActivityIndicator size="small" color={colors.grayDark} />
          ) : (
            <Image source={images.send2} style={styles.send} />
          )}
        </TouchableOpacity>
      </View>
      {focus && DEVICE_OS === 'android' && <Spacer space={wp(3)} />}
      {focus && (
        <TouchableOpacity
          onPress={() => {
            inputRef.current.blur();
          }}
          style={[
            styles.backWrapper,
            globalStyles.paddingTop1,
            DEVICE_OS === 'android' && {marginTop: wp(44)},
          ]}>
          <Image style={styles.back} source={images.backRound} />
        </TouchableOpacity>
      )}
      <KeyboardAvoidingView
        behavior={DEVICE_OS == 'ios' ? 'padding' : 'height'}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  chatPeople: {
    height: wp(60),
    width: wp(60),
    alignSelf: 'center',
  },
  header: {
    color: colors.white,
    alignSelf: 'center',
    fontFamily: fonts.QE,
    fontSize: wp(6),
  },
  typeMessageWrapper: {
    backgroundColor: colors.white,
    width: wp(90),
    paddingVertical: wp(1),
    // paddingHorizontal: wp(4),
    paddingLeft: wp(4),
    paddingRight: wp(3),
    bottom: isIphoneX() ? hp(12) : wp(30),
    borderRadius: wp(4.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: wp(10),
    fontFamily: fonts.FM,
    fontSize: wp(3.8),
    width: wp(70),
  },
  send: {
    width: wp(7),
    height: wp(7),
  },
  msgWrapper: {
    width: wp(80),
    borderRadius: wp(4),
    padding: wp(4),
    marginHorizontal: wp(5),
    backgroundColor: colors.blackBase6,
  },
  msg: {
    color: colors.white,
    fontFamily: fonts.FM,
  },
  polygon: {
    position: 'absolute',
    width: wp(8),
    height: wp(8),
    bottom: -wp(2.5),
  },
  backWrapper: {
    position: 'absolute',
    left: wp(5),
  },
  back: {
    height: wp('8.5%'),
    width: wp('8.5%'),
  },
});
