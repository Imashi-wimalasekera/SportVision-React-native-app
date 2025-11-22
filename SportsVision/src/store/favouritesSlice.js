import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  items: [],
};

const slice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    setFavourites(state, action) {
      state.items = action.payload;
    },
    toggleFavourite(state, action) {
      const item = action.payload;
      const idx = state.items.findIndex((i) => i.idTeam === item.idTeam);
      if (idx >= 0) state.items.splice(idx, 1);
      else state.items.push(item);
    },
  },
});

export const { setFavourites, toggleFavourite } = slice.actions;

export const loadFavouritesFromStorage = () => async (dispatch) => {
  try {
    const raw = await AsyncStorage.getItem('@sv_favourites');
    if (raw) dispatch(setFavourites(JSON.parse(raw)));
  } catch (e) {
    // ignore
  }
};

export const persistFavourites = (items) => async () => {
  try {
    await AsyncStorage.setItem('@sv_favourites', JSON.stringify(items));
  } catch (e) {
    // ignore
  }
};

export default slice.reducer;
