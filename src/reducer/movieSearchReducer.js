import { createSlice } from '@reduxjs/toolkit';
import { isNotEmpty } from '@/common';

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
      if (isNotEmpty(action.payload)) {
        newMovieList = movieList.concat(action.payload);
      } else {
        newMovieList = movieList;
      }
      return newMovieList;
    }
  }
});

export default movieSearchReducer;
