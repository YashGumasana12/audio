//#region import
//#region RN
import React, { useState, useEffect } from "react";
//#endregion
//#region common files
import { Strings } from "../res/string";
import * as authActionTypes from "../redux/actionTypes/authActionTypes";
//#endregion
//#region third party libs
import NetInfo from "@react-native-community/netinfo";
import SplashScreen from 'react-native-splash-screen';
//#endregion
//#region redux
import { useSelector, useDispatch } from 'react-redux';
import { getData } from "../utils/asyncStorageHelper";
//#endregion
//#endregion

export const Network = () => {
  //#region redux
  const dispatch = useDispatch()
  const authReducers = useSelector(state => state.authReducers)
  //#endregion redux
  useEffect(() => {
    NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        SplashScreen.hide();
        dispatch({ type: authActionTypes.NETWORK_STATUS, flag: true });
        storeOfflineData();
      } else {
        dispatch({ type: authActionTypes.NETWORK_STATUS, flag: false });
      }
    });
  }, []);

  const storeOfflineData = () => {
    getData('songs', (success) => {
      dispatch({ type: authActionTypes.GET_TRACK_LIST, payload: success });
    });
    getData('playList', (success) => {
      let nullData = { name: 'null@123' };
      success.data.push(nullData);
      dispatch({ type: authActionTypes.GET_PLAY_LIST, payload: success });
    });
    getData('trackDetails', (success) => {
      dispatch({ type: authActionTypes.OFFLINE_TRACKS, payload: success });
    });
  }
  return null;
};