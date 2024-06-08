// @ts-check
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider as RollBarProvider, ErrorBoundary } from '@rollbar/react';
import i18next from 'i18next';
import leoProfanity from 'leo-profanity';
import App from './App.jsx';
import reducer, { actions } from './slices/index.js';
import { channelsApi } from './services/channelsApi.js';
import { messagesApi } from './services/messagesApi.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import resources from './locales/index.js';

const init = async (socket) => {
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ru',
    });

  const isProduction = process.env.NODE_ENV === 'production';

  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_TOKEN,
    environment: isProduction,
  };

  leoProfanity.add(leoProfanity.getDictionary('ru'));

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

  return (
    <Provider store={store}>
      <RollBarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <I18nextProvider i18n={i18n}>
            <App />
          </I18nextProvider>
        </ErrorBoundary>
      </RollBarProvider>
    </Provider>
  );
};

export default init;
