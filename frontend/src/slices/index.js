import { combineReducers } from '@reduxjs/toolkit';
import auth, { actions as authActions } from './auth.js';
import ui, { actions as uiActions } from './ui.js';
import { channelsApi } from '../services/channelsApi.js';
import { messagesApi } from '../services/messagesApi.js';

const actions = {
  ...authActions,
  ...uiActions,
};

const defaultChannelId = 1;

export {
  actions,
  defaultChannelId,
};

export default combineReducers({
  auth,
  ui,
  [channelsApi.reducerPath]: channelsApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,

});
