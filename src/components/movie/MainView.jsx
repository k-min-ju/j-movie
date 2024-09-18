import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { KMDBMovieAPI, specialMoviePlay } from '@/components/movie/common';
import { getGenreJsonData } from '@/common';
import { GenreMovieCarousel, SpecialMovie, WatchingMovie } from '@/components/movie/index';

export default function MainView(props) {
  const { dispatch, searchBoxRef, searchInputRef, isLoading, setIsLoading } = props;

  const { getGenreMovie, getLastYearMovie, getRecentReleaseMovie, getSpecialMovie } = KMDBMovieAPI();

  const maxCardListCnt = 5; // 지난 1년간 공개된 영화, 최근 개봉한 영화를 제외한 영화 카드 리스트 개수

  const specialReducer = useSelector(state => state.specialReducer);
  const reducersWithTitles = [
    { reducer: useSelector(state => state.lastYearReducer), genreTitle: '지난 1년간 공개된 영화' },
    { reducer: useSelector(state => state.recentReleaseReducer), genreTitle: '최근 개봉한 영화' }
  ];
  const allMovieData = getGenreJsonData();
  allMovieData.forEach(movie => {
    reducersWithTitles.push({
      reducer: useSelector(state => state[movie.reducer]),
      genreTitle: movie.genreTitle
    });
  });

  // 장르별 영화 조회하기 위한 JsonData
  const genreArray = getGenreJsonData();

  // 지난 1년간 공개된 영화, 최근 개봉한 영화를 제외한 현재까지 조회 완료된 cardList 수
  const [currentCardListCnt, setCurrentCardListCnt] = useState(0);
  const [specialMovieFunc, setSpecialMovieFunc] = useState();
  const [isMovieStart, setIsMovieStart] = useState(false);
  const [isReplay, setIsReplay] = useState(false);
  const [muted, setMuted] = useState(true);

  let watchingMovieList = []; // 시청중인 영화 리스트
  if (localStorage.getItem('watchingMovieData')) {
    watchingMovieList = JSON.parse(localStorage.getItem('watchingMovieData'));
  }

  // 장르별 영화 카드 리스트 조회
  async function getMovieCardList(dispatch, genreArray, currentCardListCnt, setCurrentCardListCnt, setIsLoading) {
    if (currentCardListCnt < genreArray.length) {
      let count = 0;
      for (let i = currentCardListCnt; i < genreArray.length; i++) {
        count++;
        const movieData = genreArray[i];

        await getGenreMovie(dispatch, movieData.genre, movieData.setReducerFunc, count, setIsLoading);
        if (count === maxCardListCnt) {
          setCurrentCardListCnt(currentCardListCnt + count);
          break;
        }

        if (i + 1 === genreArray.length) {
          setCurrentCardListCnt(currentCardListCnt + count);
        }
      }
    }
  }

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    const loginType = sessionStorage.getItem('loginType');
    if (accessToken && loginType) {
      location.href = '/login';
      return;
    }

    const fetchData = async () => {
      // 영화 리스트 조회
      await getSpecialMovie(dispatch);
      await getLastYearMovie(dispatch);
      await getRecentReleaseMovie(dispatch);
      await getMovieCardList(dispatch, genreArray, currentCardListCnt, setCurrentCardListCnt, setIsLoading);
    };

    fetchData().then();

    const specialMovieInit = () => {
      setTimeout(() => {
        // 특별 소개 영화 재생
        specialMoviePlay(setMuted, setIsMovieStart, 'N');
      }, 2500);
    };
    setSpecialMovieFunc(specialMovieInit);
  }, []);

  useEffect(() => {
    // 검색창 외 영역 클릭 감지
    function handleOutside(e) {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target) &&
        document.querySelector('.searchBox').classList.contains('active')
      ) {
        searchBoxRef.current.classList.toggle('active');
        searchInputRef.current.value = '';
      }
    }

    document.addEventListener('mousedown', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, []);

  const handleScroll = useCallback(async () => {
    // 스크롤 시 상단 바 고정
    if (document.documentElement.scrollTop > 0) {
      document.querySelector('.pinning-header-container').style = 'background: rgb(20,20,20);';
      document.querySelector('.main-header').style = 'background-color: rgb(20,20,20);';
    } else {
      document.querySelector('.pinning-header-container').style = 'background: transparent;';
      document.querySelector('.main-header').style = '';
    }

    // 인피니티 스크롤
    if (
      window.innerHeight + document.documentElement.scrollTop > document.documentElement.scrollHeight - 1000 &&
      !isLoading
    ) {
      await getMovieCardList(dispatch, genreArray, currentCardListCnt, setCurrentCardListCnt, setIsLoading);
    }
  }, [currentCardListCnt, isLoading]);

  useEffect(() => {
    // 스크롤 감지
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="lolomo is-fullbleed">
      <h1 className="visually-hidden">J MOVIE 홈</h1>
      {/*특별 소개 컨텐츠*/}
      <SpecialMovie
        movieList={specialReducer}
        specialMovieFunc={specialMovieFunc}
        isMovieStart={isMovieStart}
        setIsMovieStart={setIsMovieStart}
        isReplay={isReplay}
        setIsReplay={setIsReplay}
        muted={muted}
        setMuted={setMuted}
      />

      {/*시청중인 영화*/}
      <WatchingMovie movieList={watchingMovieList} />

      {reducersWithTitles.map(movieInfo => (
        <GenreMovieCarousel
          key={movieInfo.genreTitle}
          movieList={movieInfo.reducer}
          genreTitle={movieInfo.genreTitle}
        />
      ))}
    </div>
  );
}
