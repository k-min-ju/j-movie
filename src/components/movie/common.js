import { lastYearReducer, recentReleaseReducer, specialReducer } from '@/reducer';
import { getDate } from '@/common';
import { KMDB_API_KEY, MOVIE_LIST_COUNT } from '@/configs/constants';
import { useAxios } from '@/hooks/api/useAxios';

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
  if (!specialMovie) return;

  const specialMovieMuted = localStorage.getItem('specialMovieMuted');
  // 사운드OFF
  if (specialMovieMuted === 'ON') {
    specialMovie.play();
    setMuted(true);
  }
  // 사운드ON
  else if (specialMovieMuted === 'OFF') {
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

// 볼륨 상태 값만 변경
export function volumeSvg(videoRef, setVolumeStatus) {
  if (videoRef.current.volume >= 0.7) {
    setVolumeStatus('high');
  } else if (videoRef.current.volume >= 0.4) {
    setVolumeStatus('medium');
  } else if (videoRef.current.volume > 0) {
    setVolumeStatus('low');
  } else if (videoRef.current.volume === 0) {
    setVolumeStatus('off');
  }
}

// 영화 상영 시간 계산
export function convertToHHMM(totalSeconds) {
  const hours = Math.floor(totalSeconds / 60); // 시간 구하기
  const minutes = Math.floor(totalSeconds % 60); // 초 구하기
  const formattedHours = ('0' + hours).slice(-2); // 시간과 분을 두 자릿수로 표시
  const formattedMinutes = ('0' + minutes).slice(-2); // 시간과 분을 두 자릿수로 표시
  return formattedHours + ':' + formattedMinutes;
}

// 영화 10초 전 후 이동
export function playBackForward(
  type,
  setPlayBackForward,
  setDisableClickBack,
  setDisableClickForward,
  videoRef,
  currentPlayTime,
  setCurrentPlayTime
) {
  // currentPlayTime값을 변경하면 useEffect 의존성 때문에 timelineBarUpdate호출
  if (type === 'back') {
    if (currentPlayTime > 0) {
      videoRef.current.currentTime -= 10;
      setPlayBackForward('back');
      setDisableClickBack(true);
      setCurrentPlayTime(Math.max(0, Number(currentPlayTime - 10)));
      setTimeout(() => {
        setPlayBackForward('');
        setDisableClickBack(false);
      }, 500);
    }
  } else if (type === 'forward') {
    if (Number(currentPlayTime + 10) < videoRef.current.duration) {
      videoRef.current.currentTime += 10;
      setPlayBackForward('forward');
      setDisableClickForward(true);
      setCurrentPlayTime(Math.min(videoRef.current.duration, Number(currentPlayTime + 10)));
      setTimeout(() => {
        setPlayBackForward('');
        setDisableClickForward(false);
      }, 500);
    }
  }
}

// 음량 조절 바 생성
export function movieMutedMouseOver(e) {
  const muteBtn = e.target.parentNode.parentNode;
  const soundBar = document.querySelector('.ltr-4dcwks');

  const muteBtnRect = document.getElementById('muteBtn').getBoundingClientRect();
  const soundBarRect = document.querySelector('.ltr-4dcwks').getBoundingClientRect();

  let left = Math.floor(muteBtnRect.x) + 5;
  let top = Math.floor(muteBtnRect.y - soundBarRect.height) - 10;

  if (muteBtn.classList.contains('active') === false) {
    muteBtn.className = 'active ' + muteBtn.className;
  }
  if (soundBar.classList.contains('show') === false) {
    soundBar.style.left = `${left}px`;
    soundBar.style.top = `${top}px`;
    soundBar.classList.add('show');
  }
}

export function movieMutedMouseLeave(e, setShowTimeout) {
  const muteBtn = e.target.parentNode.parentNode;
  const soundBar = document.querySelector('.ltr-4dcwks');

  let showTimeout = setTimeout(() => {
    muteBtn.classList.remove('active');
    soundBar.classList.remove('show');
  }, 300);

  setShowTimeout(showTimeout);
}

export function timelineBarUpdate(
  timeLineBarRef,
  videoRef,
  currentPlayTime,
  redLineRef,
  redBtnRef,
  setMovieDuration,
  movieData
) {
  // 영화 재생 시간이 업데이트될 때마다 타임라인 바를 업데이트하는 로직
  // 영화의 현재 재생 시간을 타임라인 바의 길이에 대한 비율로 변환 - (현재 재생 시간 / 전체 재생 시간) * 타임라인 바 전체 길이
  const timelineBarWidth = timeLineBarRef.current.offsetWidth;
  const movieDuration = videoRef.current.duration;
  const timelineRatio = (currentPlayTime / movieDuration) * timelineBarWidth;

  if (timeLineBarRef.current && timeLineBarRef.current) {
    redLineRef.current.style.width = `${timelineRatio}px`;
    redBtnRef.current.style.left = `calc(${timelineRatio}px - 0.75rem)`;
  }

  setMovieDuration(convertToHHMM(movieDuration - currentPlayTime));
  // 시청중인 영화 타임라인 바 데이터 저장
  setStorageMovieIdSeq(
    movieData[0].DOCID,
    redLineRef.current.style.width,
    redBtnRef.current.style.left,
    currentPlayTime,
    videoRef.current.duration
  );
}

export function fullScreen(isFullScreen, setIsFullScreen) {
  if (isFullScreen) {
    setIsFullScreen(false);
  } else {
    setIsFullScreen(true);
  }
}

export function setStorageMovieIdSeq(docId, redLineWidth, redBtnLeft, currentTime, duration) {
  localStorage.setItem(
    docId,
    JSON.stringify({
      redLineWidth: redLineWidth,
      redBtnLeft: redBtnLeft,
      currentTime: currentTime,
      duration: duration
    })
  );
}

// 재생버튼
export function moviePlayBtn(isPlayMovie, setIsPlayMovie, videoRef) {
  if (isPlayMovie) {
    videoRef.current.pause();
  } else {
    videoRef.current.play();
  }
  setIsPlayMovie(!isPlayMovie);
}

// 볼륨 상태 변경 및 음소거처리
export function chgVolumeStatus(videoRef, setVolumeStatus, ariaValueRef, knobRef, railRef) {
  if (videoRef.current.muted) {
    videoRef.current.muted = false;
    if (videoRef.current.volume >= 0.7) {
      setVolumeStatus('high');
    } else if (videoRef.current.volume >= 0.4) {
      setVolumeStatus('medium');
    } else if (videoRef.current.volume > 0) {
      setVolumeStatus('low');
    } else if (videoRef.current.volume === 0) {
      setVolumeStatus('off');
    }
    localStorage.setItem('movieMuted', 'OFF');
    ariaValueRef.current.setAttribute('aria-valuenow', localStorage.getItem('movieVolume'));
    knobRef.current.style.top = localStorage.getItem('knobTop');
    railRef.current.children[0].style.top = localStorage.getItem('railTop');
    railRef.current.children[0].style.height = localStorage.getItem('railHeight');
  } else {
    videoRef.current.muted = true;
    setVolumeStatus('off');
    localStorage.setItem('movieMuted', 'ON');
    ariaValueRef.current.setAttribute('aria-valuenow', 0);
    knobRef.current.style.top = 'calc(' + Math.floor(railRef.current.getBoundingClientRect().height) + 'px - 1.125rem)';
    railRef.current.children[0].style.top = '0px';
    railRef.current.children[0].style.height = '0px';
  }
}

// 시청중인 영화를 보여주기 위한 함수
export function setWatchingMovieData(paramData, movieVal) {
  let movieData = JSON.parse(JSON.stringify(paramData));
  movieData.movieVal = movieVal;

  const watchingMovieData = JSON.parse(localStorage.getItem('watchingMovieData'));
  if (watchingMovieData) {
    const existingData = watchingMovieData.find(movie => movie.DOCID === movieData.DOCID);
    if (!existingData) {
      watchingMovieData.push(movieData);
      localStorage.setItem('watchingMovieData', JSON.stringify(watchingMovieData));
    }
  } else {
    localStorage.setItem('watchingMovieData', JSON.stringify([movieData]));
  }
}

export function getMovieVal(movieVal, docId) {
  if (localStorage.getItem('watchingMovieData')) {
    const existingData = JSON.parse(localStorage.getItem('watchingMovieData')).find(movie => movie.DOCID === docId);
    if (existingData) return existingData.movieVal;
  }
  return movieVal;
}

// 시청중인 영화 삭제
export function removeWatchingData(docId) {
  localStorage.removeItem(docId);
  if (localStorage.getItem('watchingMovieData')) {
    const existingData = JSON.parse(localStorage.getItem('watchingMovieData')).filter(item => item.DOCID !== docId);
    localStorage.setItem('watchingMovieData', JSON.stringify(existingData));
  }
}

export function KMDBMovieAPI() {
  const { axiosGet } = useAxios();

  const getKMDBMovieOne = async (movieId, movieSeq) => {
    const searchParam = {
      ServiceKey: KMDB_API_KEY,
      collection: 'kmdb_new2',
      detail: 'Y',
      movieId: movieId,
      movieSeq: movieSeq
    };
    return await axiosGet('/openapi-data2/wisenut/search_api/search_json2.jsp', { params: searchParam });
  };

  const getKMDbMovieList = async (searchParam, dispatch, setDataFunction) => {
    return axiosGet('/openapi-data2/wisenut/search_api/search_json2.jsp', { params: searchParam }).then(response => {
      const moiveList = response?.Data[0]?.Result;
      dispatch(setDataFunction(moiveList.filter(item => item.posters)));
    });
  };

  const getMovieListInfinityScroll = async (searchParam, dispatch, setDataFunction, count, setIsLoading) => {
    setIsLoading(true);
    return axiosGet('/openapi-data2/wisenut/search_api/search_json2.jsp', { params: searchParam }).then(response => {
      const movieInfo = response?.Data[0]?.Result;
      dispatch(setDataFunction(movieInfo.filter(item => item.posters)));

      if (count === 5) {
        setIsLoading(false);
      }
    });
  };

  const getSearchMovieList = async (
    searchParam,
    dispatch,
    setDataFunction,
    startCount,
    setStartCount,
    listCount,
    setIsLoading
  ) => {
    setIsLoading(true);
    return axiosGet('/openapi-data2/wisenut/search_api/search_json2.jsp', { params: searchParam }).then(response => {
      const movieInfo = response?.Data[0]?.Result;
      setStartCount(startCount + listCount);
      dispatch(setDataFunction(movieInfo.filter(item => item.posters)));
      setIsLoading(false);
    });
  };

  const getSpecialMovie = async dispatch => {
    const searchParam = {
      ServiceKey: KMDB_API_KEY,
      collection: 'kmdb_new2',
      detail: 'Y',
      movieId: 'F',
      movieSeq: '57989'
    };
    await getKMDbMovieList(searchParam, dispatch, specialReducer.actions.setSpecialList);
  };

  const getLastYearMovie = async dispatch => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    const searchParam = {
      ServiceKey: KMDB_API_KEY,
      collection: 'kmdb_new2',
      detail: 'Y',
      sort: 'prodYear,0',
      releaseDts: getDate(date),
      releaseDte: getDate(),
      ratedYn: 'Y',
      listCount: MOVIE_LIST_COUNT
    };
    await getKMDbMovieList(searchParam, dispatch, lastYearReducer.actions.setLastYearList);
  };

  const getRecentReleaseMovie = async dispatch => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const searchParam = {
      ServiceKey: KMDB_API_KEY,
      collection: 'kmdb_new2',
      detail: 'Y',
      sort: 'prodYear,1',
      releaseDts: getDate(date),
      releaseDte: getDate(),
      ratedYn: 'Y',
      listCount: 20
    };
    await getKMDbMovieList(searchParam, dispatch, recentReleaseReducer.actions.setRecentReleaseList);
  };

  const getGenreMovie = async (dispatch, genre, setReducerFunc, count, setIsLoading) => {
    const searchParam = {
      ServiceKey: KMDB_API_KEY,
      collection: 'kmdb_new2',
      detail: 'Y',
      sort: 'prodYear,1',
      ratedYn: 'Y',
      genre: genre,
      listCount: MOVIE_LIST_COUNT
    };
    await getMovieListInfinityScroll(searchParam, dispatch, setReducerFunc, count, setIsLoading);
  };

  const getSearchMovie = async (
    dispatch,
    startCount,
    setStartCount,
    title,
    listCount,
    setDataFunction,
    setIsLoading
  ) => {
    const searchParam = {
      ServiceKey: KMDB_API_KEY,
      collection: 'kmdb_new2',
      detail: 'Y',
      ratedYn: 'Y',
      title: title,
      startCount: startCount,
      listCount: listCount
    };

    await getSearchMovieList(
      searchParam,
      dispatch,
      setDataFunction,
      startCount,
      setStartCount,
      listCount,
      setIsLoading
    );
  };

  return {
    getKMDBMovieOne,
    getSpecialMovie,
    getLastYearMovie,
    getRecentReleaseMovie,
    getGenreMovie,
    getSearchMovie
  };
}
