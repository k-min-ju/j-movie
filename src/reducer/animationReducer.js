import { createSlice } from '@reduxjs/toolkit';

const animationReducer = createSlice({
  name: 'animationReducer',
  initialState: [],
  reducers: {
    setAnimationList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export let { setAnimationList } = animationReducer.actions;

export default animationReducer;
