import { createSlice } from '@reduxjs/toolkit';

const highteenReducer = createSlice({
  name: 'highteenReducer',
  initialState: [],
  reducers: {
    setHighteenList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export default highteenReducer;
