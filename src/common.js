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
  meloReducer,
  mysteryReducer,
  romanceReducer,
  sfReducer,
  thrillerReducer,
  youthReducer
} from '@/reducer';

export const googleLogOut = () => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('loginType');
};

export function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

export function isNotEmpty(value) {
  return value !== null && value !== '';
}

export function getDate(date) {
  if (!date) {
    date = new Date();
  }
  let today = '';
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;
  today = yyyy + '' + mm + '' + dd;
  return today;
}

export function getGenreJsonData() {
  return [
    {
      genre: '애니메이션',
      setReducerFunc: animationReducer.actions.setAnimationList,
      reducer: 'animationReducer',
      genreTitle: '애니메이션'
    },
    {
      genre: '범죄',
      setReducerFunc: crimeReducer.actions.setCrimeList,
      reducer: 'crimeReducer',
      genreTitle: '범죄'
    },
    {
      genre: '스릴러',
      setReducerFunc: thrillerReducer.actions.setThrillerList,
      reducer: 'thrillerReducer',
      genreTitle: '스릴러'
    },
    {
      genre: '드라마',
      setReducerFunc: dramaReducer.actions.setDramaList,
      reducer: 'dramaReducer',
      genreTitle: '드라마'
    },
    {
      genre: 'SF',
      setReducerFunc: sfReducer.actions.setSfList,
      reducer: 'sfReducer',
      genreTitle: 'SF'
    },
    {
      genre: '액션',
      setReducerFunc: actionReducer.actions.setActionList,
      reducer: 'actionReducer',
      genreTitle: '액션'
    },
    {
      genre: '모험',
      setReducerFunc: adventureReducer.actions.setAdventureList,
      reducer: 'adventureReducer',
      genreTitle: '모험'
    },
    {
      genre: '코메디',
      setReducerFunc: comedyReducer.actions.setComedyList,
      reducer: 'comedyReducer',
      genreTitle: '코미디'
    },
    {
      genre: '가족',
      setReducerFunc: familyReducer.actions.setFamilyList,
      reducer: 'familyReducer',
      genreTitle: '가족'
    },
    {
      genre: '하이틴',
      setReducerFunc: highteenReducer.actions.setHighteenList,
      reducer: 'highteenReducer',
      genreTitle: '하이틴'
    },
    {
      genre: '공포',
      setReducerFunc: horrorReducer.actions.setHorrorList,
      reducer: 'horrorReducer',
      genreTitle: '공포'
    },
    {
      genre: '멜로',
      setReducerFunc: meloReducer.actions.setMeloList,
      reducer: 'meloReducer',
      genreTitle: '멜로'
    },
    {
      genre: '미스터리',
      setReducerFunc: mysteryReducer.actions.setMysteryList,
      reducer: 'mysteryReducer',
      genreTitle: '미스터리'
    },
    {
      genre: '로맨스',
      setReducerFunc: romanceReducer.actions.setRomanceList,
      reducer: 'romanceReducer',
      genreTitle: '로맨스'
    },
    {
      genre: '청춘영화',
      setReducerFunc: youthReducer.actions.setYouthList,
      reducer: 'youthReducer',
      genreTitle: '청춘'
    }
  ];
}

export function getMovieJsonData() {
  return [
    {
      movieVal: 'MK059366_P02'
    },
    {
      movieVal: 'MK042227_P02'
    },
    {
      movieVal: 'MK044049_P02'
    },
    {
      movieVal: 'MK042090_P02'
    },
    {
      movieVal: 'MK042064_P02'
    },
    {
      movieVal: 'MK059454_P02'
    },
    {
      movieVal: 'MK059009_P02'
    },
    {
      movieVal: 'MK059556_P02'
    },
    {
      movieVal: 'MK059183_P02'
    },
    {
      movieVal: 'MK059366_P02'
    },
    {
      movieVal: 'MK059429_P02'
    },
    {
      movieVal: 'MK059595_P02'
    },
    {
      movieVal: 'MK059258_P02'
    },
    {
      movieVal: 'MK059530_P02'
    },
    {
      movieVal: 'MK059198_P02'
    },
    {
      movieVal: 'MK058820_P02'
    },
    {
      movieVal: 'MK059057_P02'
    },
    {
      movieVal: 'MK059466_P02'
    },
    {
      movieVal: 'MK059463_P02'
    },
    {
      movieVal: 'MK059487_P02'
    },
    {
      movieVal: 'MK059060_P02'
    },
    {
      movieVal: 'MK059055_P02'
    },
    {
      movieVal: 'MK059593_P02'
    },
    {
      movieVal: 'MK059513_P02'
    },
    {
      movieVal: 'MK059167_P02'
    },
    {
      movieVal: 'MK059505_P02'
    },
    {
      movieVal: 'MK059323_P02'
    },
    {
      movieVal: 'MK059322_P02'
    }
  ];
}
