//#region import
//#region RN
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import {images} from '../../res/images';
import {colors} from '../../res/colors';
import {fonts} from '../../res/fonts';
import {Spacer} from '../../res/spacer';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {privacy_policy} from '../../apiHelper/APIs.json';
import {POST} from '../../apiHelper/apiService';
import OnBackPressed from '../../components/OnBackPressed';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as action from '../../redux/actions/authActions';
//#endregion
//#region third party libs
import {WebView} from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {Toolbar} from '../../components/Toolbar';
import RenderHtml from 'react-native-render-html';
import {color} from 'react-native-reanimated';
const regex = /(<([^>]+)>)/gi;
//#endregion
//#endregion

const css = `<head><style type="text/css"> @font-face {color:'red';font-family: 'Futura-Medium'; src:url('file:///android_asset/fonts/Futura Md BT Medium.ttf')}</style></head>`;

export default privacyPolicy = props => {
  //#region local state
  const navigation = useNavigation();
  const [content, setContent] = useState('');
  //#endregion local state

  useEffect(() => {
    var requestBody = {
      type:
        props.route.params.from === 'privacy'
          ? 'privacy_policy'
          : 'Terms of Use',
    };
    POST(privacy_policy, requestBody, function (response) {
      if (response.status == '1') {
        console.log(response.responseData.message);
      } else {
        setContent(response.responseData.data.content);
      }
    });
  }, []);
  return (
    <View style={globalStyles.flex}>
      <OnBackPressed onBackPressed={() => navigation.goBack()} />
      <Toolbar onPress={() => navigation.goBack()} isProfile={true} />
      <Spacer space={wp('4%')} />
      <View style={{width: wp('80%'), alignSelf: 'center'}}>
        <Text style={{fontFamily: fonts.FM, color: colors.black}}>
          {props.route.params.from === 'privacy'
            ? 'Privacy Policy'
            : 'Terms of Service'}
        </Text>
      </View>
      {DEVICE_OS === 'ios' ? (
        <WebView style={styles.webViewContainer} source={{html: content}} />
      ) : (
        <WebView
          style={styles.webViewContainer}
          source={{html: css + content}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backIcon: {
    height: hp('3.5%'),
    width: wp('6.5%'),
    resizeMode: 'contain',
    marginTop: hp('12%'),
    alignSelf: 'center',
    transform: [{rotate: '180deg'}],
  },
  logo: {
    fontSize: wp('17%'),
    alignSelf: 'center',
    fontFamily: fonts.FC,
    color: 'rgb(0,205,113)',
  },
  webViewContainer: {
    height: hp('100%'),
    marginBottom: hp('5%'),
    width: wp('81%'),
    marginTop: hp('1%'),
    alignSelf: 'center',
    padding: 0,
    backgroundColor: colors.TRANS,
  },
});

const s_tagsStyles = {
  p: {
    fontSize: wp('2.5%'),
    fontFamily: fonts.FM,
    color: colors.white,
    marginBottom: 0,
  },
  span: {
    fontSize: wp('2.5%'),
    fontFamily: fonts.FM,
    color: colors.white,
    marginBottom: 0,
  },
  div: {
    fontSize: wp('2.5%'),
    fontFamily: fonts.FM,
    color: colors.white,
  },
  h2: {
    fontSize: wp('2.5%'),
    fontFamily: fonts.FM,
    color: colors.white,
  },
};
