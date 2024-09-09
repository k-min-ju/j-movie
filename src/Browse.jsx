import './Browse.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import googleLogOut from './login/GoogleLogOut.js';
import SpecialMovie, { specialMoviePlay } from './component/movie/specialMovie.jsx';
import WatchingMovie from './component/movie/watchingMovie.jsx';
import LastYearMovie from './component/movie/lastYearMovie.jsx';
import RecentReleaseMovie from './component/movie/recentReleaseMovie.jsx';
import AnimationMovie from './component/movie/animationMovie.jsx';
import CrimeMovie from './component/movie/crimeMovie.jsx';
import ThrillerMovie from './component/movie/thrillerMovie.jsx';
import DramaMovie from './component/movie/dramaMovie.jsx';
import SFMovie from './component/movie/sfMovie.jsx';
import ActionMovie from './component/movie/actionMovie.jsx';
import AdventureMovie from './component/movie/adventureMovie.jsx';
import ComedyMovie from './component/movie/comedyMovie.jsx';
import FamilyMovie from './component/movie/familyMovie.jsx';
import HighteenMovie from './component/movie/highteenMovie.jsx';
import HorrorMovie from './component/movie/horrorMovie.jsx';
import MeloMovie from './component/movie/meloMovie.jsx';
import MysteryMovie from './component/movie/mysteryMovie.jsx';
import RomanceMovie from './component/movie/romanceMovie.jsx';
import YouthMovie from './component/movie/youthMovie.jsx';
import MovieSearch from './component/movie/movieSearch.jsx';
import {
  getGenreMovie,
  getLastYearMovie,
  getRecentReleaseMovie,
  getSearchMovie,
  getSpecialMovie
} from './component/movie/movieListFunc.jsx';

import { setMovieSearchList } from './reducer/movieSearchReducer.js';

const maxCardListCnt = 5; // 지난 1년간 공개된 영화, 최근 개봉한 영화를 제외한 영화 카드 리스트 개수

