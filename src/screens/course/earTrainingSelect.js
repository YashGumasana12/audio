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
import AutoHeightImage from 'react-native-auto-height-image';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../../redux/actions/courseActions';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {images} from '../../res/images';
import {colors} from '../../res/colors';
import {Spacer} from '../../res/spacer';
import {fonts} from '../../res/fonts';
import OnBackPressed from '../../components/OnBackPressed';
import Util from '../../utils/utils';
import * as trainingJson from '../../utils/keyTraining.json';
//#endregion
//#endregion
export default EarTrainingSelect = Props => {
  const props = Props.props;
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const courseReducers = useSelector(state => state.courseReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  //#region local state
  const [earData, setEarData] = useState({});
  const [isImageLoading, setIsImageLoading] = useState(true);
  //#endregion local state
  //#region ref
  //#endregion ref
  //#region local functions
  useEffect(() => {
    setEarData(courseReducers.selectedEarLevel);
  }, [courseReducers.selectedEarLevel]);

  //#endregion local functions
  return (
    <View style={{...globalStyles.flex}}>
      <OnBackPressed onBackPressed={() => {}} />

      <View style={{height: DEVICE.DEVICE_HEIGHT, width: DEVICE.DEVICE_WIDTH}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <>
            <View
              style={{
                ...globalStyles.paddingTop1,
                top: -wp(2),
                alignItems: 'center',
              }}>
              <Image
                style={[
                  globalStyles.img,
                  {height: wp('16%'), width: wp('16%')},
                ]}
                source={images.lessonTitleIcon}
              />
              <Spacer space={wp(1)} />
              <View style={{width: wp(85)}}>
                <Text
                  style={[
                    globalStyles.textHome,
                    {fontSize: wp(8), color: '#333333'},
                  ]}>
                  {courseReducers?.selectedCourseItem?.levelName?.toUpperCase()}
                </Text>
                <Spacer space={-wp(0.4)} />
                <Text
                  style={{
                    ...globalStyles.textHome,
                    fontSize: wp(4.8),
                    color: colors.white,
                  }}>
                  {courseReducers?.selectedCourseItem?.name}
                </Text>
                <Spacer space={wp(0.5)} />
                {earData.levelImg !== undefined && (
                  <AutoHeightImage
                    source={earData.levelImg}
                    width={
                      earData.id === 3 ||
                      earData.id === 4 ||
                      earData.id === 8 ||
                      earData.id === 9
                        ? wp(60)
                        : wp(50)
                    }
                    onLoadEnd={() => setIsImageLoading(false)}
                  />
                )}
              </View>
            </View>
            <Spacer space={wp(3)} />
            <View style={{...styles.videoContainer}}>
              {/* <Spacer space={wp(3)} />
                            <Text style={{ ...globalStyles.textHome, ...styles.italicTxt, color: colors.grayDark3 }}>Select what you’ll hear</Text>
                            <Spacer space={wp(2)} />
                            {courseReducers.earTrainingTypes.map((item, index) => {
                                return (
                                    <>
                                        {index !== 0 && <Spacer space={wp(1.3)} />}
                                        <TouchableOpacity style={[{ ...styles.exploreSongs, ...styles.trainingTypesBtns, width: wp(80) }, item.isSelected && { backgroundColor: earData.is_major ? colors.creamBase3 : colors.orange }]}
                                            disabled={item.isSelected}
                                            onPress={() => {
                                                dispatch(actions.onEarTrainingItemClicked(courseReducers.earTrainingTypes, index));
                                                // index !== 0 && setSelectedLetterIndex('');
                                            }}>
                                            <Text style={{ ...globalStyles.textHome, color: item.isSelected ? (earData.is_major ? colors.greenTxt : colors.orangeTxt) : colors.grayDark3, fontSize: wp(4.1), textAlign: 'center' }}>{item.title}</Text>
                                        </TouchableOpacity>
                                    </>
                                )
                            })} */}
              <Spacer space={wp(3)} />
              <Text
                style={{
                  ...globalStyles.textHome,
                  ...styles.italicTxt,
                  color: colors.grayDark3,
                }}>
                Select the playing speed
              </Text>
              <Spacer space={wp(2)} />
              <View style={{...styles.tabsMainContainer}}>
                {courseReducers.playingSpeed.map((item, index) => {
                  return (
                    <>
                      <TouchableOpacity
                        style={[
                          {
                            ...styles.exploreSongs,
                            ...styles.trainingTypesBtns,
                            ...styles.trainingTabsBtns,
                          },
                          item.isSelected && {
                            backgroundColor: earData.is_major
                              ? colors.creamBase3
                              : colors.orange,
                          },
                        ]}
                        disabled={item.isSelected}
                        onPress={() => {
                          dispatch(
                            actions.onEarTrainingTabsClicked(
                              courseReducers.playingSpeed,
                              index,
                            ),
                          );
                        }}>
                        <Text
                          style={{
                            ...globalStyles.textHome,
                            fontSize: wp(4.2),
                            color: item.isSelected
                              ? earData.is_major
                                ? colors.greenTxt
                                : colors.orangeTxt
                              : colors.grayDark3,
                            textAlign: 'center',
                          }}>
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    </>
                  );
                })}
              </View>
              <Spacer space={wp(8)} />
              <TouchableOpacity
                onPress={() => {
                  dispatch(actions.onSetCorrectAns(0));
                  Util.onHapticFeedback();
                  setTimeout(() => {
                    Props.onStartEarTraining();
                    dispatch(
                      actions.onEarTrainingStart(
                        courseReducers,
                        courseReducers.selectedEarLevel,
                        courseReducers.lettersArray.training,
                        courseReducers.earTrainingTypes,
                        courseReducers.playingSpeed,
                      ),
                    );
                  }, 100);
                }}>
                <AutoHeightImage
                  source={
                    earData.is_major ? images.earStart : images.earStartOrg
                  }
                  width={wp(55)}
                />
              </TouchableOpacity>
              <Spacer space={wp(3)} />
            </View>
          </>
        </ScrollView>
      </View>
      <TouchableOpacity
        style={[
          globalStyles.paddingTop1,
          {position: 'absolute', left: wp('5.5%'), top: hp('0.6%')},
        ]}
        onPress={() => {
          Props.onBack();
          // setTimeout(() => {
          //     setIsImageLoading(true);
          // }, 300);
        }}>
        <Image
          style={[globalStyles.img, {height: wp('8.5%'), width: wp('8.5%')}]}
          source={earData.is_major ? images.backRound : images.orangeBack}
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
  videoContainer: {
    backgroundColor: colors.blackBase6,
    borderRadius: wp(4),
    padding: wp(2),
    alignItems: 'center',
    width: wp(90),
    alignSelf: 'center',
  },
  italicTxt: {
    fontFamily: fonts.FM,
    color: colors.grayBold,
    fontWeight: 'normal',
    fontSize: wp(4.1),
  },
  exploreSongs: {
    backgroundColor: colors.Dark_Gray,
    padding: wp(2.2),
    paddingLeft: wp(4),
    paddingRight: wp(4),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: wp(1.5),
    alignSelf: 'flex-start',
  },
  trainingTypesBtns: {
    flexDirection: 'column',
    alignSelf: 'center',
    padding: wp(2.5),
    paddingLeft: wp(5.7),
    paddingRight: wp(5.7),
    marginLeft: 0,
  },
  trainingTabsBtns: {
    padding: wp(2.1),
    paddingLeft: wp(3.5),
    paddingRight: wp(3.5),
    marginLeft: 0,
  },
  tabsMainContainer: {
    width: wp(80),
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
