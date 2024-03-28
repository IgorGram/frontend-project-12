import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx';
import reducer from './slices/index.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

const store = configureStore({
  reducer,
});

root.render(
  <Provider store={store}>
    <App />
  </Provider>,

);
