//#region import
//#region RN
import React, {useState, useEffect} from 'react';
import {View, StatusBar} from 'react-native';
//#endregion
//#region common files
import AppNavigator from './src/navigator/appNavigator';
import {Network} from './src/components/Network';
import {AppLodar} from './src/components/AppLodar';
import {fcmService} from './src/apiHelper/FCMService';
//#endregion
//#region third party libs
import {Provider} from 'react-redux';
import configureStore from './src/redux/store';
import {IAPModal} from './src/components/IAPModal';
import {UpgradeModal} from './src/components/UpgradeModal';
const store = configureStore();
//#endregion
//#endregion

const App: () => React$Node = () => {
  useEffect(() => {
    // fcmService.checkPermission();
    fcmService.getToken();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <StatusBar barStyle="light-content" backgroundColor={'#141414'} />
      <Provider store={store}>
        <Network />
        <AppLodar />
        <AppNavigator />
        {/* <IAPModal /> */}
        <UpgradeModal />
      </Provider>
    </View>
  );
};

export default App;
