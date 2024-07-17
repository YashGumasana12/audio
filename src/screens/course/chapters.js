//#region import
//#region RN
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
//#endregion
//#region third party libs
import ImageSlider from 'react-native-image-slider';
import AutoHeightImage from 'react-native-auto-height-image';
import Sound from 'react-native-sound';
import convertToProxyURL from 'react-native-video-cache';
import Video from 'react-native-video';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../redux/actions/courseActions';
//#endregion
//#region common files
import Util from '../../utils/utils';
import {image_videos_base_url} from '../../apiHelper/APIs.json';
import globalStyles from '../../res/globalStyles';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {images} from '../../res/images';
import {colors} from '../../res/colors';
import {Spacer} from '../../res/spacer';
import {fonts} from '../../res/fonts';
import VideoDemo from './videoDemo';
import OnBackPressed from '../../components/OnBackPressed';
import {getBottomSpace, isIphoneX} from 'react-native-iphone-x-helper';
//#endregion
//#endregion
var touchX;
export default chapters = Props => {
  const props = Props.props;
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const courseReducers = useSelector(state => state.courseReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  //#region local state
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  //#endregion local state
  //#region ref

  // Sound.setCategory('Playback', false);
  //#endregion ref
  //#region local functions
  //#endregion local functions
  return (
    <View
      style={{...globalStyles.flex, height: DEVICE.DEVICE_HEIGHT}}
      onTouchStart={e => (touchX = e.nativeEvent.pageX)}
      onTouchEnd={e => {
        if (touchX <= 20) {
          if (touchX - e.nativeEvent.pageY < -20) {
            Props.onBack();
          }
        }
      }}>
      <OnBackPressed onBackPressed={() => {}} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            ...globalStyles.paddingTop,
            width: DEVICE.DEVICE_WIDTH,
            marginBottom: isIphoneX() ? getBottomSpace() : wp(5),
            alignItems: 'center',
          }}>
          <Spacer space={wp(6)} />
          <AutoHeightImage
            width={wp(84)}
            source={{uri: Props.chapterIcon}}
            onLoadStart={() => setIsImageLoading(true)}
            onLoadEnd={() => setIsImageLoading(false)}
          />
          <Spacer space={wp(4)} />
          {Props?.chaptersData?.lession?.map((item, index) => {
            return (
              <>
                {index !== 0 && <Spacer space={wp(1)} />}
                <TouchableOpacity
                  style={styles.chaptersContainer}
                  disabled={isDisable}
                  onPress={() => {
                    setIsDisable(true);
                    Props.onChapterClicked(index, () => {
                      setIsDisable(false);
                    });
                  }}>
                  <Text
                    style={{
                      ...globalStyles.textHome,
                      fontSize: wp('4%'),
                      color: colors.white,
                      flex: 1,
                    }}>
                    {item.name}
                  </Text>
                  {!authReducers.userDetails.pro_status &&
                  Props?.chaptersData?.name !== 'The basics' &&
                  Props?.chaptersData?.name !== 'Hearing' &&
                  item?.free_for_all !== '1' ? (
                    <Image
                      style={{...globalStyles.img, width: wp(4), height: wp(4)}}
                      source={images.lock}
                    />
                  ) : (
                    // <Image style={[globalStyles.img, { height: item.is_read === '2' ? wp(5) : wp(6), width: item.is_read === '2' ? wp(5) : wp(6) }, item.is_read === '2' && { marginRight: wp(1), tintColor: colors.creamBase3, paddingTop: wp(3), paddingBottom: wp(3) }]} source={item.is_read === '1' ? images.rightRound : item.is_read === '2' ? images.ic_done : images.rightRoundGrey} />}
                    <Image
                      style={[globalStyles.img, {height: wp(6), width: wp(6)}]}
                      source={
                        (Props?.chaptersData?.course_type === 'hearing' &&
                          item.lession_type === 'normal') ||
                        (Props?.chaptersData?.course_type === 'playing' &&
                          item.lession_type === 'training')
                          ? images.rightRound
                          : item.is_read === '2'
                          ? images.ic_done_round
                          : images.ic_done_round_grey
                      }
                    />
                  )}
                </TouchableOpacity>
              </>
            );
          })}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[
          globalStyles.paddingTop1,
          {position: 'absolute', left: wp('5.5%'), top: hp('0.6%')},
        ]}
        onPress={() => Props.onBack()}>
        <Image
          style={[globalStyles.img, {height: wp('8.5%'), width: wp('8.5%')}]}
          source={images.backRound}
        />
      </TouchableOpacity>

      {isImageLoading && (
        <View
          style={{
            position: 'absolute',
            height: hp(100),
            width: DEVICE.DEVICE_WIDTH,
            backgroundColor: colors.creamBase1,
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  chaptersContainer: {
    backgroundColor: colors.blackBase6,
    borderRadius: wp(4),
    padding: wp(3),
    paddingTop: wp(4),
    paddingBottom: wp(4),
    paddingLeft: wp(6),
    alignItems: 'center',
    width: wp(90),
    alignSelf: 'center',
    flexDirection: 'row',
  },
});
