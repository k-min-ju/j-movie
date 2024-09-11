import { createSlice } from '@reduxjs/toolkit';

const comedyReducer = createSlice({
  name: 'comedyReducer',
  initialState: [],
  reducers: {
    setComedyList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export let { setComedyList } = comedyReducer.actions;

export default comedyReducer;
