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
  Keyboard,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {colors} from '../../res/colors';
import {images} from '../../res/images';
import {fonts} from '../../res/fonts';
import {POST} from '../../apiHelper/apiService';
import {base_url, newLevels, common_url} from '../../apiHelper/APIs.json';
import Toast from 'react-native-simple-toast';
import RNFetchBlob from 'rn-fetch-blob';
import SoundPlayer from 'react-native-sound-player';
const dWidth = Dimensions.get('screen').width;
export default quickTheory = ({navigation, route}) => {
  const data = route.params.data;
  console.log('🚀 ~ data:', data);
  const [songList, setSongList] = useState(data.quick_section);

  const playTrack = trackPath => {
    if (trackPath) {
      try {
        SoundPlayer.playUrl(trackPath, 'mp3');
      } catch (e) {
        console.log(`cannot play the sound file`, e);
      }
    }
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
        <Text style={styles.quickText}>{data?.chapter_quick_title}</Text>
        <Text style={styles.hearbassText}>{data?.chapter_name}</Text>
        <View style={styles.hearbassContainer}>
          <Text style={styles.levelText}>Any song can be played on piano</Text>
          {songList.map(item => {
            return (
              <View
                style={{
                  width: '70%',
                  marginBottom: 40,
                }}>
                <Text style={styles.songTitleText}>{item.song_generic}</Text>
                <Text style={styles.songNameText}>Ex. {item.song_name}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.originalText}>Original</Text>

                    <Image
                      source={images.downCrossRuf}
                      style={{
                        width: 40,
                        height: 40,
                        marginTop: -10,
                        marginLeft: 10,
                      }}
                    />
                  </View>
                  <Text style={styles.pianoText}>Piano version</Text>
                </View>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Pressable
                    style={{
                      backgroundColor: colors.black,
                      width: 60,
                      height: 60,
                      borderRadius: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => playTrack(common_url + item.original_track)}>
                    <Image
                      source={images.ic_play}
                      style={{tintColor: colors.creamBase2, marginLeft: 8}}
                    />
                  </Pressable>
                  <Image
                    source={images.leftRuf}
                    style={{
                      width: 70,
                      height: 70,
                      marginTop: -10,
                      marginHorizontal: 10,
                      resizeMode: 'contain',
                    }}
                  />
                  <Pressable
                    style={{
                      backgroundColor: colors.black,
                      width: 60,
                      height: 60,
                      borderRadius: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 15,
                    }}
                    onPress={() => playTrack(common_url + item.piano_track)}>
                    <Image
                      source={images.ic_play}
                      style={{tintColor: colors.creamBase2, marginLeft: 8}}
                    />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <SafeAreaView />
    </View>
  );
};

const styles = StyleSheet.create({
  hearbassContainer: {
    backgroundColor: colors.creamBase2,
    borderRadius: 20,
    alignItems: 'center',
  },
  hearbassText: {
    color: colors.black,
    fontFamily: fonts.FBB,
    fontSize: 28,
    alignSelf: 'center',
    marginBottom: 20,
  },
  songNameText: {
    color: colors.black,
    fontFamily: fonts.FM,
    fontSize: 13,
    alignSelf: 'center',
    marginBottom: 20,
  },
  songTitleText: {
    color: colors.black,
    fontFamily: fonts.FM,
    fontSize: 13,
    alignSelf: 'center',
  },
  originalText: {
    color: colors.black,
    fontFamily: fonts.FM,
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 18,
  },
  pianoText: {
    color: colors.black,
    fontFamily: fonts.FM,
    fontSize: 15,
    alignSelf: 'center',
    marginTop: 18,
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
    color: colors.creamBase4,
    fontFamily: fonts.FBB,
    fontSize: 16,
    marginBottom: 3,
    marginTop: 10,
    alignSelf: 'center',
  },

  levelText: {
    color: colors.black,
    fontFamily: fonts.SM,
    fontSize: 13,
    alignSelf: 'center',
    marginVertical: 20,
  },
});
