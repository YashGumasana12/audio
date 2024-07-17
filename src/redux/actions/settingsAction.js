//#region import
//#region common files
import * as authActions from '../actions/authActions';
import * as settingsActionTypes from '../actionTypes/settingsActionTypes';
import { contact_us, user_delete, chat_store, read_msg } from '../../apiHelper/APIs.json';
import { clearAllData, getData, saveData } from '../../utils/asyncStorageHelper';
import { POST } from '../../apiHelper/apiService';
//#endregion
//#region third party libs
import Toast from "react-native-simple-toast";
//#endregion
//#endregion

export const onFeedbackSend = (userDetails, contactUsText, props, callBack) => {
    return async dispatch => {
        var requestBody = {
            "user_id": userDetails.id,
            "feedback": contactUsText,
        }
        await POST(contact_us, requestBody, function (response) {
            if (response.status == '1') {
                Toast.show(response.responseData.message);
                callBack();
            } else {
                props.navigation.goBack();
                setTimeout(() => {
                    Toast.show(response.responseData.message);
                }, 500);
            }
        })
    }
}
export const onDeleteAccount = (userDetails, navigation) => {
    return async dispatch => {
        var requestBody = {
            "user_id": userDetails.id
        }
        await POST(user_delete, requestBody, function (response) {
            if (response.status == '1') {
                Toast.show(response.responseData.message);
            } else {
                clearAllData(() => {
                    navigation.replace('login');
                })
            }
        })
    }
}
export const onIAPModalVisibility = (flag) => {
    return async dispatch => {
        dispatch({ type: settingsActionTypes.IS_IAP_MODAL, flag });
    }
}
export const onStoreChat = (userDetails, message, callBack) => {
    return async dispatch => {
        var requestBody = {
            "user_id": userDetails.id,
            message
        }
        await POST(chat_store, requestBody, function (response) {
            if (response.status == '1') {
                Toast.show(response.responseData.message);
            } else {
                dispatch(authActions.getChat(userDetails, () => {
                    callBack();
                }));
            }
        })
    }
}
export const onReadMessage = (userId, chats) => {
    return async dispatch => {
        await POST(read_msg, { "user_id": userId }, function (response) {
            if (response.status == '1') {
                Toast.show(response.responseData.message);
            } else {
                chats.unread_msg = false;
                dispatch({ type: settingsActionTypes.ON_GET_CHAT, payload: chats });
            }
        })
    }
}
export const onUpgradeModal = (flag, fromJS) => {
    return dispatch => {
        dispatch({ type: settingsActionTypes.IS_UPGRADE_MODAL, flag, fromJS });
    }
}
export const onBeginClicked = (flag) => {
    return dispatch => {
        dispatch({ type: settingsActionTypes.ON_BEGIN_CLICKED, flag });
    }
}