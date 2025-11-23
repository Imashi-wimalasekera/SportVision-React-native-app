import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import favouritesReducer from './favouritesSlice';
import notificationsReducer from './notificationsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    favourites: favouritesReducer,
    notifications: notificationsReducer,
  },
});

export default store;
