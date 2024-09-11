import { createSlice } from '@reduxjs/toolkit';

const recentReleaseReducer = createSlice({
  name: 'recentReleaseReducer',
  initialState: [],
  reducers: {
    setRecentReleaseList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export let { setRecentReleaseList } = recentReleaseReducer.actions;

export default recentReleaseReducer;
