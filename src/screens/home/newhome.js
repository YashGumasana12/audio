import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../res/colors';
import { images } from '../../res/images';
import { fonts } from '../../res/fonts';
import { POST } from '../../apiHelper/apiService';
import { base_url, quizAndLevels, common_url } from '../../apiHelper/APIs.json';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';
import SoundPlayer from 'react-native-sound-player';
import AsyncStorage from '@react-native-community/async-storage';
import { chapterData, chapterNumber, levelNumber } from '../../utils/constants';
import { useFocusEffect } from '@react-navigation/native';
const dWidth = Dimensions.get('screen').width;
export default newhome = ({ navigation }) => {
  const task = 8;
  const [completedTask, setCompletedTask] = useState(1);
  const [levels, setLevels] = useState([]);
  const [completedLevels, setCompletedLevels] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      getChaptersNLevels();
    }, []),
  );

  const changeChapter = async chapter => {
    await AsyncStorage.setItem(chapterNumber, chapter.toString());
    await AsyncStorage.setItem(levelNumber, '1');
    setCompletedTask(parseInt(chapter));
    setCompletedLevels(parseInt(1));
    setChaptersNDownloads(null, chapter);
  };

  const getChaptersNLevels = async () => {
    let hCheapterNumber = await AsyncStorage.getItem(chapterNumber);
    let hLevelsNumber = await AsyncStorage.getItem(levelNumber);

    if (hCheapterNumber === null) {
      hCheapterNumber = 1;
      await AsyncStorage.setItem(chapterNumber, hCheapterNumber.toString());
    }
    if (hLevelsNumber === null) {
      hLevelsNumber = 1;
      await AsyncStorage.setItem(levelNumber, hLevelsNumber.toString());
    }
    setCompletedTask(parseInt(hCheapterNumber));
    setCompletedLevels(parseInt(hLevelsNumber));

    getAllLevels(hCheapterNumber);
  };

  const setChaptersNDownloads = async (fhData, hChapter) => {
    setIsLoading(true);
    fhData = fhData
      ? fhData
      : JSON.parse(await AsyncStorage.getItem(chapterData));
    await AsyncStorage.setItem(chapterNumber, hChapter.toString());
    let chapter = parseInt(hChapter) - 1;
    let hData = fhData;

    let hFetchTracks1 = hData[chapter].levels[0]?.options;

    let hFetchTracks2A = hData[chapter].levels[1].sub_level[0]?.options;
    let hFetchTracks2B1 = hData[chapter].levels[1].sub_level[1]?.question;
    let hFetchTracks2B2 = hData[chapter].levels[1].sub_level[1]?.options;
    let hFetchTracks3 = hData[chapter].levels[2]?.question;
    let hFetchTracks4 = hData[chapter].levels[3]?.question;

    const trackPath1 = await startDownload(
      hData[chapter].levels[0].level_question_audio,
      'key010',
    );
    hData[chapter].levels[0].locallevelquestionaudio = trackPath1;

    // const trackPath2 = await startDownload(
    //   hData[chapter].levels[1].level_question_audio,
    //   'key011',
    // );
    hData[chapter].levels[1].locallevelquestionaudio = trackPath1;

    // const trackPath3 = await startDownload(
    //   hData[chapter].levels[2].level_question_audio,
    //   'key012',
    // );
    hData[chapter].levels[2].locallevelquestionaudio = trackPath1;

    // const trackPath4 = await startDownload(
    //   hData[chapter].levels[3].level_question_audio,
    //   'key013',
    // );
    hData[chapter].levels[3].locallevelquestionaudio = trackPath1;

    await Promise.all(
      hFetchTracks1.map(async (item, index1) => {
        const trackPath = await startDownload(
          item.key_track_url,
          'key0' + (index1 + 1),
        );
        hData[chapter].levels[0].options[index1].localTrackPath = trackPath;
        return trackPath;
      }),
    );

    await Promise.all(
      hFetchTracks2A.map(async (item, index1) => {
        const trackPath = await startDownload(
          item.key_track_url,
          'key0' + (index1 + 1),
        );

        hData[chapter].levels[1].sub_level[0].options[index1].localTrackPath =
          trackPath;
      }),
    );

    await Promise.all(
      hFetchTracks2B1.map(async (item, index1) => {
        const trackPath = await startDownload(
          item.key_track_url,
          'key0' + (index1 + 1),
        );
        hData[chapter].levels[1].sub_level[1].question[index1].localTrackPath =
          trackPath;
        return trackPath;
      }),
    );

    await Promise.all(
      hFetchTracks2B2.map(async (item, index1) => {
        const trackPath = await startDownload(
          item.key_track_url,
          'key0' + (index1 + 1),
        );
        hData[chapter].levels[1].sub_level[1].options[index1].localTrackPath =
          trackPath;
        return trackPath;
      }),
    );

    await Promise.all(
      hFetchTracks3.map(async (item, index1) => {
        const trackPath = await startDownload(
          item.key_track_url,
          'key0' + (index1 + 1),
        );
        hData[chapter].levels[2].question[index1].localTrackPath = trackPath;
        return trackPath;
      }),
    );

    await Promise.all(
      hFetchTracks4.map(async (item, index1) => {
        const trackPath = await startDownload(
          item.key_track_url,
          'key0' + (index1 + 1),
        );
        hData[chapter].levels[3].question[index1].localTrackPath = trackPath;
        return trackPath;
      }),
    );

    setLevels([...hData]);
    setIsLoading(false);
  };

  const _errorMessage = text => {
    Keyboard.dismiss();
    setTimeout(() => {
      Toast.show(text);
    }, 100);
  };

  const startDownload = (url, name) => {
    // console.log('RNFetchBlob.fs.dirs.MainBundleDir', RNFetchBlob.fs.dirs.MainBundleDir)
    // console.log('RNFS.DocumentDirectoryPath', RNFS.DocumentDirectoryPath)
    // eslint-disable-next-line no-new
    return new Promise((resolve, reject) => {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'mp3',
        // addAndroidDownloads: {
        //   useDownloadManager: true,
        //   notification: true,
        //   title: name,
        //   path: `${RNFS.DocumentDirectoryPath}/${name}.mp3`, // Android platform
        //   // path: `${RNFS.DocumentDirectoryPath}/${name}.aac`, // Android platform
        //   description: 'Downloading the file',
        // },
      })
        .fetch('GET', url)
        .then(res => {
          resolve('file:' + res.path());
        })
        .catch(e => {
          console.log('====================================');
          console.log(e);
          console.log('====================================');
          reject(false);
        });
    });
  };
  const getAllLevels = async hChapter => {
    setIsLoading(true);
    await POST(quizAndLevels, { data: 'none' }, async function (response) {
      if (!response?.status) {
        _errorMessage(response.responseData.message);
      } else {
        let hData = response.responseData.data;
        await AsyncStorage.setItem(chapterData, JSON.stringify(hData));
        setChaptersNDownloads(hData, hChapter);
      }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.creamBase1 }}>
      <StatusBar barStyle={'dark-content'} />
      <SafeAreaView />
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Image
          source={images.earIcon}
          style={{ width: 40, height: 40, alignSelf: 'center', marginTop: 20 }}
        />
        <View style={styles.taskcontainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
            <>
              <Pressable
                onPress={() => changeChapter(item)}
                style={[
                  styles.tasksNumber,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor:
                      item <= completedTask ? colors.black : colors.creamBase2,
                    borderTopLeftRadius:
                      item >= 2 && item <= completedTask ? 0 : 100,
                    borderTopRightRadius:
                      item >= 1 && item < completedTask ? 0 : 100,
                    borderBottomLeftRadius:
                      item >= 2 && item <= completedTask ? 0 : 100,
                    borderBottomRightRadius:
                      item >= 1 && item < completedTask ? 0 : 100,
                  },
                ]}>
                <Text
                  style={[
                    styles.taskText,
                    {
                      color:
                        item === completedTask
                          ? colors.white
                          : item < completedTask
                            ? colors.creamBase5
                            : colors.black,
                    },
                  ]}>
                  {item}
                </Text>
              </Pressable>
              <View
                style={{
                  width: 5,
                  backgroundColor:
                    item < completedTask ? colors.black : 'transparent',
                }}
              />
            </>
          ))}
        </View>
        <View style={styles.hearbassContainer}>
          <Text style={styles.hearbassText}>
            {levels[completedTask]?.chapter_name || ''}
          </Text>
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate('quickTheory', { data: levels[completedTask] })
          }
          style={styles.quickTheoryContainer}>
          <View style={styles.quickInnerContainer}>
            <Text style={styles.quickText}>
              {levels[completedTask]?.chapter_quick_title || ''}
            </Text>
            <Text style={styles.quickSubText}>
              {levels[completedTask]?.chapter_quick_time || ''} (you can skip
              it)
            </Text>
          </View>
          <View style={styles.quickIcon}></View>
        </Pressable>
        {levels[completedTask]?.levels.map((item, index) => {
          item.navigation =
            index === 0
              ? 'levelOne'
              : index === 1
                ? 'levelTwo'
                : index === 2
                  ? 'levelThird'
                  : 'levelFour';
          // hData[chapter].levels[0].navigation = 'levelOne';
          // hData[chapter].levels[1].navigation = 'levelTwo';
          // hData[chapter].levels[2].navigation = 'levelThird';
          // hData[chapter].levels[3].navigation = 'levelFour';
          return (
            <Pressable
              style={styles.levelContainer}
              disabled={index + 1 > completedLevels}
              onPress={() => {
                navigation.navigate(item.navigation, {
                  data: levels[completedTask - 1].levels,
                  levelIndex: index,
                });
              }}>
              <View style={styles.levelsTab}>
                <Text style={styles.levelText}>{item.level_name}</Text>
                <Text style={styles.leveldesctext}>
                  {item.level_description}
                </Text>
                {index + 1 > completedLevels && (
                  <Image
                    source={images.lock}
                    style={{
                      width: 14,
                      height: 16,
                      position: 'absolute',
                      right: 15,
                      top: 20,
                      zIndex: 1000,
                      resizeMode: 'stretch',
                    }}
                  />
                )}
              </View>
              <View style={styles.levelsGoal}>
                <Text style={styles.levelgoaltext}>Goal {item.goal}</Text>
                <Text style={styles.levelbesttext}>Best {item.best}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      <SafeAreaView />
      <Modal visible={isLoading} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,.5)',
          }}>
          <View
            style={{
              width: 70,
              height: 70,
              backgroundColor: 'rgba(0,0,0,.4)',
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator color={colors.white} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  taskcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  tasksNumber: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.creamBase2,
    borderRadius: 50,
  },
  taskText: {
    color: colors.black,
    fontFamily: fonts.FBB,
    fontSize: 16,
  },
  hearbassContainer: {
    height: 250,
    backgroundColor: colors.creamBase2,
    borderRadius: 20,
    paddingVertical: 15,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 20,
  },
  hearbassText: {
    color: colors.black,
    fontFamily: fonts.FBB,
    fontSize: 28,
  },
  quickTheoryContainer: {
    backgroundColor: colors.creamBase2,
    paddingVertical: 15,
    borderRadius: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  quickInnerContainer: {
    justifyContent: 'center',
    paddingLeft: '15%',
    flex: 1,
  },
  quickText: {
    color: colors.black,
    fontFamily: fonts.FBB,
    fontSize: 16,
    marginBottom: 3,
  },
  quickSubText: {
    color: colors.creamBase5,
    fontFamily: fonts.FBB,
    fontSize: 12,
  },
  quickIcon: {
    height: 24,
    width: 24,
    backgroundColor: colors.creamBase3,
    borderRadius: 50,
  },

  levelContainer: {
    backgroundColor: colors.creamBase2,
    flexDirection: 'row',
    borderRadius: 20,
    height: 80,
    marginBottom: 10,
  },
  levelsTab: {
    backgroundColor: colors.black,
    width: dWidth / 2 - 20,
    borderRadius: 20,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  levelText: {
    color: colors.white,
    fontFamily: fonts.FBB,
    fontSize: 16,
    marginBottom: 3,
  },
  leveldesctext: {
    color: colors.creamBase5,
    fontFamily: fonts.SM,
    fontSize: 12,
  },
  levelsGoal: {
    width: dWidth / 2 - 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelgoaltext: {
    color: colors.creamBase4,
    fontFamily: fonts.FBB,
    fontSize: 16,
    marginBottom: 3,
  },
  levelbesttext: {
    color: colors.black,
    fontFamily: fonts.FBB,
    fontSize: 16,
  },
});
