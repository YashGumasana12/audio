import {
    IS_IAP_MODAL,
    ON_GET_CHAT,
    IS_UPGRADE_MODAL,
    ON_BEGIN_CLICKED
} from "../actionTypes/settingsActionTypes"

const initialData = {
    isIapModal: false,
    chats: [],
    isUpgradeModal: false,
    upgradeModalFrom: '',
    isBeginClicked: false
};

const settingsReducers = (state = initialData, action) => {
    switch (action.type) {
        case IS_IAP_MODAL:
            return {
                ...state,
                isIapModal: action.flag
            }
        case ON_GET_CHAT:
            return {
                ...state,
                chats: action.payload
            }
        case IS_UPGRADE_MODAL:
            if (action.fromJS === undefined) {
                return {
                    ...state,
                    isUpgradeModal: action.flag
                }
            } else return {
                ...state,
                isUpgradeModal: action.flag,
                upgradeModalFrom: action.fromJS
            }
        case ON_BEGIN_CLICKED:
            return {
                ...state,
                isBeginClicked: action.flag
            }
        default:
            return state;
    }
};
export default settingsReducers;