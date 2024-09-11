import { createSlice } from '@reduxjs/toolkit';

const crimeReducer = createSlice({
  name: 'crimeReducer',
  initialState: [],
  reducers: {
    setCrimeList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export let { setCrimeList } = crimeReducer.actions;

export default crimeReducer;
