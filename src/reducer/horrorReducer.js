import { createSlice } from '@reduxjs/toolkit';

const horrorReducer = createSlice({
  name: 'horrorReducer',
  initialState: [],
  reducers: {
    setHorrorList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export default horrorReducer;
