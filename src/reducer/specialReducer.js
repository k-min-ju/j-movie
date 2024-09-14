import { createSlice } from '@reduxjs/toolkit';

const specialReducer = createSlice({
  name: 'specialReducer',
  initialState: [],
  reducers: {
    setSpecialList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export default specialReducer;
