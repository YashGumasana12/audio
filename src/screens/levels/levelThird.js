import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {colors} from '../../res/colors';
import {images} from '../../res/images';
import {fonts} from '../../res/fonts';
import SoundPlayer from 'react-native-sound-player';
import {levelNumber} from '../../utils/constants';
import AsyncStorage from '@react-native-community/async-storage';
const dWidth = Dimensions.get('screen').width;
const dHeight = Dimensions.get('screen').height;
export default levelThird = ({navigation, route}) => {
  const level3Data = route.params.data;
  const levelIndex = route.params.levelIndex;
  const thisLevelData = level3Data[levelIndex];
  const questionID = thisLevelData.level_question.split(',');
  const [nodes, setNodes] = useState(questionID);
  const [nodesPosition, setNodesPosition] = useState(-1);
  let timeInterval = null;
  useEffect(() => {
    myTimer();
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const myTimer = () => {
    let cc = 0;
    timeInterval = setInterval(() => {
      if (cc === 4) {
        clearInterval(timeInterval);
        cc = 0;
        setNodesPosition(-1);
        return;
      }

      setNodesPosition(cc + 1);
      cc++;
    }, 2000);
  };

  useEffect(() => {
    let hPath = thisLevelData?.question[nodesPosition - 1]?.localTrackPath;
    playTrack(hPath);
  }, [nodesPosition]);
  const playTrack = trackPath => {
    if (trackPath) {
      try {
        SoundPlayer.playUrl(trackPath, 'mp3');
      } catch (e) {
        console.log(`cannot play the sound file`, e);
      }
    }
  };
  const onSubmit = async () => {
    await AsyncStorage.setItem(levelNumber, '4');
    navigation.goBack();
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.creamBase1}}>
      <StatusBar barStyle={'dark-content'} />
      <SafeAreaView />
      <ScrollView style={{paddingHorizontal: 20}}>
        <View
          style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={images.leftArrow}
              style={{
                width: 18,
                height: 18,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
            />
          </Pressable>
          <View style={{flex: 1}}>
            <Image
              source={images.earIcon}
              style={{
                width: 40,
                height: 40,
                alignSelf: 'center',
                marginRight: 10,
              }}
            />
          </View>
        </View>
        <View style={styles.progress}>
          <View
            style={[
              styles.progressline,
              {width: `${nodesPosition === -1 ? 0 : nodesPosition * 25}%`},
            ]}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titletext}>Left hand - Level 1</Text>
          <Text style={styles.subtitletext}>
            Play this bassline on your piano with your left hand’s thumb &
            little finger.
          </Text>
        </View>
        <View style={styles.playContainer}>
          <View style={styles.playiconcontainer}>
            <Pressable
              onPress={() => playTrack(thisLevelData.locallevelquestionaudio)}>
              <Image source={images.ic_play} style={styles.platIconst} />
            </Pressable>
          </View>
          <Text style={styles.playText}>
            {thisLevelData?.level_track_name || 'No Name'}
          </Text>
          <View style={styles.playNodecontainer}>
            {nodes.map((item, index) => (
              <View style={styles.nodeItem}>
                <Text
                  style={[
                    styles.nodetext,
                    {
                      color:
                        index < nodesPosition
                          ? colors.white
                          : colors.creamBase3,
                    },
                  ]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.nodeDesc}>1 is major, so use these notes</Text>
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: colors.creamBase2,
          height: 100,
          alignItems: 'center',
        }}>
        <Pressable style={styles.btnContainer} onPress={onSubmit}>
          <Text style={styles.btnText}>Done, next</Text>
        </Pressable>
        <SafeAreaView />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  progress: {
    height: 16,
    backgroundColor: colors.creamBase2,
    borderRadius: 15,
    marginVertical: 20,
  },
  progressline: {
    height: 16,
    backgroundColor: colors.black,
    borderRadius: 15,
    width: '25%',
  },
  titleContainer: {
    alignItems: 'center',
  },
  titletext: {
    color: colors.black,
    fontFamily: fonts.FBB,
    fontSize: 18,
    marginBottom: 10,
  },
  subtitletext: {
    color: colors.creamBase5,
    fontFamily: fonts.SM,
    fontSize: 12,
    textAlign: 'center',
    width: '70%',
  },

  playContainer: {
    marginTop: '30%',
    height: dHeight / 2.5,
    backgroundColor: colors.creamBase2,
    borderRadius: 20,
    alignItems: 'center',
  },
  playiconcontainer: {
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.Black,
    borderRadius: 100,
    position: 'absolute',
    top: -32.5,
  },
  platIconst: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  playNodecontainer: {
    flexDirection: 'row',
    marginVertical: 25,
  },

  playText: {
    marginTop: 50,
    color: colors.black,
    fontFamily: fonts.QE,
    fontSize: 24,
  },
  nodeItem: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.creamBase5,
    marginRight: 10,
  },
  nodetext: {
    color: colors.white,
    fontFamily: fonts.FBB,
    fontSize: 30,
  },
  nodeDesc: {
    color: colors.creamBase5,
    fontFamily: fonts.SM,
    fontSize: 12,
  },
  btnContainer: {
    backgroundColor: colors.Black,
    borderRadius: 18,
    paddingHorizontal: 30,
    paddingVertical: 20,
    width: '50%',
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: {
    color: colors.white,
    fontFamily: fonts.SM,
    fontSize: 14,
  },
});
