import { createSlice } from '@reduxjs/toolkit';

const mysteryReducer = createSlice({
  name: 'mysteryReducer',
  initialState: [],
  reducers: {
    setMysteryList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export default mysteryReducer;
