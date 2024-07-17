//#region import
//#region RN
import {useEffect, useState} from 'react';
import {Keyboard, KeyboardEvent} from 'react-native';
//#endregion
//#endregion

export const UseKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  function onKeyboardDidShow(e) {
    // setKeyboardHeight(e.endCoordinates.height);
  }
  function onKeyboardDidHide() {
    setKeyboardHeight(0);
  }
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(10);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    // Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      // return Keyboard.removeAllListeners('keyboardDidShow', onKeyboardDidShow);
      // Keyboard.removeAllListeners('keyboardDidHide', onKeyboardDidHide);
    };
  }, []);
  return [keyboardHeight];
};
