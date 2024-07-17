import { colors } from "../../res/colors";
import { images } from "../../res/images";
import { APP_LOADER } from "../actionTypes/authActionTypes";
import {
    NETWORK_STATUS,
    OFFLINE_TRACKS,
    USER_DETAILS,
    GET_TRACK_LIST,
    GET_PLAY_LIST,
    TAPPED_SONG,
    SELECTED_PLAYLIST,
    ADD_TO_FAV,
    GET_DAILY_GOAL
} from '../actionTypes/authActionTypes'

const initialData = {
    isNetworkDisable: false,
    offlineTracks: '',
    appLoading: false,
    userDetails: '',
    favSongs: [],
    playlists: [],
    tappedSongResponse: '',
    selectedPlaylist: '',
    selectedPlaylistItem: '',
    trackOptionsMenu: [
        { title: 'Save to favorites', icon: images.save, tintColor: colors.white },
        { title: 'Add to a playlist', icon: images.playlist, tintColor: colors.white },
        { title: 'Show the full chords', icon: images.save, isOn: false },
        { title: 'This tab has mistakes', icon: images.pencilWhite, tintColor: colors.white },
    ],
    dailyGoals: {}
};

const authReducers = (state = initialData, action) => {
    switch (action.type) {
        case NETWORK_STATUS:
            return {
                ...state,
                isNetworkDisable: action.flag
            }
        case OFFLINE_TRACKS:
            return {
                ...state,
                offlineTracks: action.payload
            }
        case APP_LOADER:
            return {
                ...state,
                appLoading: action.flag
            }
        case USER_DETAILS: {
            return {
                ...state,
                userDetails: action.userDetails
            }
        }
        case GET_TRACK_LIST: {
            return {
                ...state,
                favSongs: action.payload
            }
        }
        case GET_PLAY_LIST: {
            return {
                ...state,
                playlists: action.payload
            }
        }
        case TAPPED_SONG: {
            return {
                ...state,
                tappedSongResponse: action.tappedSongResponse,
                trackOptionsMenu: action.trackOptionsMenu
            }
        }
        case SELECTED_PLAYLIST: {
            return {
                ...state,
                selectedPlaylist: action.tappedSongResponse,
                selectedPlaylistItem: action.item
            }
        }
        case ADD_TO_FAV: {
            return {
                ...state,
                tappedSongResponse: action.payload
            }
        }
        case GET_DAILY_GOAL: {
            return {
                ...state,
                dailyGoals: action.payload
            }
        }
        default:
            return state;
    }
};
export default authReducers;