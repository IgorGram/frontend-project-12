import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { io } from 'socket.io-client';
import App from './App.jsx';
import reducer from './slices/index.js';
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

root.render(
  <Provider store={store}>
    <App />
  </Provider>,

);
