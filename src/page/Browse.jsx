import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { movieSearchReducer } from '@/reducer';
import { KMDBMovieAPI } from '@/components/movie/common';
import { MainView, MovieSearch } from '@/components/movie';
import { AccountDropDown, AlarmDropDown } from '@/components/dropDown';
import { Close, Notification, Search } from '@/components/icon';
import '@/style/browse.css';

function Browse() {
  const dispatch = useDispatch();
  const { getSearchMovie } = KMDBMovieAPI();

  const [isSearchStart, setIsSearchStart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startCount, setStartCount] = useState(0);

  const searchBoxRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceFunctionRef = useRef(null);
  const inputValueRef = useRef(null);

  const movieSearchReducerList = useSelector(state => state.movieSearchReducer);

  // 디바운스 함수 정의
  const debounce = (func, delay) => {
    let timer;
    return function (inputValue) {
      clearTimeout(timer);
      timer = setTimeout(() => func(inputValue), delay);
    };
  };

  // 검색 요청 함수
  const fetchSearchResults = async inputValue => {
    window.scrollTo({ top: 0 });
    dispatch(movieSearchReducer.actions.setMovieSearchList([]));
    await getSearchMovie(
      dispatch,
      startCount,
      setStartCount,
      inputValue,
      100,
      movieSearchReducer.actions.setMovieSearchList,
      setIsLoading
    );
  };

  // 디바운스를 적용한 핸들러
  const handleInputChange = event => {
    const inputValue = event.target.value;
    setIsSearchStart(inputValue.trim().length > 0);
    if (inputValue.trim().length < 1) {
      dispatch(movieSearchReducer.actions.setMovieSearchList([]));
    }
    inputValueRef.current = inputValue;

    if (!debounceFunctionRef.current) {
      debounceFunctionRef.current = debounce(async () => {
        await fetchSearchResults(inputValueRef.current);
      }, 500);
    }

    debounceFunctionRef.current();
  };

  const inputReset = () => {
    searchInputRef.current.value = '';
    searchBoxRef.current.classList.remove('active');
    setIsSearchStart(false);
    setStartCount(0);
    dispatch(movieSearchReducer.actions.setMovieSearchList([]));
  };

  return (
    <>
      <div>
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
                        <img
                          className="logo icon-logoUpdate active"
                          src={process.env.PUBLIC_URL + '/mainLogo.png'}
                          alt="mainLogo"
                        />
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
                              <Search style={{ marginTop: '6px' }} />
                            </button>

                            <div className="searchInput">
                              <Search style={{ cursor: 'pointer' }} />
                              <label htmlFor="searchInput" className="visually-hidden">
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
                              <Close clickFunction={inputReset} />
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
                              <Notification />
                              <div className="callout-arrow" />
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

                <div className="mainView">
                  {isSearchStart ? (
                    <MovieSearch
                      movieList={movieSearchReducerList}
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

export default Browse;
