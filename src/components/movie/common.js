// KMDb에 영화 리스트 요청
import axios from 'axios';
import { setSpecialList } from '@/reducer/specialReducer.js';
import { setLastYearList } from '@/reducer/lastYearReducer.js';
import { setRecentReleaseList } from '@/reducer/recentReleaseReducer.js';
import { getDate, isEmpty, isNotEmpty } from '@/common';

const movieListCount = 60;

export function specialMoviePlay(setMuted, setIsMovieStart, replay) {
  // 메인 이미지 걷어낸 후 동영상 재생
  let element = document.querySelector('.trailer-billboard');
  if (element) {
    element.classList.toggle('video-playing');
    element.children[0].classList.toggle('dismiss-static', 'dismiss-mask');
    element.children[0].children[0].className = 'nfp nf-player-container notranslate inactive NFPlayer';
  }

  // chrome 자동 재생 정책 > 음소거를 해야만 autoPlay 사용가능(동영상 자동 재생 시 원치 않는 사운드 재생 방지)
  // specialMovie컴포넌트 로드 후 동영상을 강제로 재생시키고 사운드 설정.
  // 동영상 강제 재생 후 사운드ON이 chrome 정책상 불가
  const specialMovie = document.getElementById('specialMovie');
  if (isEmpty(specialMovie)) return;

  // 사운드OFF
  if (localStorage.getItem('specialMovieMuted') === 'ON') {
    specialMovie.play();
    setMuted(true);
  }
  // 사운드ON
  else if (localStorage.getItem('specialMovieMuted') === 'OFF') {
    specialMovie.muted = true;
    specialMovie.play();
    specialMovie.muted = false;
    setMuted(false);
  } else {
    specialMovie.play();
    if (replay !== 'Y') {
      specialMovie.muted = false;
      setMuted(false);
    }
  }
  setIsMovieStart(true);
}

export function getKMDBMovieOne(movieId, movieSeq) {
  const searchParam = {
    ServiceKey: process.env.REACT_APP_KMDB_API_KEY,
    collection: 'kmdb_new2',
    detail: 'Y',
    movieId: movieId,
    movieSeq: movieSeq
  };
  return getKMDbMovieOne(searchParam);
}

// 메인 special 영화
export function getSpecialMovie(dispatch) {
  const searchParam = {
    ServiceKey: process.env.REACT_APP_KMDB_API_KEY,
    collection: 'kmdb_new2',
    detail: 'Y',
    movieId: 'F',
    movieSeq: '57989'
  };
  getKMDbMovieList(searchParam, dispatch, setSpecialList);
}

// 지난 1년간 공개된 영화 리스트
export function getLastYearMovie(dispatch) {
  let date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  const searchParam = {
    ServiceKey: process.env.REACT_APP_KMDB_API_KEY,
    collection: 'kmdb_new2',
    detail: 'Y',
    sort: 'prodYear,0',
    releaseDts: getDate(date),
    releaseDte: getDate(),
    ratedYn: 'Y',
    listCount: movieListCount
  };
  getKMDbMovieList(searchParam, dispatch, setLastYearList);
}

// 최근 개봉한 영화 리스트
export function getRecentReleaseMovie(dispatch) {
  let date = new Date();
  date.setMonth(date.getMonth() - 1);
  const searchParam = {
    ServiceKey: process.env.REACT_APP_KMDB_API_KEY,
    collection: 'kmdb_new2',
    detail: 'Y',
    sort: 'prodYear,1',
    releaseDts: getDate(date),
    releaseDte: getDate(),
    ratedYn: 'Y',
    listCount: 20
  };
  getKMDbMovieList(searchParam, dispatch, setRecentReleaseList);
}

// 장르를 parameter로 영화 조회
export function getGenreMovie(dispatch, genre, setReducerFunc, count, setIsLoading) {
  const searchParam = {
    ServiceKey: process.env.REACT_APP_KMDB_API_KEY,
    collection: 'kmdb_new2',
    detail: 'Y',
    sort: 'prodYear,1',
    ratedYn: 'Y',
    genre: genre,
    listCount: movieListCount
  };
  getMovieListInfinityScroll(searchParam, dispatch, setReducerFunc, count, setIsLoading);
}

