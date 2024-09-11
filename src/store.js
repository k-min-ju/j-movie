import { configureStore } from '@reduxjs/toolkit';
import {
  actionReducer,
  adventureReducer,
  animationReducer,
  comedyReducer,
  crimeReducer,
  dramaReducer,
  familyReducer,
  highteenReducer,
  horrorReducer,
  lastYearReducer,
  meloReducer,
  movieSearchReducer,
  mysteryReducer,
  recentReleaseReducer,
  romanceReducer,
  sfReducer,
  specialReducer,
  thrillerReducer,
  youthReducer
} from '@/reducer';

export default configureStore({
  reducer: {
    lastYearReducer: lastYearReducer.reducer,
    recentReleaseReducer: recentReleaseReducer.reducer,
    animationReducer: animationReducer.reducer,
    crimeReducer: crimeReducer.reducer,
    thrillerReducer: thrillerReducer.reducer,
    dramaReducer: dramaReducer.reducer,
    sfReducer: sfReducer.reducer,
    specialReducer: specialReducer.reducer,
    actionReducer: actionReducer.reducer,
    adventureReducer: adventureReducer.reducer,
    comedyReducer: comedyReducer.reducer,
    familyReducer: familyReducer.reducer,
    highteenReducer: highteenReducer.reducer,
    horrorReducer: horrorReducer.reducer,
    meloReducer: meloReducer.reducer,
    mysteryReducer: mysteryReducer.reducer,
    romanceReducer: romanceReducer.reducer,
    youthReducer: youthReducer.reducer,
    movieSearchReducer: movieSearchReducer.reducer
  }
});
