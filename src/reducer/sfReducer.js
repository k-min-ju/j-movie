import { createSlice } from '@reduxjs/toolkit';

const sfReducer = createSlice({
  name: 'sfReducer',
  initialState: [],
  reducers: {
    setSfList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export default sfReducer;
