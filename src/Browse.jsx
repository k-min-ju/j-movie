import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GenreMovieCarousel, MovieSearch, SpecialMovie, WatchingMovie } from '@/components/index';
import {
  getGenreMovie,
  getLastYearMovie,
  getRecentReleaseMovie,
  getSearchMovie,
  getSpecialMovie,
  specialMoviePlay
} from '@/components/movie/common';
import { setMovieSearchList } from '@/reducer/movieSearchReducer.js';
import { getGenreJsonData, googleLogOut, isEmpty, isNotEmpty } from '@/common';
import './Browse.css';

const maxCardListCnt = 5; // 지난 1년간 공개된 영화, 최근 개봉한 영화를 제외한 영화 카드 리스트 개수

function Browse() {
  const dispatch = useDispatch();

  const [isSearchStart, setIsSearchStart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startCount, setStartCount] = useState(0);

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
                        <li className="navigation-tab">
                          <a className="current active" href="/browse">
                            홈
                          </a>
                        </li>
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
                      searchBoxRef={searchBoxRef}
                      searchInputRef={searchInputRef}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
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
  const { dispatch, searchBoxRef, searchInputRef, isLoading, setIsLoading } = props;

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
  if (isNotEmpty(localStorage.getItem('watchingMovieData'))) {
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
    if (isEmpty(accessToken) && isEmpty(loginType)) {
      location.href = '/login';
      return;
    }

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
    if (
      window.innerHeight + document.documentElement.scrollTop > document.documentElement.scrollHeight - 1000 &&
      !isLoading
    ) {
      getMovieCardList(dispatch, genreArray, currentCardListCnt, setCurrentCardListCnt, setIsLoading);
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

export default Browse;