// startCount로 movieListCount수 만큼 분할하여 조회
export function getSearchMovie(dispatch, startCount, setStartCount, title, listCount, setDataFunction, setIsLoading) {
  console.log('startCount11111111111111111111=' + startCount);
  const searchParam = {
    ServiceKey: process.env.REACT_APP_KMDB_API_KEY,
    collection: 'kmdb_new2',
    detail: 'Y',
    ratedYn: 'Y',
    title: title,
    startCount: startCount,
    listCount: listCount
  };
  getSearchMovieList(searchParam, dispatch, setDataFunction, startCount, setStartCount, listCount, setIsLoading);
}

async function getKMDbMovieList(searchParam, dispatch, setDataFunction) {
  if (isNotEmpty(searchParam)) {
    const movieSearch = axios.create({
      baseURL: process.env.REACT_APP_KMDB_API_URL,
      timeout: 10000
    });
    const getMovieList = params => {
      return movieSearch
        .get('/openapi-data2/wisenut/search_api/search_json2.jsp', { params })
        .catch(err => {
          console.log('error=' + err);
          return Promise.reject(err);
        })
        .then(res => {
          if (isEmpty(res)) return;

          let movieInfo = res.data.Data[0].Result;
          if (movieInfo) {
            movieInfo = movieInfo.filter(item => isNotEmpty(item.posters));
            dispatch(setDataFunction(movieInfo));
          }
        });
    };
    await getMovieList(searchParam);
  }
}

async function getMovieListInfinityScroll(searchParam, dispatch, setDataFunction, count, setIsLoading) {
  if (isNotEmpty(searchParam)) {
    const movieSearch = axios.create({
      baseURL: process.env.REACT_APP_KMDB_API_URL,
      timeout: 10000
    });
    const getMovieList = params => {
      setIsLoading(true);
      return movieSearch
        .get('/openapi-data2/wisenut/search_api/search_json2.jsp', { params })
        .catch(err => {
          console.log('error=' + err);
          return Promise.reject(err);
        })
        .then(res => {
          if (isEmpty(res)) return;

          let movieInfo = res.data.Data[0].Result;
          if (movieInfo) {
            movieInfo = movieInfo.filter(item => isNotEmpty(item.posters));
            dispatch(setDataFunction(movieInfo));
          }

          if (count == 5) {
            setIsLoading(false);
          }
        });
    };
    await getMovieList(searchParam);
  }
}

async function getSearchMovieList(
  searchParam,
  dispatch,
  setDataFunction,
  startCount,
  setStartCount,
  listCount,
  setIsLoading
) {
  if (isNotEmpty(searchParam)) {
    const movieSearch = axios.create({
      baseURL: process.env.REACT_APP_KMDB_API_URL,
      timeout: 10000
    });
    const getMovieList = params => {
      setIsLoading(true);
      return movieSearch
        .get('/openapi-data2/wisenut/search_api/search_json2.jsp', { params })
        .catch(err => {
          console.log('error=' + err);
          return Promise.reject(err);
        })
        .then(res => {
          if (isEmpty(res)) return;

          let movieInfo = res.data.Data[0].Result;
          if (movieInfo) {
            movieInfo = movieInfo.filter(item => isNotEmpty(item.posters));
            setStartCount(startCount + listCount);
            dispatch(setDataFunction(movieInfo));
            setIsLoading(false);
          }
        });
    };
    await getMovieList(searchParam);
  }
}

async function getKMDbMovieOne(searchParam) {
  let movieInfo;
  if (isNotEmpty(searchParam)) {
    const movieSearch = axios.create({
      baseURL: process.env.REACT_APP_KMDB_API_URL,
      timeout: 10000
    });
    const getMovie = params => {
      return movieSearch
        .get('/openapi-data2/wisenut/search_api/search_json2.jsp', { params })
        .catch(err => {
          console.log('error=' + err);
          return Promise.reject(err);
        })
        .then(res => {
          if (isEmpty(res)) return;

          movieInfo = res.data.Data[0].Result;
        });
    };
    await getMovie(searchParam);
  }

  return movieInfo;
}
