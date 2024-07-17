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
import {image_videos_base_url} from '../../apiHelper/APIs.json';
//#endregion
//#endregion
let moveTabsAnimation = new Animated.Value(0);
let moveFavAnimation = new Animated.Value(0);
let moveExploreAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
export default EarTraining = Props => {
  const props = Props.props;
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const courseReducers = useSelector(state => state.courseReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  //#region local state
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [tabsCurrentIndex, setTabsCurrentIndex] = useState(0);
  const [trainingLevels, setTrainingLevels] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  //#endregion local state
  //#region ref
  //#endregion ref
  //#region local functions
  useEffect(() => {
    if (Object.keys(courseReducers.earTrainingData).length !== 0) {
      let isPro = authReducers.userDetails.pro_status;
      let levelsArray = [
        {
          id: 0,
          image: images.major1,
          is_major: true,
          isActive: true,
          levelImg: images.level1,
          title: 'level1',
          best_time:
            courseReducers?.earTrainingData?.major[0]?.best_time / 1000,
          correct_answer:
            courseReducers?.earTrainingData?.major[0]?.correct_answer,
        },
        {
          id: 1,
          image: images.major2,
          is_major: true,
          isActive: true,
          levelImg: images.level2,
          title: 'level2',
          best_time:
            courseReducers?.earTrainingData?.major[1]?.best_time / 1000,
          correct_answer:
            courseReducers?.earTrainingData?.major[1]?.correct_answer,
        },
        {
          id: 2,
          image: images.major3,
          is_major: true,
          isActive: true,
          levelImg: images.level3,
          title: 'level3',
          best_time:
            courseReducers?.earTrainingData?.major[2]?.best_time / 1000,
          correct_answer:
            courseReducers?.earTrainingData?.major[2]?.correct_answer,
        },
        {
          id: 3,
          image: isPro ? images.major4_pro : images.major4,
          is_major: true,
          isActive: isPro ? true : false,
          levelImg: images.level4,
          title: 'level3',
          best_time:
            courseReducers?.earTrainingData?.major[3]?.best_time / 1000,
          correct_answer:
            courseReducers?.earTrainingData?.major[3]?.correct_answer,
        },
        {
          id: 4,
          image: isPro ? images.major5_pro : images.major5,
          is_major: true,
          isActive: isPro ? true : false,
          levelImg: images.level5,
          title: 'level4',
          best_time:
            courseReducers?.earTrainingData?.major[4]?.best_time / 1000,
          correct_answer:
            courseReducers?.earTrainingData?.major[4]?.correct_answer,
        },
        {
          id: 5,
          image: isPro ? images.minor1_pro : images.minor1,
          is_major: false,
          isActive: isPro ? true : false,
          levelImg: images.minorLevel1,
          title: 'level1',
          best_time:
            courseReducers?.earTrainingData?.minor[0]?.best_time / 1000,
          correct_answer:
            courseReducers?.earTrainingData?.minor[0]?.correct_answer,
        },
        {
          id: 6,
          image: isPro ? images.minor2_pro : images.minor2,
          is_major: false,
          isActive: isPro ? true : false,
          levelImg: images.minorLevel2,
          title: 'level2',
          best_time:
            courseReducers?.earTrainingData?.minor[1]?.best_time / 1000,
          correct_answer:
            courseReducers?.earTrainingData?.minor[1]?.correct_answer,
        },
        {
          id: 7,
          image: isPro ? images.minor3_pro : images.minor3,
          is_major: false,
          isActive: isPro ? true : false,
          levelImg: images.minorLevel3,
          title: 'level3',
          best_time:
            courseReducers?.earTrainingData?.minor[2]?.best_time / 1000,
          correct_answer:
            courseReducers?.earTrainingData?.minor[2]?.correct_answer,
        },
        {
          id: 8,
          image: isPro ? images.minor4_pro : images.minor4,
          is_major: false,
          isActive: isPro ? true : false,
          levelImg: images.minorLevel4,
          title: 'level3',
          best_time:
            courseReducers?.earTrainingData?.minor[3]?.best_time / 1000,
          correct_answer:
            courseReducers?.earTrainingData?.minor[3]?.correct_answer,
        },
        {
          id: 9,
          image: isPro ? images.minor5_pro : images.minor5,
          is_major: false,
          isActive: isPro ? true : false,
          levelImg: images.minorLevel5,
          title: 'level4',
          best_time:
            courseReducers?.earTrainingData?.minor[4]?.best_time / 1000,
          correct_answer:
            courseReducers?.earTrainingData?.minor[4]?.correct_answer,
        },
      ];
      setTrainingLevels(levelsArray);
      isLoaded && setIsImageLoading(false);
      setIsLoaded(true);
    }
  }, [authReducers.userDetails.pro_status, courseReducers.earTrainingData]);
  // const renderMajorList = (value) => {
  //     return (
  //         trainingLevels.length !== 0 && trainingLevels?.map((item, index) => {
  //             return (
  //                 value === item.is_major &&
  //                 <TouchableOpacity style={{ alignSelf: 'center', marginBottom: wp(3) }} onPress={() => dispatch(actions.onEarTrainingLevelClicked(item, Props))}>
  //                     {(item.chapter_detail[0].media === null || item.chapter_detail[0].media === '') ? <Text style={{ ...globalStyles.textHome, fontFamily: fonts.FM, fontSize: wp('4%'), alignSelf: 'center' }}>image</Text> :
  //                         <AutoHeightImage width={wp(90)} source={{ uri: image_videos_base_url + item.chapter_detail[0].media }}
  //                             onLoadEnd={() => setIsImageLoading(false)}>
  //                             <View style={styles.indicatorContainer}>
  //                                 <Text style={{ ...globalStyles.textHome, fontSize: wp(4), color: tabsCurrentIndex === 0 ? colors.creamBase3 : colors.orange }}>0.39<Text style={{ color: colors.grayDark }}>sec</Text></Text>
  //                             </View>
  //                         </AutoHeightImage>}
  //                 </TouchableOpacity>
  //             );
  //         })
  //     )
  // }
  const renderMajorList = value => {
    return trainingLevels?.map((item, index) => {
      return (
        value === item.is_major && (
          <TouchableOpacity
            style={{alignSelf: 'center', marginBottom: wp(3)}}
            onPress={() => {
              !item.isActive
                ? Props.onUnlockLevels()
                : dispatch(actions.onEarTrainingLevelClicked(item, Props));
            }}>
            {item.image === null || item.image === '' ? (
              <Text
                style={{
                  ...globalStyles.textHome,
                  fontFamily: fonts.FM,
                  fontSize: wp('4%'),
                  alignSelf: 'center',
                }}>
                image
              </Text>
            ) : (
              <AutoHeightImage
                width={wp(90)}
                source={item.image}
                onLoadEnd={() => setIsImageLoading(false)}>
                <View style={styles.indicatorContainer}>
                  {/* <Text style={{ ...globalStyles.textHome, fontSize: wp(4), color: tabsCurrentIndex === 0 ? colors.creamBase3 : colors.orange }}>{item.best_time == 0 ? '?' : item.best_time.toString().match(/^\d+(?:\.\d{0,2})?/)}<Text style={{ color: colors.grayDark }}>sec</Text></Text> */}
                  {/* <Text style={{ ...globalStyles.textHome, fontSize: wp(4), color: tabsCurrentIndex === 0 ? colors.creamBase3 : colors.orange }}>{item.best_time == 0 ? '?' : item.best_time.toString().match(/^\d+(?:\.\d{0,2})?/)}</Text> */}
                  <Text
                    style={{
                      ...globalStyles.textHome,
                      fontSize: wp(4),
                      color:
                        tabsCurrentIndex === 0
                          ? colors.creamBase3
                          : colors.orange,
                    }}>
                    {item.best_time === 0 ? '?' : item.correct_answer}
                    <Text style={{fontFamily: fonts.FMC}}>/</Text>20
                  </Text>
                </View>
              </AutoHeightImage>
            )}
          </TouchableOpacity>
        )
      );
    });
  };
  //#endregion local functions
  return (
    <View style={{...globalStyles.flex}}>
      <OnBackPressed
        onBackPressed={() => {
          // Props.onBack();
          // setTimeout(() => {
          //     setIsImageLoading(true);
          // }, 300);
        }}
      />

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
                <Text
                  style={{
                    ...globalStyles.textHome,
                    fontFamily: fonts.FM,
                    color: colors.grayDark4,
                  }}>
                  Will help you understand the notes & find melodies.
                </Text>
              </View>
            </View>
            <Spacer space={wp(1)} />
            <View style={styles.tabsMainContainer}>
              <View style={[globalStyles.searchBox, styles.tabsMainContainer1]}>
                <Animated.View
                  style={[
                    styles.tabsItemContainer,
                    styles.tabsItemAnimation,
                    {transform: [{translateX: moveTabsAnimation}]},
                    tabsCurrentIndex === 1 && {backgroundColor: colors.orange},
                  ]}>
                  <Text style={[globalStyles.textHome, {color: colors.TRANS}]}>
                    "
                  </Text>
                </Animated.View>
                {['MAJOR', 'MINOR'].map((data, index) => {
                  return (
                    <TouchableOpacity
                      style={styles.tabsItemContainer}
                      onPress={() => {
                        setTabsCurrentIndex(index);
                        Util.slideAnimation(
                          moveTabsAnimation,
                          index === 0 ? 0 : wp(45),
                        );
                        Util.slideAnimation(
                          moveFavAnimation,
                          index === 0 ? 0 : -DEVICE.DEVICE_WIDTH,
                        );
                        Util.slideAnimation(
                          moveExploreAnimation,
                          index === 0 ? DEVICE.DEVICE_WIDTH : 0,
                        );
                      }}>
                      {/* <Image style={[globalStyles.img, { height: wp('4%'), width: wp('4%'), position: 'absolute', left: index === 0 ? wp('3.8%') : wp('3%') }, index === 0 && { tintColor: colors.grayDark }, index === tabsCurrentIndex && { tintColor: colors.greenTxt }]} source={index === 0 ? images.save : images.playlist} /> */}
                      <Text
                        style={[
                          globalStyles.textHome,
                          {
                            fontSize: wp('4%'),
                            color:
                              index === tabsCurrentIndex
                                ? tabsCurrentIndex === 0
                                  ? colors.greenTxt
                                  : colors.orangeTxt
                                : colors.grayDark6,
                          },
                        ]}>
                        {data}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <Spacer space={wp(1)} />
            <View>
              {/* <Animated.View style={[moveFavAnimation.getLayout(), tabsCurrentIndex === 1 && { position: 'absolute' }]}> */}
              <Animated.View
                style={[
                  {transform: [{translateX: moveFavAnimation}]},
                  tabsCurrentIndex === 1 && {position: 'absolute'},
                ]}>
                <View style={styles.patternsMainContainer}>
                  {renderMajorList(true)}
                </View>
              </Animated.View>
              {/* <Animated.View style={[moveExploreAnimation.getLayout(), tabsCurrentIndex === 0 && { position: 'absolute' }]}> */}
              <Animated.View
                style={[
                  {transform: [{translateX: moveExploreAnimation}]},
                  tabsCurrentIndex === 0 && {position: 'absolute'},
                ]}>
                <View style={styles.patternsMainContainer}>
                  {renderMajorList(false)}
                </View>
              </Animated.View>

              <Spacer space={wp(2)} />
              {/* {isLessonQue && renderQuestionTextInput(scrollRef, index)} */}
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
          dispatch(actions.onUpdateCourse(authReducers.userDetails));
          Props.onBack();
          setTimeout(() => {
            setIsImageLoading(true);
          }, 300);
        }}>
        <Image
          style={[globalStyles.img, {height: wp('8.5%'), width: wp('8.5%')}]}
          source={tabsCurrentIndex === 1 ? images.orangeBack : images.backRound}
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
  tabsMainContainer: {
    width: wp(90),
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabsMainContainer1: {
    width: wp(90),
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 0,
    padding: 0,
    justifyContent: 'flex-start',
  },
  tabsItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp('1.3%'),
    paddingBottom: hp('1.3%'),
    // padding: wp('2%'),
    borderRadius: 8,
    // backgroundColor: 'red'
  },
  tabsItemAnimation: {
    position: 'absolute',
    backgroundColor: colors.creamBase3,
    width: wp(45),
    // paddingTop: hp('1%'),
    // paddingBottom: hp('1%'),
    // marginLeft: wp(0.65),
    // marginTop: wp(0.65)
  },
  patternsMainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp(90),
    alignSelf: 'center',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: wp(2),
    left: wp(11.5),
    zIndex: 50,
    flexDirection: 'row',
  },
});
