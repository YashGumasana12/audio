//#region import
//#region list of reducers
import authReducers from './reducers/authReducers';
import settingsReducers from './reducers/settingsReducers';
import courseReducers from './reducers/courseReducers';
//#endregion
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
//#endregion

const rootReducer = combineReducers({
    authReducers,
    settingsReducers,
    courseReducers
});
const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(thunk));
}
export default configureStore;