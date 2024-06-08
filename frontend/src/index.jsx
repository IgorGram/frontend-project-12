import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { io } from 'socket.io-client';
import App from './App.jsx';
import reducer, { actions } from './slices/index.js';
import { channelsApi } from './services/channelsApi.js';
import { messagesApi } from './services/messagesApi.js';

const socket = io();
const root = ReactDOM.createRoot(document.getElementById('root'));

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat([channelsApi.middleware, messagesApi.middleware]),
});

socket.on('newMessage', (payload) => {
  store.dispatch(messagesApi.util.updateQueryData('getMessages', undefined, (draftMessages) => {
    draftMessages.push(payload);
  }));
});

socket.on('newChannel', (payload) => {
  store.dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draftChannels) => {
    draftChannels.push(payload);
  }));
});

socket.on('removeChannel', (payload) => {
  store.dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draftChannels) => {
    const newChannels = draftChannels.filter((channel) => channel.id !== payload.id);
    const state = store.getState();
    if (state.ui.currentChannelId === payload.id) {
      store.dispatch(actions.setCurrentChannel({ channelId: state.ui.defaultChannelId }));
    }
    return newChannels;
  }));
});

socket.on('renameChannel', (payload) => {
  store.dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draftChannels) => {
    const channel = draftChannels.find((item) => item.id === payload.id);
    channel.name = payload.name;
  }));
});

root.render(
  <Provider store={store}>
    <App />
  </Provider>,

);
