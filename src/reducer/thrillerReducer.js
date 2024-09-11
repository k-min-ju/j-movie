import { createSlice } from '@reduxjs/toolkit';

const thrillerReducer = createSlice({
  name: 'thrillerReducer',
  initialState: [],
  reducers: {
    setThrillerList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export let { setThrillerList } = thrillerReducer.actions;

export default thrillerReducer;
