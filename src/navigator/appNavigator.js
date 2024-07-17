//#region import
//#region RN
import React, {Component, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
//#endregion
//#region third party libs
import {Provider} from 'react-redux';
import configureStore from '../redux/store';
import SplashScreen from 'react-native-splash-screen';
//#endregion
//#region common files
import {DEVICE_OS} from '../utils/constants';
import {AppLodar} from '../components/AppLodar';
import {getData} from '../utils/asyncStorageHelper';
import login from '../screens/auth/login';
import tabBar from '../screens/dashboard/tabBar';
import home from '../screens/dashboard/home';
import track from '../screens/dashboard/track';
import settings from '../screens/settings/settings';
import profile from '../screens/settings/profile';
import conatctUs from '../screens/settings/conatctUs';
import privacyPolicy from '../screens/settings/privacyPolicy';
import VideoDemo from '../screens/course/videoDemo';
import lessons from '../screens/course/lessons';
import course from '../screens/course/course';
import BottomTabStack from './BottomTabStack';
import levelThird from '../screens/levels/levelThird';
import levelFour from '../screens/levels/levelFour';
import levelOne from '../screens/levels/levelOne';
import levelTwo from '../screens/levels/levelTwo';
import quickTheory from '../screens/home/quickTheory';
import levelTwoB from '../screens/levels/levelTwoB';
//#endregion
//#region const
const Stack = createStackNavigator();
const store = configureStore();
//#endregion
//#endregion

const options = {
  headerShown: false,
  gestureEnabled: DEVICE_OS === 'ios' ? true : false,
};
const options2 = {
  headerShown: false,
  gestureEnabled: false,
  animationEnabled: false,
};

export default function AppNavigator() {
  //#region local state
  const [initialPageName, setInitialPageName] = useState('');
  //#endregion local state
  useEffect(() => {
    // SplashScreen.hide();
    getData(
      'objLogin',
      success => {
        setInitialPageName(success === null ? 'login' : 'tabBar');
        success === null && SplashScreen.hide();
      },
      failure => {
        setInitialPageName('login');
      },
    );
  }, []);

  return initialPageName === '' ? null : (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialPageName}
        screenOptions={({navigation}) => {
          return {
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            detachPreviousScreen: !navigation.isFocused(), //For disable white flikering issue while transition.
          };
        }}>
        <Stack.Screen name="login" component={login} options={options2} />
        <Stack.Screen
          name="tabBar"
          component={BottomTabStack}
          options={options2}
        />
        <Stack.Screen name="home" component={home} options={options2} />
        <Stack.Screen
          name="quickTheory"
          component={quickTheory}
          options={options2}
        />

        <Stack.Screen name="levelOne" component={levelOne} options={options2} />
        <Stack.Screen name="levelTwo" component={levelTwo} options={options2} />
        <Stack.Screen
          name="levelTwoB"
          component={levelTwoB}
          options={options2}
        />
        <Stack.Screen
          name="levelThird"
          component={levelThird}
          options={options2}
        />
        <Stack.Screen
          name="levelFour"
          component={levelFour}
          options={options2}
        />
        <Stack.Screen name="track" component={track} options={options2} />
        <Stack.Screen name="settings" component={settings} options={options} />
        <Stack.Screen name="profile" component={profile} options={options} />
        <Stack.Screen
          name="contactUs"
          component={conatctUs}
          options={options}
        />
        <Stack.Screen
          name="privacyPolicy"
          component={privacyPolicy}
          options={options}
        />
        <Stack.Screen
          name="VideoDemo"
          component={VideoDemo}
          options={options2}
        />
        <Stack.Screen name="course" component={course} options={options} />
        <Stack.Screen name="lessons" component={lessons} options={options} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
