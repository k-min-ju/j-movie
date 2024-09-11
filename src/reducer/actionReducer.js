import { createSlice } from '@reduxjs/toolkit';

const actionReducer = createSlice({
  name: 'actionReducer',
  initialState: [],
  reducers: {
    setActionList(state, action) {
      let movieList = [...state];
      movieList = action.payload;
      return movieList;
    }
  }
});

export let { setActionList } = actionReducer.actions;

export default actionReducer;
