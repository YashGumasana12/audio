
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from "../redux/actions/courseActions";
import * as authActions from "../redux/actions/authActions";

global.dispatch;
global.courseReducers;
global.authReducers;
export const SvgImagesAction = (value) => {
    if (global.setIsTapTheNote) {
        try {
            global.dispatch(actions.onSVGNumberClicked(value, global.courseReducers));
        } catch (error) {
            console.log({ error });
        }
    }
}
export const onGetChat = () => {
    global.dispatch(authActions.getChat(global.authReducers.userDetails));
}