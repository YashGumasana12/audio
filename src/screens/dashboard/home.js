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
  Animated,
  Keyboard,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
//#endregion
//#region third party libs
import {isIphoneX} from 'react-native-iphone-x-helper';
import AutoHeightImage from 'react-native-auto-height-image';
//#endregion
//#region redux
import {useSelector, useDispatch} from 'react-redux';
import * as action from '../../redux/actions/authActions';
import * as setingActions from '../../redux/actions/settingsAction';
//#endregion
//#region common files
import globalStyles from '../../res/globalStyles';
import {DEVICE, DEVICE_OS, hp, wp} from '../../utils/constants';
import {images} from '../../res/images';
import {Toolbar} from '../../components/Toolbar';
import TextInputCustom from '../../components/TextInputCustom';
import {colors} from '../../res/colors';
import {Spacer} from '../../res/spacer';
import {UseKeyboard} from '../../components/UseKeyboard';
import {fonts} from '../../res/fonts';
import Util from '../../utils/utils';
import {getData, removeData, saveData} from '../../utils/asyncStorageHelper';
import OnBackPressed from '../../components/OnBackPressed';
import {AppModal} from '../../components/AppModal';
import {fcmService} from '../../apiHelper/FCMService';
import {IAPModal} from '../../components/IAPModal';
import {useFocusEffect} from '@react-navigation/native';
//#endregion
//#endregion

