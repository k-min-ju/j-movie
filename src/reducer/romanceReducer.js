import { createSlice } from '@reduxjs/toolkit';

const romanceReducer = createSlice({
  name: 'romanceReducer',
  initialState: [],
  reducers: {
    setRomanceList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export default romanceReducer;
