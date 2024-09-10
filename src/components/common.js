import { setAnimationList } from '../reducer/animationReducer.js';
import { setCrimeList } from '../reducer/crimeReducer.js';
import { setThrillerList } from '../reducer/thrillerReducer.js';
import { setDramaList } from '../reducer/dramaReducer.js';
import { setSfList } from '../reducer/sfReducer.js';
import { setActionList } from '../reducer/actionReducer.js';
import { setAdventureList } from '../reducer/adventureReducer.js';
import { setHighteenList } from '../reducer/highteenReducer.js';
import { setHorrorList } from '../reducer/horrorReducer.js';
import { setMeloList } from '../reducer/meloReducer.js';
import { setMysteryList } from '../reducer/mysteryReducer';
import { setRomanceList } from '../reducer/romanceReducer';
import { setYouthList } from '../reducer/youthReducer';
import { setComedyList } from '../reducer/comedyReducer';

export function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

export function isNotEmpty(value) {
  return value !== null && value !== '';
}

export function getDate(date) {
  if (isEmpty(date)) {
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
      setReducerFunc: setAnimationList,
      reducer: 'animationReducer',
      genreTitle: '애니메이션'
    },
    {
      genre: '범죄',
      setReducerFunc: setCrimeList,
      reducer: 'crimeReducer',
      genreTitle: '범죄'
    },
    {
      genre: '스릴러',
      setReducerFunc: setThrillerList,
      reducer: 'thrillerReducer',
      genreTitle: '스릴러'
    },
    {
      genre: '드라마',
      setReducerFunc: setDramaList,
      reducer: 'dramaReducer',
      genreTitle: '드라마'
    },
    {
      genre: 'SF',
      setReducerFunc: setSfList,
      reducer: 'sfReducer',
      genreTitle: 'SF'
    },
    {
      genre: '액션',
      setReducerFunc: setActionList,
      reducer: 'actionReducer',
      genreTitle: '액션'
    },
    {
      genre: '모험',
      setReducerFunc: setSfList,
      reducer: 'adventureReducer',
      genreTitle: '모험'
    },
    {
      genre: '코메디',
      setReducerFunc: setComedyList,
      reducer: 'comedyReducer',
      genreTitle: '코미디'
    },
    {
      genre: '가족',
      setReducerFunc: setAdventureList,
      reducer: 'familyReducer',
      genreTitle: '가족'
    },
    {
      genre: '하이틴',
      setReducerFunc: setHighteenList,
      reducer: 'highteenReducer',
      genreTitle: '하이틴'
    },
    {
      genre: '공포',
      setReducerFunc: setHorrorList,
      reducer: 'horrorReducer',
      genreTitle: '공포'
    },
    {
      genre: '멜로',
      setReducerFunc: setMeloList,
      reducer: 'meloReducer',
      genreTitle: '멜로'
    },
    {
      genre: '미스터리',
      setReducerFunc: setMysteryList,
      reducer: 'mysteryReducer',
      genreTitle: '미스터리'
    },
    {
      genre: '로맨스',
      setReducerFunc: setRomanceList,
      reducer: 'romanceReducer',
      genreTitle: '로맨스'
    },
    {
      genre: '청춘영화',
      setReducerFunc: setYouthList,
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

// 시청중인 영화를 보여주기 위한 함수
export function setWatchingMovieData(paramData, movieVal) {
  let movieData = JSON.parse(JSON.stringify(paramData));
  movieData.movieVal = movieVal;

  if (window.common.isEmpty(localStorage.getItem('watchingMovieData'))) {
    localStorage.setItem('watchingMovieData', JSON.stringify([movieData]));
  } else {
    const existingData = JSON.parse(localStorage.getItem('watchingMovieData'));
    let isDuplicate = false;
    existingData.find(movie => {
      if (movie.DOCID == movieData.DOCID) {
        isDuplicate = true;
        return true;
      }
    });
    if (isDuplicate == false) {
      existingData.push(movieData);
      localStorage.setItem('watchingMovieData', JSON.stringify(existingData));
    }
  }
}

export function getMovieVal(movieVal, docId) {
  let result;
  let isDuplicate = false;
  let existingData;
  if (isNotEmpty(localStorage.getItem('watchingMovieData'))) {
    existingData = JSON.parse(localStorage.getItem('watchingMovieData'));
    existingData = existingData.find(movie => {
      if (movie.DOCID === docId) {
        isDuplicate = true;
        return movie;
      }
    });
  }
  if (isDuplicate) {
    result = existingData.movieVal;
  } else {
    result = movieVal;
  }

  return result;
}

// 시청중인 영화 삭제
export function removeWatchingData(docId) {
  if (isEmpty(docId)) return;

  let existingData;
  localStorage.removeItem(docId);
  if (window.common.isNotEmpty(localStorage.getItem('watchingMovieData'))) {
    existingData = JSON.parse(localStorage.getItem('watchingMovieData'));
    existingData = existingData.filter(item => item.DOCID !== docId);
    localStorage.setItem('watchingMovieData', JSON.stringify(existingData));
  }
}
