import { createSlice } from '@reduxjs/toolkit';

const movieSearchReducer = createSlice({
  name: 'movieSearchReducer',
  initialState: [],
  reducers: {
    setMovieSearchList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    },
    addMovieSearchList(state, action) {
      let movieList = [...state];
      let newMovieList;
      if (action.payload) {
        newMovieList = movieList.concat(action.payload);
      } else {
        newMovieList = movieList;
      }
      return newMovieList;
    }
  }
});

export default movieSearchReducer;