global.tabsCurrentIndex = 0;
let moveTabsAnimation = new Animated.Value(0);
let moveSongsAnimation = new Animated.Value(0);
let movePlaylistAnimation = new Animated.Value(DEVICE.DEVICE_WIDTH);
export default home = Props => {
  const props = Props.props;
  //#region redux
  const dispatch = useDispatch();
  const authReducers = useSelector(state => state.authReducers);
  const settingsReducers = useSelector(state => state.settingsReducers);
  //#endregion redux
  //#region local state
  const refPlaylistTitle = useRef(null);
  const [searchSongTxt, setSearchSongTxt] = useState('');
  const [searchSongs, setSearchSongs] = useState([]);
  const [tappedIndex, setTappedIndex] = useState(0);
  const [keyboardHeight] = UseKeyboard();
  const [isFocusOnSearch, setIsFocusOnSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddPlaylistLoading, setIsAddPlaylistLoadingg] = useState(false);
  const [filterType, setFilterType] = useState(1);
  const [playlistFilterType, setPlaylistFilterType] = useState(1);
  const [itemTappedIndex, setItemTappedIndex] = useState('');
  const [isAnimtaionVisible, setIsAnimtaionVisible] = useState(false);
  const [tabsCurrentIndex, setTabsCurrentIndex] = useState(0);
  const [playlistInput, setPlaylistInput] = useState('');
  const [playlistTitleInput, setPlaylistTitleInput] = useState('');
  const [isLongPressOptions, setIsLongPressOptions] = useState({
    visibility: false,
    selectedItem: '',
  });
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [height, setHeight] = useState(0);
  const [isIAPLoading, setIsIAPLoading] = useState(false);
  const [isIapModal, setIsIapModal] = useState(false);
  //#endregion local state
  useEffect(() => {
    onDataSync('filter');
  }, [filterType]);

  useEffect(() => {
    isNaN(authReducers.selectedPlaylist.sorting)
      ? setPlaylistFilterType(1)
      : setPlaylistFilterType(Number(authReducers.selectedPlaylist.sorting));
  }, [authReducers.selectedPlaylist]);

  useEffect(() => {
    setPlaylistTitleInput(authReducers.selectedPlaylistItem.name);
  }, [authReducers.selectedPlaylistItem.name]);

  useEffect(() => {
    setTabsCurrentIndex(global.tabsCurrentIndex);
  }, [Props.tabIndex]);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(false);
      onDataSync();
    }, [filterType]),
  );

  const onDataSync = type => {
    if (type !== undefined) {
      getData('filterType', data => {
        data !== null && setFilterType(data);
      });
    } else dispatch(action.onStoreUserDetails());
  };
  const onTracklistItem = (data, index, type) => {
    setItemTappedIndex(index);
    setIsLoading(!isLoading);
    type === undefined
      ? dispatch(
          action.onTapSongItem(
            authReducers,
            data,
            index,
            authReducers.trackOptionsMenu,
            props,
            () => {
              setItemTappedIndex('');
              setIsLoading(false);
              setTimeout(() => {
                Props.onTracklistItemTapped();
              }, 200);
            },
          ),
        )
      : dispatch(
          action.onTapPlaylistItem(authReducers, data, () => {
            setItemTappedIndex('');
            setIsLoading(false);
            setIsAnimtaionVisible(!isAnimtaionVisible);
            Util.slideAnimation(
              Props.moveHomeAnimation,
              -DEVICE.DEVICE_WIDTH,
              'newTabs',
            );
            Util.slideAnimation(Props.movePopularAnimation, 0, 'newTabs');
            setTappedIndex(3);
            Keyboard.dismiss();
          }),
        );
  };
  useEffect(() => {
    if (
      settingsReducers.isBeginClicked &&
      settingsReducers.upgradeModalFrom === 'home'
    ) {
      dispatch(setingActions.onUpgradeModal(false, ''));
      dispatch(setingActions.onBeginClicked(false));
      Props.onTabChange();
    }
  }, [settingsReducers.isBeginClicked]);

  const onUnlockLevels = () => {
    dispatch(setingActions.onUpgradeModal(true, 'home'));
  };

  return (
    <View style={globalStyles.flex}>
      {!Props.isTrackVisible && (
        <OnBackPressed
          onBackPressed={() => {
            if (isFocusOnSearch) {
              Keyboard.dismiss();
              setIsFocusOnSearch(false);
              setSearchSongTxt('');
              setSearchSongs([]);
            } else if (isAnimtaionVisible) {
              Util.slideAnimation(Props.moveHomeAnimation, 0, 'newTabs');
              Util.slideAnimation(
                Props.movePopularAnimation,
                DEVICE.DEVICE_WIDTH,
                'newTabs',
              );
              setTimeout(() => {
                dispatch(action.onStoreUserDetails());
                setIsAnimtaionVisible(!isAnimtaionVisible);
              }, 300);
              tappedIndex === 3 && dispatch(action.onClearPlaylist());
            } else {
              BackHandler.exitApp();
            }
          }}
        />
      )}

      <View
        style={[
          {
            // transform: [{translateX: Props.moveHomeAnimation}],
            alignItems: 'center',
          },
          searchSongs.length !== 0 &&
            keyboardHeight !== 0 && {
              height:
                DEVICE_OS === 'ios'
                  ? DEVICE.DEVICE_HEIGHT - keyboardHeight
                  : DEVICE.DEVICE_HEIGHT - keyboardHeight - wp('8%'),
            },
        ]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}>
          <View style={{alignItems: 'center'}}>
            <Toolbar
              isNavDisable={!isFocusOnSearch}
              isExplore={true}
              onPress={() => {
                Keyboard.dismiss();
                setIsFocusOnSearch(!isFocusOnSearch);
                setSearchSongTxt('');
                setSearchSongs([]);
              }}
            />
            <Spacer space={wp('0.5%')} />
            <TextInputCustom
              placeTxt={'Song or artist'}
              isSearchBox={true}
              onChangeText={input => {
                setSearchSongTxt(input);
                let searchArray = [
                  ...authReducers.favSongs.favorite,
                  ...authReducers.favSongs.recent,
                  ...authReducers.favSongs.popular,
                ];
                const uniqueSearchArray = [];
                searchArray.forEach(obj => {
                  if (!uniqueSearchArray.some(o => o.title === obj.title)) {
                    obj.title !== 'null@123' &&
                      uniqueSearchArray.push({...obj});
                  }
                });
                if (input) {
                  try {
                    const regex = new RegExp(`${input.trim()}`, 'i');
                    setSearchSongs(
                      uniqueSearchArray.filter(
                        data =>
                          data.artist.search(regex) >= 0 ||
                          data.title.search(regex) >= 0,
                      ),
                    );
                  } catch (error) {
                    console.log({error});
                  }
                } else {
                  setSearchSongs([]);
                }
                isRequested && setIsRequested(false);
              }}
              placeholderTextColor={colors.grayDark}
              value={searchSongTxt}
              onViewClicked={() => {
                if (!authReducers.userDetails.pro_status) {
                  setIsFocusOnSearch(false);
                  Util.onHapticFeedback();
                  onUnlockLevels();
                }
              }}
              editable={authReducers.userDetails.pro_status}
              onFocus={() =>
                !isFocusOnSearch && setIsFocusOnSearch(!isFocusOnSearch)
              }
            />
            <Spacer space={wp('1%')} />
            {!isFocusOnSearch ? (
              <>
                <View style={{flexDirection: 'row', width: wp('90%')}}>
                  {['Most popular', 'New tabs'].map((data, index) => {
                    return (
                      <>
                        <TouchableOpacity
                          style={[
                            globalStyles.searchBox,
                            {
                              flex: 1,
                              paddingTop: hp('1.3%'),
                              paddingBottom: hp('1.3%'),
                              flexDirection: 'row',
                              backgroundColor: colors.creamBase3,
                            },
                          ]}
                          onPress={() => {
                            if (!authReducers.userDetails.pro_status) {
                              Util.onHapticFeedback();
                              onUnlockLevels();
                            } else {
                              setIsAnimtaionVisible(!isAnimtaionVisible);
                              Util.slideAnimation(
                                Props.moveHomeAnimation,
                                -DEVICE.DEVICE_WIDTH,
                                'newTabs',
                              );
                              Util.slideAnimation(
                                Props.movePopularAnimation,
                                0,
                                'newTabs',
                              );
                              setTappedIndex(index);
                              Keyboard.dismiss();
                              index === 1 &&
                                dispatch(
                                  action.onAddedRecently(
                                    authReducers.userDetails,
                                  ),
                                );
                            }
                          }}>
                          <Image
                            style={[
                              globalStyles.img,
                              {
                                height: index === 0 ? wp('4.5%') : wp('3.7%'),
                                width: index === 0 ? wp('4.5%') : wp('3.7%'),
                                position: 'absolute',
                                left: wp('3.9%'),
                                tintColor: colors.greenTxt,
                              },
                            ]}
                            source={
                              index === 0 ? images.popular : images.download
                            }
                          />
                          <Text
                            style={[
                              globalStyles.textHome,
                              {fontSize: wp('4%'), color: colors.greenTxt},
                            ]}>
                            {data}
                          </Text>
                          {index === 1 &&
                            authReducers.favSongs.recent_count !== 0 && (
                              <View style={styles.textBadge}>
                                <Text
                                  style={[
                                    globalStyles.text,
                                    {color: '#333333', fontSize: wp('3.7%')},
                                  ]}>
                                  {authReducers.favSongs.recent_count}
                                </Text>
                              </View>
                            )}
                        </TouchableOpacity>
                        {index === 0 && <Spacer row={wp('1%')} />}
                      </>
                    );
                  })}
                </View>
                <Spacer space={wp('3%')} />
                <Text
                  style={{
                    ...globalStyles.textHome,
                    fontSize: wp('8%'),
                    alignSelf: 'flex-start',
                    marginLeft: wp('8.8%'),
                  }}>
                  LIBRARY
                </Text>

                <Spacer space={wp('0.5%')} />
                <View style={styles.tabsMainContainer}>
                  <View
                    style={[globalStyles.searchBox, styles.tabsMainContainer1]}>
                    <Animated.View
                      style={[
                        styles.tabsItemContainer,
                        styles.tabsItemAnimation,
                        {transform: [{translateX: moveTabsAnimation}]},
                      ]}>
                      <Text
                        style={[globalStyles.textHome, {color: colors.TRANS}]}>
                        "
                      </Text>
                    </Animated.View>
                    {['Songs', 'Playlists'].map((data, index) => {
                      return (
                        <TouchableOpacity
                          style={styles.tabsItemContainer}
                          onPress={() => {
                            setTabsCurrentIndex(index);
                            global.tabsCurrentIndex = index;
                            Util.slideAnimation(
                              moveTabsAnimation,
                              index === 0 ? 0 : wp('32.2%'),
                            );
                            Util.slideAnimation(
                              moveSongsAnimation,
                              index === 0 ? 0 : -DEVICE.DEVICE_WIDTH,
                            );
                            Util.slideAnimation(
                              movePlaylistAnimation,
                              index === 0 ? DEVICE.DEVICE_WIDTH : 0,
                            );
                          }}>
                          <Text
                            style={[
                              globalStyles.textHome,
                              {
                                fontSize: wp('4%'),
                                color:
                                  index === tabsCurrentIndex
                                    ? colors.greenTxt
                                    : colors.grayDark,
                              },
                            ]}>
                            {data}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <TouchableOpacity
                    style={styles.listSubHeader}
                    onPress={() => {
                      setFilterType(
                        tabsCurrentIndex === 0
                          ? filterType === 2
                            ? 0
                            : filterType + 1
                          : filterType === 1
                          ? 0
                          : filterType + 1,
                      );
                      Keyboard.dismiss();
                      saveData(
                        'filterType',
                        tabsCurrentIndex === 0
                          ? filterType === 2
                            ? 0
                            : filterType + 1
                          : filterType === 1
                          ? 0
                          : filterType + 1,
                      );
                    }}>
                    <Text
                      style={[
                        globalStyles.textHome,
                        {fontFamily: fonts.FM, fontSize: wp('4%')},
                      ]}>
                      {tabsCurrentIndex === 0
                        ? filterType === 1
                          ? 'title '
                          : filterType === 2
                          ? 'artist '
                          : 'recent '
                        : filterType === 1
                        ? 'name '
                        : 'recent '}
                    </Text>
                    <Image
                      style={[
                        globalStyles.img,
                        {
                          height: wp('3%'),
                          width: wp('3%'),
                          tintColor: colors.white2,
                        },
                      ]}
                      source={images.downArrow}
                    />
                  </TouchableOpacity>
                </View>

                <Spacer space={wp('1%')} />

                <View>
                  <Animated.View
                    style={[
                      {transform: [{translateX: moveSongsAnimation}]},
                      tabsCurrentIndex === 1 && {position: 'absolute'},
                    ]}>
                    {authReducers.favSongs.favorite !== undefined &&
                      (authReducers.favSongs.favorite.length > 1 ? (
                        authReducers.favSongs.favorite
                          .sort((a, b) => {
                            if (a.title !== 'null@123') {
                              try {
                                return filterType === 1
                                  ? a.title > b.title
                                    ? 1
                                    : -1
                                  : filterType === 2
                                  ? a.artist.toLowerCase() +
                                      a.title.toLowerCase() >
                                    b.artist.toLowerCase() +
                                      b.title.toLowerCase()
                                    ? 1
                                    : -1
                                  : a.favorite_at < b.favorite_at
                                  ? 1
                                  : -1;
                              } catch (error) {
                                console.log({error});
                              }
                            }
                          })
                          .map((data, index) => {
                            return (
                              <TouchableOpacity
                                style={[
                                  globalStyles.searchBox,
                                  globalStyles.listItemContainer,
                                  data.title === 'null@123' && {
                                    height:
                                      DEVICE_OS === 'ios'
                                        ? wp('20%')
                                        : wp('23%'),
                                    backgroundColor: colors.TRANS,
                                  },
                                ]}
                                key={data.id}
                                disabled={
                                  data.title === 'null@123' ? true : isLoading
                                }
                                onPress={() => onTracklistItem(data, index)}>
                                {data.title !== 'null@123' && (
                                  <>
                                    <View>
                                      <Text
                                        style={[
                                          globalStyles.textHome,
                                          {fontFamily: fonts.QE},
                                        ]}>
                                        {data.title}
                                      </Text>
                                      <Text
                                        style={[
                                          globalStyles.textHome,
                                          {
                                            fontFamily: fonts.FM,
                                            color: '#666666',
                                            fontSize: wp('3.7%'),
                                          },
                                        ]}>
                                        {data.artist}
                                      </Text>
                                    </View>
                                    {index !== itemTappedIndex ? (
                                      <Image
                                        style={[
                                          globalStyles.img,
                                          {height: wp('6%'), width: wp('6%')},
                                        ]}
                                        source={images.rightRound}
                                      />
                                    ) : (
                                      <ActivityIndicator
                                        size="small"
                                        color={colors.white}
                                      />
                                    )}
                                  </>
                                )}
                              </TouchableOpacity>
                            );
                          })
                      ) : (
                        <>
                          <Spacer space={wp(8)} />
                          <AutoHeightImage
                            width={wp(75)}
                            source={images.songPlaceholder}
                          />
                        </>
                      ))}
                  </Animated.View>

                  <Animated.View
                    style={[
                      {transform: [{translateX: movePlaylistAnimation}]},
                      tabsCurrentIndex === 0 && {position: 'absolute'},
                    ]}>
                    <TextInputCustom
                      placeTxt={'New playlist'}
                      isSearchBox={true}
                      isAddPlaylist={true}
                      onChangeText={input => setPlaylistInput(input)}
                      placeholderTextColor={colors.grayDark}
                      value={playlistInput}
                      isLoading={isAddPlaylistLoading}
                      onAddClicked={() => {
                        setIsAddPlaylistLoadingg(true);
                        dispatch(
                          action.onCreateNewPlaylist(
                            authReducers.userDetails,
                            playlistInput,
                            () => {
                              setPlaylistInput('');
                              setIsAddPlaylistLoadingg(false);
                            },
                          ),
                        );
                      }}
                    />
                    <Spacer space={wp('1%')} />
                    {authReducers.playlists.data !== undefined ? (
                      authReducers.playlists.data
                        .sort((a, b) => {
                          if (a.name !== 'null@123') {
                            try {
                              return filterType === 1
                                ? a.name.toLowerCase() > b.name.toLowerCase()
                                  ? 1
                                  : -1
                                : a.created_at < b.created_at
                                ? 1
                                : -1;
                            } catch (error) {
                              console.log({error});
                            }
                          }
                        })
                        .map((data, index) => {
                          return (
                            <TouchableOpacity
                              style={[
                                globalStyles.searchBox,
                                globalStyles.listItemContainer,
                                data.name === 'null@123' && {
                                  height:
                                    DEVICE_OS === 'ios' ? wp('20%') : wp('23%'),
                                  backgroundColor: colors.TRANS,
                                },
                              ]}
                              key={data.id}
                              disabled={
                                data.name === 'null@123' ? true : isLoading
                              }
                              onPress={() =>
                                onTracklistItem(data, index, 'playlist')
                              }
                              onLongPress={() =>
                                setIsLongPressOptions({
                                  visibility: !isLongPressOptions.visibility,
                                  selectedItem: data,
                                })
                              }>
                              {data.name !== 'null@123' && (
                                <>
                                  <View>
                                    <Text
                                      style={[
                                        globalStyles.textHome,
                                        {fontFamily: fonts.QE},
                                      ]}>
                                      {data.name}
                                    </Text>
                                    <Text
                                      style={[
                                        globalStyles.textHome,
                                        {
                                          fontFamily: fonts.FM,
                                          color: '#666666',
                                          fontSize: wp('3.7%'),
                                        },
                                      ]}>
                                      {data.total_song} songs
                                    </Text>
                                  </View>
                                  {index !== itemTappedIndex ? (
                                    <Image
                                      style={[
                                        globalStyles.img,
                                        {height: wp('6%'), width: wp('6%')},
                                      ]}
                                      source={images.rightRound}
                                    />
                                  ) : (
                                    <ActivityIndicator
                                      size="small"
                                      color={colors.white}
                                    />
                                  )}
                                </>
                              )}
                            </TouchableOpacity>
                          );
                        })
                    ) : (
                      <View style={{alignSelf: 'center'}}>
                        <Spacer space={wp(8)} />
                        <AutoHeightImage
                          width={wp(75)}
                          source={images.songPlaceholder}
                        />
                      </View>
                    )}
                  </Animated.View>
                </View>
              </>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'handled'}
                style={
                  keyboardHeight === 0 && {
                    paddingBottom: DEVICE_OS === 'ios' ? wp('21%') : wp('25%'),
                  }
                }>
                {searchSongs.length === 0 && searchSongTxt !== '' ? (
                  <>
                    <Text
                      style={{
                        ...globalStyles.textHome,
                        paddingLeft: wp(4),
                        color: colors.creamBase3,
                      }}>
                      This tab isn’t done yet.
                    </Text>
                    <Spacer space={wp(2)} />
                    <AutoHeightImage width={wp(90)} source={images.songRequest}>
                      <TouchableOpacity
                        style={{
                          ...styles.exploreSongs,
                          padding: wp(2.8),
                          borderRadius: wp(2.5),
                          marginLeft: 0,
                          alignSelf: 'center',
                          width: wp(52),
                          position: 'absolute',
                          bottom: wp(7),
                        }}
                        disabled={isRequested}
                        onPress={() => {
                          fcmService.checkPermission(token => {
                            setIsRequestLoading(true);
                            dispatch(
                              action.onRequestSong(
                                authReducers.userDetails,
                                searchSongTxt,
                                token,
                                () => {
                                  setIsRequestLoading(false);
                                  setIsRequested(true);
                                },
                              ),
                            );
                          });
                        }}>
                        <Text
                          style={{
                            ...globalStyles.textHome,
                            color:
                              !isRequestLoading && !isRequested
                                ? colors.white
                                : colors.TRANS,
                            textAlign: 'center',
                          }}>
                          Request this song
                        </Text>
                        {isRequestLoading && (
                          <ActivityIndicator
                            size="small"
                            color={colors.white}
                            style={{position: 'absolute'}}
                          />
                        )}
                        {isRequested && (
                          <Image
                            source={images.ic_done}
                            style={{
                              ...globalStyles.img,
                              height: wp('5%'),
                              width: wp('5%'),
                              position: 'absolute',
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    </AutoHeightImage>
                  </>
                ) : (
                  searchSongs
                    .sort((a, b) =>
                      a.artist.toLowerCase() + a.title.toLowerCase() >
                      b.artist.toLowerCase() + b.title.toLowerCase()
                        ? 1
                        : -1,
                    )
                    .map((data, index) => {
                      return (
                        <TouchableOpacity
                          style={[
                            globalStyles.searchBox,
                            globalStyles.listItemContainer,
                          ]}
                          key={data.id}
                          disabled={isLoading}
                          onPress={() => onTracklistItem(data, index)}>
                          <View>
                            <Text
                              style={[
                                globalStyles.textHome,
                                {fontFamily: fonts.QE},
                              ]}>
                              {data.title}
                            </Text>
                            <Text
                              style={[
                                globalStyles.textHome,
                                {
                                  fontFamily: fonts.FM,
                                  color: '#666666',
                                  fontSize: wp('3.7%'),
                                },
                              ]}>
                              {data.artist}
                            </Text>
                          </View>
                          {index !== itemTappedIndex ? (
                            <Image
                              style={[
                                globalStyles.img,
                                {height: wp('6%'), width: wp('6%')},
                              ]}
                              source={images.rightRound}
                            />
                          ) : (
                            <ActivityIndicator
                              size="small"
                              color={colors.white}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })
                )}
              </ScrollView>
            )}
          </View>
        </ScrollView>
      </View>

      {isAnimtaionVisible && (
        <View
          style={[
            {
              // transform: [{translateX: Props.movePopularAnimation}],
              alignItems: 'center',
              position: 'absolute',
              width: DEVICE.DEVICE_WIDTH,
              height: DEVICE.DEVICE_HEIGHT,
              bottom: 0,
            },
          ]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'always'}>
            <View style={{alignItems: 'center'}}>
              {tappedIndex !== 3 ? (
                <View style={globalStyles.paddingTop}>
                  <View
                    style={[
                      styles.listHeader,
                      {justifyContent: null, marginTop: wp(2), width: null},
                    ]}>
                    <Text
                      style={[
                        globalStyles.textHome,
                        {
                          fontSize: wp('5%'),
                          color: colors.creamBase3,
                          paddingLeft: wp('2%'),
                        },
                      ]}>
                      {tappedIndex === 0 ? 'Most popular ' : 'New tabs '}
                    </Text>
                    <Image
                      style={[
                        globalStyles.img,
                        {
                          height: tappedIndex === 0 ? wp('5%') : wp('3.5%'),
                          width: tappedIndex === 0 ? wp('5%') : wp('3.5%'),
                          top: wp('0.2%'),
                          tintColor: colors.creamBase3,
                        },
                      ]}
                      source={
                        tappedIndex === 0 ? images.popular : images.download
                      }
                    />
                  </View>
                </View>
              ) : (
                <Toolbar
                  isNavDisable={true}
                  titleImg={tappedIndex === 3 && images.playlistTxt}
                />
              )}
              <Spacer space={wp('1.5%')} />
              {tappedIndex === 3 ? (
                <View style={[styles.listHeader, {width: wp('90%')}]}>
                  <TextInputCustom
                    refs={refPlaylistTitle}
                    isSearchBox={true}
                    isAddPlaylist={true}
                    isWithoutBox={true}
                    onChangeText={input => setPlaylistTitleInput(input)}
                    value={playlistTitleInput}
                    returnKeyType={'done'}
                    onAddClicked={() => refPlaylistTitle.current.focus()}
                    onSubmitEditing={() =>
                      dispatch(
                        action.onChangeSorting(
                          authReducers,
                          playlistTitleInput,
                          playlistFilterType,
                          'title',
                        ),
                      )
                    }
                  />
                  <TouchableOpacity
                    style={styles.listSubHeader}
                    onPress={() => {
                      setPlaylistFilterType(
                        playlistFilterType === 2 ? 0 : playlistFilterType + 1,
                      );
                      Keyboard.dismiss();
                      dispatch(
                        action.onChangeSorting(
                          authReducers,
                          playlistTitleInput,
                          playlistFilterType === 2 ? 0 : playlistFilterType + 1,
                        ),
                      );
                    }}>
                    <Text
                      style={[
                        globalStyles.textHome,
                        {fontFamily: fonts.FM, fontSize: wp('4%')},
                      ]}>
                      {playlistFilterType === 1
                        ? 'title '
                        : playlistFilterType === 2
                        ? 'artist '
                        : 'recent '}
                    </Text>
                    <Image
                      style={[
                        globalStyles.img,
                        {
                          height: wp('3%'),
                          width: wp('3%'),
                          tintColor: colors.white2,
                        },
                      ]}
                      source={images.downArrow}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={[styles.listHeader, {justifyContent: null}]}></View>
              )}
              <Spacer space={wp('1.5%')} />

              {tappedIndex !== 3
                ? authReducers.favSongs.recent !== undefined &&
                  (tappedIndex === 0
                    ? authReducers.favSongs.popular
                    : authReducers.favSongs.recent
                  ).map((data, index) => {
                    return (
                      <TouchableOpacity
                        style={[
                          globalStyles.searchBox,
                          globalStyles.listItemContainer,
                          data.title === 'null@123' && {
                            height: DEVICE_OS === 'ios' ? wp('20%') : wp('23%'),
                            backgroundColor: colors.TRANS,
                          },
                        ]}
                        key={data.id}
                        disabled={data.title === 'null@123' ? true : isLoading}
                        onPress={() => onTracklistItem(data, index)}>
                        {data.title !== 'null@123' && (
                          <>
                            <View>
                              <Text
                                style={[
                                  globalStyles.textHome,
                                  {fontFamily: fonts.QE},
                                ]}>
                                {data.title}
                              </Text>
                              <Text
                                style={[
                                  globalStyles.textHome,
                                  {
                                    fontFamily: fonts.FM,
                                    color: '#666666',
                                    fontSize: wp('3.7%'),
                                  },
                                ]}>
                                {data.artist}
                              </Text>
                            </View>
                            {index !== itemTappedIndex ? (
                              <Image
                                style={[
                                  globalStyles.img,
                                  {height: wp('6%'), width: wp('6%')},
                                ]}
                                source={images.rightRound}
                              />
                            ) : (
                              <ActivityIndicator
                                size="small"
                                color={colors.white}
                              />
                            )}
                          </>
                        )}
                      </TouchableOpacity>
                    );
                  })
                : authReducers.selectedPlaylist.track !== undefined &&
                  authReducers.selectedPlaylist.track
                    .sort((a, b) => {
                      if (a.title !== 'null@123') {
                        try {
                          return playlistFilterType === 1
                            ? a.title > b.title
                              ? 1
                              : -1
                            : playlistFilterType === 2
                            ? a.artist.toLowerCase() + a.title.toLowerCase() >
                              b.artist.toLowerCase() + b.title.toLowerCase()
                              ? 1
                              : -1
                            : a.added_at < b.added_at
                            ? 1
                            : -1;
                        } catch (error) {
                          console.log({error});
                        }
                      }
                    })
                    .map((data, index) => {
                      return (
                        <TouchableOpacity
                          style={[
                            globalStyles.searchBox,
                            globalStyles.listItemContainer,
                            data.title === 'null@123' && {
                              height:
                                DEVICE_OS === 'ios' ? wp('20%') : wp('23%'),
                              backgroundColor: colors.TRANS,
                            },
                          ]}
                          key={data.id}
                          disabled={
                            data.title === 'null@123' ? true : isLoading
                          }
                          onPress={() => onTracklistItem(data, index)}
                          onLongPress={() =>
                            setIsLongPressOptions({
                              visibility: !isLongPressOptions.visibility,
                              selectedItem: data,
                            })
                          }>
                          {data.title !== 'null@123' && (
                            <>
                              <View>
                                <Text
                                  style={[
                                    globalStyles.textHome,
                                    {fontFamily: fonts.QE},
                                  ]}>
                                  {data.title}
                                </Text>
                                <Text
                                  style={[
                                    globalStyles.textHome,
                                    {
                                      fontFamily: fonts.FM,
                                      color: '#666666',
                                      fontSize: wp('3.7%'),
                                    },
                                  ]}>
                                  {data.artist}
                                </Text>
                              </View>
                              {index !== itemTappedIndex ? (
                                <Image
                                  style={[
                                    globalStyles.img,
                                    {height: wp('6%'), width: wp('6%')},
                                  ]}
                                  source={images.rightRound}
                                />
                              ) : (
                                <ActivityIndicator
                                  size="small"
                                  color={colors.white}
                                />
                              )}
                            </>
                          )}
                        </TouchableOpacity>
                      );
                    })}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={[
              globalStyles.paddingTop,
              {position: 'absolute', left: wp('5.5%'), top: hp('0.6%')},
            ]}
            onPress={() => {
              Util.slideAnimation(Props.moveHomeAnimation, 0, 'newTabs');
              Util.slideAnimation(
                Props.movePopularAnimation,
                DEVICE.DEVICE_WIDTH,
                'newTabs',
              );
              setTimeout(() => {
                dispatch(action.onStoreUserDetails());
                setIsAnimtaionVisible(!isAnimtaionVisible);
              }, 300);
              tappedIndex === 3 && dispatch(action.onClearPlaylist());
            }}>
            <Image
              style={[
                globalStyles.img,
                {height: wp('8.5%'), width: wp('8.5%')},
              ]}
              source={images.backRound}
            />
          </TouchableOpacity>
        </View>
      )}

      <AppModal
        isModalVisible={isLongPressOptions}
        onRequestClose={type => {
          type === 'delete'
            ? dispatch(
                action.onDeletePlaylist(
                  isLongPressOptions.selectedItem,
                  authReducers.userDetails,
                  () => {
                    setIsLongPressOptions({
                      visibility: !isLongPressOptions.visibility,
                      selectedItem: '',
                    });
                  },
                  authReducers.selectedPlaylistItem,
                ),
              )
            : setIsLongPressOptions({
                visibility: !isLongPressOptions.visibility,
                selectedItem: '',
              });
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  textBadge: {
    position: 'absolute',
    right: -wp('0.6%'),
    top: -wp('1.8%'),
    backgroundColor: colors.white,
    borderRadius: 6,
    paddingLeft: wp('1.5%'),
    paddingRight: wp('1.5%'),
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('86%'),
  },
  listSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('2%'),
  },
  logo: {
    height: wp('10%'),
    width: wp('31%'),
    alignSelf: 'flex-start',
    marginLeft: wp('9%'),
  },
  tabsMainContainer: {
    width: wp('90%'),
    alignItems: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabsMainContainer1: {
    width: wp('65%'),
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
    width: wp('32.2%'),
  },
  exploreSongs: {
    backgroundColor: colors.creamBase3,
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
  bottomPopup: {
    position: 'absolute',
    backgroundColor: colors.creamBase1,
    alignItems: 'center',
    width: DEVICE.DEVICE_WIDTH,
    paddingVertical: wp(6),
    backgroundColor: colors.creamBase1,
    shadowColor: colors.Black,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    // elevation: 20
  },
  bottomPopupText: {
    fontFamily: fonts.QE,
    fontSize: wp(4.5),
    color: colors.creamBase4,
  },
  bottomPopupBtn: {
    backgroundColor: colors.creamBase3,
    width: wp(80),
    alignItems: 'center',
    justifyContent: 'center',
    height: wp(12),
    borderRadius: wp(2.5),
    // marginTop: DEVICE_OS === 'android' ? wp(7) : 0
  },
  androidReverseShadow: {
    width: DEVICE.DEVICE_WIDTH,
    padding: wp(1),
    backgroundColor: colors.creamBase1,
    elevation: 5,
    position: 'absolute',
    top: 0,
  },
});
