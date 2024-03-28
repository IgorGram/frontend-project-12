import { combineReducers } from '@reduxjs/toolkit';
import auth, { actions as authActions } from './auth.js';

const actions = {
  ...authActions,
};

export {
  actions,
};

export default combineReducers({
  auth,
});
