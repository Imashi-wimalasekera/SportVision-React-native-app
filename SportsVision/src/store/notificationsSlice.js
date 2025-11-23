import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@sv_notifications';

const initialState = {
  items: [],
};

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.items = action.payload;
    },
    addNotification(state, action) {
      state.items.unshift(action.payload);
    },
    markAllRead(state) {
      state.items = state.items.map(n => ({ ...n, unread: false }));
    },
    markRead(state, action) {
      const id = action.payload;
      state.items = state.items.map(n => n.id === id ? { ...n, unread: false } : n);
    },
  },
});

export const { setNotifications, addNotification, markAllRead, markRead } = slice.actions;

export const loadNotificationsFromStorage = () => async (dispatch) => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) dispatch(setNotifications(JSON.parse(raw)));
  } catch (e) {
    // ignore
  }
};

export const persistNotifications = (items) => async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // ignore
  }
};

export default slice.reducer;
