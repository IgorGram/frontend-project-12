// eslint-disable-next-line import/no-extraneous-dependencies
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'auth',
  initialState: JSON.parse(localStorage.getItem('user')) || {},
  reducers: {
    login(state, { payload }) {
      localStorage.setItem('user', JSON.stringify(payload));
      // eslint-disable-next-line no-param-reassign
      state.username = payload.username;
      // eslint-disable-next-line no-param-reassign
      state.token = payload.token;
    },
    logout(state) {
      localStorage.removeItem('user');
      // eslint-disable-next-line no-param-reassign
      state.username = null;
      // eslint-disable-next-line no-param-reassign
      state.token = null;
    },
  },
});

export const { actions } = slice;
export default slice.reducer;
