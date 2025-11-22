import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { login, logout } = slice.actions;

export const loadAuthFromStorage = () => async (dispatch) => {
  try {
    const raw = await AsyncStorage.getItem('@sv_user');
    if (raw) dispatch(login(JSON.parse(raw)));
  } catch (e) {
    // ignore
  }
};

export const saveAuthToStorage = (user) => async () => {
  try {
    await AsyncStorage.setItem('@sv_user', JSON.stringify(user));
  } catch (e) {
    // ignore
  }
};

export default slice.reducer;
