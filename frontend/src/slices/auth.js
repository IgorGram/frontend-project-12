/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'auth',
  initialState: JSON.parse(localStorage.getItem('user')) || {},
  reducers: {
    login(state, { payload }) {
      localStorage.setItem('user', JSON.stringify(payload));
      state.username = payload.username;
      state.token = payload.token;
    },
    logout(state) {
      localStorage.removeItem('user');
      state.username = null;
      state.token = null;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
