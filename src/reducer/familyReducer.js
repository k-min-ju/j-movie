import { createSlice } from '@reduxjs/toolkit';

const familyReducer = createSlice({
  name: 'familyReducer',
  initialState: [],
  reducers: {
    setFamilyList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export let { setFamilyList } = familyReducer.actions;

export default familyReducer;
