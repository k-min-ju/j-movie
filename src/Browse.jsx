import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MainView, MovieSearch } from '@/components/movie';
import { KMDBMovieAPI } from '@/components/movie/common';
import { movieSearchReducer } from '@/reducer';
import { AccountDropDown, AlarmDropDown } from '@/components/dropDown';
import './Browse.css';

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
    dispatch(movieSearchReducer.actions.setMovieSearchList([]));
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
