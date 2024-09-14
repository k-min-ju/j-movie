import { createSlice } from '@reduxjs/toolkit';

const dramaReducer = createSlice({
  name: 'dramaReducer',
  initialState: [],
  reducers: {
    setDramaList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export default dramaReducer;
