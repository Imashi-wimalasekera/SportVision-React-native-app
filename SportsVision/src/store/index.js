import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import favouritesReducer from './favouritesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    favourites: favouritesReducer,
  },
});

export default store;