function Browse() {
  let dispatch = useDispatch();
  let [isSearchStart, setIsSearchStart] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let [startCount, setStartCount] = useState(0);

  const searchBoxRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceFunctionRef = useRef(null);
  const inputValueRef = useRef(null);
  const movieSearchReducer = useSelector(state => state.movieSearchReducer);

  // 디바운스 함수 정의
  const debounce = (func, delay) => {
    let timer;
    return function (inputValue) {
      clearTimeout(timer);
      timer = setTimeout(() => func(inputValue), delay);
    };
  };

  // 검색 요청 함수
  const fetchSearchResults = inputValue => {
    window.scrollTo({ top: 0 });
    dispatch(setMovieSearchList([]));
    getSearchMovie(dispatch, startCount, setStartCount, inputValue, 100, setMovieSearchList, setIsLoading);
  };

  // 디바운스를 적용한 핸들러
  const handleInputChange = event => {
    const inputValue = event.target.value;
    setIsSearchStart(inputValue.trim().length > 0);
    if (inputValue.trim().length < 1) {
      dispatch(setMovieSearchList([]));
    }
    inputValueRef.current = inputValue;

    if (!debounceFunctionRef.current) {
      debounceFunctionRef.current = debounce(() => {
        fetchSearchResults(inputValueRef.current);
      }, 500);
    }

    debounceFunctionRef.current();
  };

  const inputReset = () => {
    searchInputRef.current.value = '';
    searchBoxRef.current.classList.remove('active');
    setIsSearchStart(false);
    setStartCount(0);
    dispatch(setMovieSearchList([]));
  };

  return (
    <>
      <div id="appMountPoint">
        <div className="netflix-sans-font-loaded">
          <div dir="ltr" className="extended-diacritics-language">
            <div>
              <div className="bd dark-background" lang="ko-KR" style={{ overflow: 'visible' }}>
                <div
                  className="pinning-header"
                  style={{ position: 'sticky', top: '0', height: 'auto', minHeight: '70px', zIndex: '1' }}
                >
                  <div className="pinning-header-container" style={{ background: 'transparent' }}>
                    <div id="clcsBanner" style={{ overflow: 'auto' }}></div>
                    <div className="main-header has-billboard menu-navigation" role="navigation">
                      <a aria-label="J-MOVIE" className="logo icon-logoUpdate active" href="/browse">
                        <img className="logo icon-logoUpdate active" src={process.env.PUBLIC_URL + '/mainLogo.png'} />
                      </a>
                      <ul className="tabbed-primary-navigation">
                        {/*<li className="navigation-menu"><a className="menu-trigger" role="button" aria-haspopup="true" href="todo" tabIndex="0">메뉴</a></li>*/}
                        <li className="navigation-tab">
                          <a className="current active" href="/browse">
                            홈
                          </a>
                        </li>
                        {/*<li className="navigation-tab"><a href="#" onClick={(e) => {e.preventDefault()}}>시리즈</a></li>*/}
                        {/*<li className="navigation-tab"><a href="#" onClick={(e) => {e.preventDefault()}}>영화</a></li>*/}
                        {/*<li className="navigation-tab"><a href="#" onClick={(e) => {e.preventDefault()}}>NEW! 요즘 대세 콘텐츠</a></li>*/}
                        {/*<li className="navigation-tab"><a href="#" onClick={(e) => {e.preventDefault()}}>내가 찜한 콘텐츠</a></li>*/}
                        {/*<li className="navigation-tab"><a href="#" onClick={(e) => {e.preventDefault()}}>언어별로 찾아보기</a></li>*/}
                      </ul>
                      <div className="secondary-navigation">
                        <div className="nav-element">
                          <div className="searchBox" ref={searchBoxRef}>
                            <button
                              className="searchTab"
                              aria-label="검색"
                              onClick={() => {
                                searchBoxRef.current.classList.toggle('active');
                                searchInputRef.current.focus();
                                setStartCount(0);
                              }}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="search-icon"
                                data-name="Search"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M14 11C14 14.3137 11.3137 17 8 17C4.68629 17 2 14.3137 2 11C2 7.68629 4.68629 5 8 5C11.3137 5 14 7.68629 14 11ZM14.3623 15.8506C12.9006 17.7649 10.5945 19 8 19C3.58172 19 0 15.4183 0 11C0 6.58172 3.58172 3 8 3C12.4183 3 16 6.58172 16 11C16 12.1076 15.7749 13.1626 15.368 14.1218L24.0022 19.1352L22.9979 20.8648L14.3623 15.8506Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </button>

                            <div className="searchInput">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="search-icon ltr-0 e1mhci4z1"
                                data-name="Search"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M14 11C14 14.3137 11.3137 17 8 17C4.68629 17 2 14.3137 2 11C2 7.68629 4.68629 5 8 5C11.3137 5 14 7.68629 14 11ZM14.3623 15.8506C12.9006 17.7649 10.5945 19 8 19C3.58172 19 0 15.4183 0 11C0 6.58172 3.58172 3 8 3C12.4183 3 16 6.58172 16 11C16 12.1076 15.7749 13.1626 15.368 14.1218L24.0022 19.1352L22.9979 20.8648L14.3623 15.8506Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                              <label htmlFor="searchInput" id="searchInput-label" className="visually-hidden">
                                검색
                              </label>
                              <input
                                ref={searchInputRef}
                                type="text"
                                id="searchInput"
                                name="searchInput"
                                placeholder="제목"
                                maxLength="80"
                                className="focus-visible"
                                onChange={handleInputChange}
                              />
                              <svg
                                style={{ marginRight: '5px', cursor: 'pointer' }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-x-lg"
                                viewBox="0 0 16 16"
                                onClick={inputReset}
                              >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        {/*<div className="nav-element show-kids">*/}
                        {/*    <a href="#" onClick={(e) => {e.preventDefault()}}>키즈</a>*/}
                        {/*</div>*/}
                        <div className="nav-element">
                          <span className="notifications">
                            <button
                              className="notifications-menu"
                              aria-haspopup="true"
                              aria-expanded="false"
                              aria-label="알림"
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="Hawkins-Icon Hawkins-Icon-Standard"
                                data-name="Notification"
                              >
                                <path
                                  d="M13 4.07092C16.3922 4.55624 18.9998 7.4736 18.9998 11V15.2538C20.0486 15.3307 21.0848 15.4245 22.107 15.5347L21.8926 17.5232C18.7219 17.1813 15.409 17 11.9998 17C8.59056 17 5.27764 17.1813 2.10699 17.5232L1.89258 15.5347C2.91473 15.4245 3.95095 15.3307 4.99978 15.2538V11C4.99978 7.47345 7.6076 4.55599 11 4.07086V2L13 2V4.07092ZM16.9998 15.1287V11C16.9998 8.23858 14.7612 6 11.9998 6C9.23836 6 6.99978 8.23858 6.99978 11V15.1287C8.64041 15.0437 10.3089 15 11.9998 15C13.6907 15 15.3591 15.0437 16.9998 15.1287ZM8.62568 19.3712C8.6621 20.5173 10.1509 22 11.9993 22C13.8477 22 15.3365 20.5173 15.373 19.3712C15.38 19.1489 15.1756 19 14.9531 19H9.04555C8.82308 19 8.61862 19.1489 8.62568 19.3712Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                              <div className="callout-arrow"></div>
                            </button>
                            <AlarmDropDown />
                          </span>
                        </div>
                        <div className="nav-element">
                          <div className="account-menu-item">
                            <div className="account-dropdown-button">
                              <a href="/YourAccount" role="button">
                                <span className="profile-link" role="presentation">
                                  <img
                                    className="profile-icon"
                                    src="http://occ-0-4796-993.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABcFOODvM2-dL-e5zPcoGJ_I2cdHupjSPT_Daxamtsl7X60u5tnkYULcMLms2VRWD17aovP7MknmLUszew6S2rIxrQkSy2Qg.png?r=a13"
                                    alt=""
                                  ></img>
                                  <div className="callout-arrow"></div>
                                </span>
                              </a>
                              <span className="caret" role="presentation"></span>
                            </div>
                            <AccountDropDown />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mainView" id="main-view">
                  {isSearchStart ? (
                    <MovieSearch
                      movieList={movieSearchReducer}
                      dispatch={dispatch}
                      startCount={startCount}
                      setStartCount={setStartCount}
                      inputValueRef={inputValueRef}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  ) : (
                    <MainView
                      dispatch={dispatch}
                      isSearchStart={isSearchStart}
                      setIsSearchStart={setIsSearchStart}
                      searchBoxRef={searchBoxRef}
                      searchInputRef={searchInputRef}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      startCount={startCount}
                      setStartCount={setStartCount}
                      inputValueRef={inputValueRef}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MainView(props) {
  let {
    dispatch,
    isSearchStart,
    setIsSearchStart,
    searchBoxRef,
    searchInputRef,
    isLoading,
    setIsLoading,
    startCount,
    setStartCount,
    inputValueRef
  } = props;

  const specialReducer = useSelector(state => state.specialReducer);
  const lastYearReducer = useSelector(state => state.lastYearReducer);
  const recentReleaseReducer = useSelector(state => state.recentReleaseReducer);
  const animationReducer = useSelector(state => state.animationReducer);
  const crimeReducer = useSelector(state => state.crimeReducer);
  const thrillerReducer = useSelector(state => state.thrillerReducer);
  const dramaReducer = useSelector(state => state.dramaReducer);
  const sfReducer = useSelector(state => state.sfReducer);
  const actionReducer = useSelector(state => state.actionReducer);
  const adventureReducer = useSelector(state => state.adventureReducer);
  const comedyReducer = useSelector(state => state.comedyReducer);
  const familyReducer = useSelector(state => state.familyReducer);
  const highteenReducer = useSelector(state => state.highteenReducer);
  const horrorReducer = useSelector(state => state.horrorReducer);
  const meloReducer = useSelector(state => state.meloReducer);
  const mysteryReducer = useSelector(state => state.mysteryReducer);
  const romanceReducer = useSelector(state => state.romanceReducer);
  const youthReducer = useSelector(state => state.youthReducer);

  const genreArray = window.common.getGenreJsonData(); // 장르별 영화 조회하기 위한 JsonData

  let [currentCardListCnt, setCurrentCardListCnt] = useState(0); // 지난 1년간 공개된 영화, 최근 개봉한 영화를 제외한 현재까지 조회 완료된 cardList 수
  let [specialMovieFunc, setSpecialMovieFunc] = useState();
  let [isMovieStart, setIsMovieStart] = useState(false);
  let [isReplay, setIsReplay] = useState(false);
  let [muted, setMuted] = useState(true);

  let specialMovieInit;

  let watchingMovieList = []; // 시청중인 영화 리스트
  if (window.common.isNotEmpty(localStorage.getItem('watchingMovieData'))) {
    watchingMovieList = JSON.parse(localStorage.getItem('watchingMovieData'));
  }

  useEffect(() => {
    // 영화 리스트 조회
    getSpecialMovie(dispatch);
    getLastYearMovie(dispatch);
    getRecentReleaseMovie(dispatch);
    getMovieCardList(dispatch, genreArray, currentCardListCnt, setCurrentCardListCnt, setIsLoading);

    const accessToken = sessionStorage.getItem('accessToken');
    const loginType = sessionStorage.getItem('loginType');
    if (window.common.isEmpty(accessToken) && window.common.isEmpty(loginType)) {
      location.href = '/login';
      return;
    }

    specialMovieInit = () => {
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
      // current.contains(e.target) : 컴포넌트 특정 영역 외 클릭 감지를 위해 사용
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

  const handleScroll = useCallback(() => {
    // 스크롤 시 상단 바 고정
    if (document.documentElement.scrollTop > 0) {
      document.querySelector('.pinning-header-container').style = 'background: rgb(20,20,20);';
      document.querySelector('.main-header').style = 'background-color: rgb(20,20,20);';
    } else {
      document.querySelector('.pinning-header-container').style = 'background: transparent;';
      document.querySelector('.main-header').style = '';
    }

    // 인피니티 스크롤
    // window.innerHeight : 현재 브라우저의 창 높이
    // document.documentElement.scrollTop : 현재 페이지 스크롤 위치
    // document.documentElement.scrollHeight : 전체 높이
    if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.scrollHeight - 1000) {
      if (!isLoading) {
        getMovieCardList(dispatch, genreArray, currentCardListCnt, setCurrentCardListCnt, setIsLoading);
      }
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

      {/*지난 1년간 공개된 영화*/}
      <LastYearMovie movieList={lastYearReducer} />
      {/*최근 개봉한 영화*/}
      <RecentReleaseMovie movieList={recentReleaseReducer} />
      {/*애니메이션 영화*/}
      <AnimationMovie movieList={animationReducer} />
      {/*범죄 영화*/}
      <CrimeMovie movieList={crimeReducer} />
      {/*스릴러 영화*/}
      <ThrillerMovie movieList={thrillerReducer} />
      {/*드라마 영화*/}
      <DramaMovie movieList={dramaReducer} />
      {/*SF 영화*/}
      <SFMovie movieList={sfReducer} />

      {/*액션 영화*/}
      <ActionMovie movieList={actionReducer} />
      {/*모험 영화*/}
      <AdventureMovie movieList={adventureReducer} />
      {/*코미디 영화*/}
      <ComedyMovie movieList={comedyReducer} />
      {/*가족 영화*/}
      <FamilyMovie movieList={familyReducer} />
      {/*하이틴 영화*/}
      <HighteenMovie movieList={highteenReducer} />

      {/*공포 영화*/}
      <HorrorMovie movieList={horrorReducer} />
      {/*멜로 영화*/}
      <MeloMovie movieList={meloReducer} />
      {/*미스터리 영화*/}
      <MysteryMovie movieList={mysteryReducer} />
      {/*로맨스 영화*/}
      <RomanceMovie movieList={romanceReducer} />
      {/*청춘 영화*/}
      <YouthMovie movieList={youthReducer} />
    </div>
  );
}

// 알림창 드롭다운 메뉴
const AlarmDropDown = () => {
  return (
    <div role="menu" className="sub-menu theme-lakira">
      <div className="topbar"></div>
      <ul className="sub-menu-list">
        <li className="sub-menu-item" role="none">
          <div className="ptrack-container">
            <div className="ptrack-content">
              <ul className="notifications-container">
                <li className="notification">
                  <div className="ptrack-content">
                    <div className="image-text-notification">
                      <a
                        className="element image notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <img
                          className="title-card"
                          src="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABZM9OQV_AzE2OI71hROhPiTzW5vxf_L3dsnlfmbMsrjzULHwuyG4RtW2Qu_nIvL8kWSeT7nCBMMs8uFj19vo4Q4eonw60rx6namp3lOGjYkqFbmy_E-N3V7SY88I01kkBeLzaQQhhkKbjoI.jpg?r=64b"
                          srcSet="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABZM9OQV_AzE2OI71hROhPiTzW5vxf_L3dsnlfmbMsrjzULHwuyG4RtW2Qu_nIvL8kWSeT7nCBMMs8uFj19vo4Q4eonw60rx6namp3lOGjYkqFbmy_E-N3V7SY88I01kkBeLzaQQhhkKbjoI.jpg?r=64b 112w"
                          alt="킹더랜드"
                          sizes="112px"
                        />
                      </a>
                      <a
                        className="element text notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <div className="header">신규 콘텐츠</div>
                        <div className="body">킹더랜드</div>
                        <div className="age">
                          <span className="relative-time">4일 </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </li>
                <li className="notification">
                  <div className="ptrack-content">
                    <div className="image-text-notification">
                      <a
                        className="element image notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <img
                          className="title-card"
                          src="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABTmqM34BObZYbNqmkFJABVUUqE62TARgTJaKkiJ-DDOCtljIkpimHZ6x26OpMJSo1-nrCJcwJDv7W_DvO77nUIlCqKNi9b0IMk7ztUdpj-iEAqApwlAncNeQaCGOt1ldH-4mFfwb3nPHN5M.jpg?r=869"
                          srcSet="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABTmqM34BObZYbNqmkFJABVUUqE62TARgTJaKkiJ-DDOCtljIkpimHZ6x26OpMJSo1-nrCJcwJDv7W_DvO77nUIlCqKNi9b0IMk7ztUdpj-iEAqApwlAncNeQaCGOt1ldH-4mFfwb3nPHN5M.jpg?r=869 112w"
                          alt="마당이 있는 집"
                          sizes="112px"
                        />
                      </a>
                      <a
                        className="element text notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <div className="header">신규 콘텐츠</div>
                        <div className="body">마당이 있는 집</div>
                        <div className="age">
                          <span className="relative-time">1주 전</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </li>
                <li className="notification">
                  <div className="ptrack-content">
                    <div className="image-text-notification">
                      <a
                        className="element image notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <img
                          className="title-card"
                          src="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABfAkGwOZiC9U8eqVJEI6OWevKAA0ByiiencOc7G-HcUMtFmgIQzifTAg-TmiNPkVmyFoSw9PBjqF5oZdGfbCnp4GP7ugl05VxhrGG9_jbNn_aGpsn3HSNxRPtD4nrTcvxU0q-dk-xSYh_1Q.jpg?r=3b4"
                          srcSet="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABfAkGwOZiC9U8eqVJEI6OWevKAA0ByiiencOc7G-HcUMtFmgIQzifTAg-TmiNPkVmyFoSw9PBjqF5oZdGfbCnp4GP7ugl05VxhrGG9_jbNn_aGpsn3HSNxRPtD4nrTcvxU0q-dk-xSYh_1Q.jpg?r=3b4 112w"
                          alt="이번 생도 잘 부탁해"
                          sizes="112px"
                        />
                      </a>
                      <a
                        className="element text notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <div className="header">신규 콘텐츠</div>
                        <div className="body">이번 생도 잘 부탁해</div>
                        <div className="age">
                          <span className="relative-time">1주 전</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

// account 드롭다운 메뉴
const AccountDropDown = () => {
  const doLogout = () => {
    const loginType = sessionStorage.getItem('loginType');
    switch (loginType) {
      case 'G':
        googleLogOut();
        location.href = '/login';
        break;
      case 'N':
        sessionStorage.removeItem('loginType');
        location.href = '/login';
        break;
      default:
        sessionStorage.removeItem('loginType');
        location.href = '/login';
        break;
    }
  };

  return (
    <>
      <div className="account-drop-down sub-menu theme-lakira">
        <div className="ptrack-content">
          <div className="topbar"></div>
          {/*<ul className="account-links sub-menu-list" aria-label="계정">*/}
          {/*    <li className="sub-menu-item profile-link" >*/}
          {/*        <a aria-label="프로필 관리" className="sub-menu-link sub-menu-link-icon" href="#" onClick={(e) => {e.preventDefault()}}>*/}
          {/*            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="Hawkins-Icon Hawkins-Icon-Standard" data-name="Edit">*/}
          {/*                <path d="M22.2071 7.79285L15.2071 0.792847L13.7929 2.20706L20.7929 9.20706L22.2071 7.79285ZM13.2071 3.79285C12.8166 3.40232 12.1834 3.40232 11.7929 3.79285L2.29289 13.2928C2.10536 13.4804 2 13.7347 2 14V20C2 20.5522 2.44772 21 3 21H9C9.26522 21 9.51957 20.8946 9.70711 20.7071L19.2071 11.2071C19.5976 10.8165 19.5976 10.1834 19.2071 9.79285L13.2071 3.79285ZM17.0858 10.5L8.58579 19H4V14.4142L12.5 5.91417L17.0858 10.5Z" fill="currentColor"></path>*/}
          {/*            </svg>*/}
          {/*            <span>프로필 관리</span>*/}
          {/*        </a>*/}
          {/*    </li>*/}
          {/*    <li className="sub-menu-item">*/}
          {/*        <a className="sub-menu-link sub-menu-link-icon" href="#" onClick={(e) => {e.preventDefault()}}>*/}
          {/*            <svg id="profile-transfer" width="24" height="24" viewBox="0 0 24 24" fill="none">*/}
          {/*                <path d="M6 1C3.79086 1 2 2.79086 2 5V17C2 19.2091 3.79086 21 6 21H9.58579L8.29289 22.2929L9.70711 23.7071L12.7071 20.7071C13.0976 20.3166 13.0976 19.6834 12.7071 19.2929L9.70711 16.2929L8.29289 17.7071L9.58579 19H6C4.89543 19 4 18.1046 4 17V5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V17C20 18.1046 19.1046 19 18 19H15V21H18C20.2091 21 22 19.2091 22 17V5C22 2.79086 20.2091 1 18 1H6ZM7.5 10C8.32843 10 9 9.32843 9 8.5C9 7.67157 8.32843 7 7.5 7C6.67157 7 6 7.67157 6 8.5C6 9.32843 6.67157 10 7.5 10ZM18 8.5C18 9.32843 17.3284 10 16.5 10C15.6716 10 15 9.32843 15 8.5C15 7.67157 15.6716 7 16.5 7C17.3284 7 18 7.67157 18 8.5ZM16.402 12.1985C15.7973 12.6498 14.7579 13 13.5 13C12.2421 13 11.2027 12.6498 10.598 12.1985L9.40195 13.8015C10.4298 14.5684 11.9192 15 13.5 15C15.0808 15 16.5702 14.5684 17.598 13.8015L16.402 12.1985Z" fill="currentColor"></path>*/}
          {/*            </svg>*/}
          {/*            <span>프로필 이전</span>*/}
          {/*        </a>*/}
          {/*    </li>*/}
          {/*    <li className="sub-menu-item">*/}
          {/*        <a className="sub-menu-link sub-menu-link-icon" href="#" onClick={(e) => {e.preventDefault()}}>*/}
          {/*            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="Hawkins-Icon Hawkins-Icon-Standard" data-name="User">*/}
          {/*                <path d="M9.00011 8C9.00011 6.34315 10.3433 5 12.0001 5C13.657 5 15.0001 6.34315 15.0001 8C15.0001 9.65685 13.657 11 12.0001 11C10.3433 11 9.00011 9.65685 9.00011 8ZM12.0001 3C9.23869 3 7.00011 5.23858 7.00011 8C7.00011 10.7614 9.23869 13 12.0001 13C14.7615 13 17.0001 10.7614 17.0001 8C17.0001 5.23858 14.7615 3 12.0001 3ZM5.98069 21.1961C6.46867 18.7563 8.61095 17 11.0991 17H12.9011C15.3893 17 17.5316 18.7563 18.0195 21.1961L19.9807 20.8039C19.3057 17.4292 16.3426 15 12.9011 15H11.0991C7.65759 15 4.69447 17.4292 4.01953 20.8039L5.98069 21.1961Z" fill="currentColor"></path>*/}
          {/*            </svg>*/}
          {/*            <span>계정</span>*/}
          {/*        </a>*/}
          {/*    </li>*/}
          {/*    <li className="sub-menu-item">*/}
          {/*        <a className="sub-menu-link sub-menu-link-icon" href="#" onClick={(e) => {e.preventDefault()}}>*/}
          {/*            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="Hawkins-Icon Hawkins-Icon-Standard" data-name="Question">*/}
          {/*                <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12ZM12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM12 8.5C10.6831 8.5 10 9.24303 10 10H8C8 7.75697 10.0032 6.5 12 6.5C13.9968 6.5 16 7.75697 16 10C16 11.3487 14.9191 12.2679 13.8217 12.68C13.5572 12.7793 13.3322 12.9295 13.1858 13.0913C13.0452 13.2467 13 13.383 13 13.5V14H11V13.5C11 12.0649 12.1677 11.1647 13.1186 10.8076C13.8476 10.5339 14 10.1482 14 10C14 9.24303 13.3169 8.5 12 8.5ZM13.5 16.5C13.5 17.3284 12.8284 18 12 18C11.1716 18 10.5 17.3284 10.5 16.5C10.5 15.6716 11.1716 15 12 15C12.8284 15 13.5 15.6716 13.5 16.5Z" fill="currentColor"></path>*/}
          {/*            </svg>*/}
          {/*            <span>고객 센터</span>*/}
          {/*        </a>*/}
          {/*    </li>*/}
          {/*</ul>*/}
          <ul className="sub-menu-list sign-out-links">
            <li className="sub-menu-item">
              <a className="sub-menu-link" onClick={doLogout}>
                J MOVIE에서 로그아웃
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

// 장르별 영화 카드 리스트 조회
function getMovieCardList(dispatch, genreArray, currentCardListCnt, setCurrentCardListCnt, setIsLoading) {
  if (currentCardListCnt < genreArray.length) {
    let count = 0;
    for (let i = currentCardListCnt; i < genreArray.length; i++) {
      count++;
      const data = genreArray[i];
      getGenreMovie(dispatch, data.genre, data.setReducerFunc, count, setIsLoading);
      if (count == maxCardListCnt) {
        setCurrentCardListCnt(currentCardListCnt + count);
        break;
      }

      if (i + 1 == genreArray.length) {
        setCurrentCardListCnt(currentCardListCnt + count);
      }
    }
  }
}

export default Browse;
