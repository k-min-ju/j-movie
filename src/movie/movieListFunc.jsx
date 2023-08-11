// KMDb에 영화 리스트 요청
import axios from "axios";
import {setSpecialList} from "../reducer/specialReducer.js";
import {setLastYearList} from "../reducer/lastYearReducer.js";
import {setRecentReleaseList} from "../reducer/recentReleaseReducer.js";

const movieListCount = 60;

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
    date.setFullYear(date.getFullYear()-1);
    const searchParam = {
        ServiceKey: process.env.REACT_APP_KMDB_API_KEY,
        collection: 'kmdb_new2',
        detail: 'Y',
        sort: 'prodYear,0',
        releaseDts: window.common.getDate(date),
        releaseDte: window.common.getDate(),
        ratedYn: 'Y',
        listCount: movieListCount
    };
    getKMDbMovieList(searchParam, dispatch, setLastYearList);
}

// 최근 개봉한 영화 리스트
export function getRecentReleaseMovie(dispatch) {
    let date = new Date();
    date.setMonth(date.getMonth()-1);
    const searchParam = {
        ServiceKey: process.env.REACT_APP_KMDB_API_KEY,
        collection: 'kmdb_new2',
        detail: 'Y',
        sort: 'prodYear,1',
        releaseDts: window.common.getDate(date),
        releaseDte: window.common.getDate(),
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
    console.log("startCount11111111111111111111="+startCount)
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
    if(window.common.isNotEmpty(searchParam)) {
        const movieSearch = axios.create({
            baseURL: process.env.REACT_APP_KMDB_API_URL,
            timeout: 10000
        });
        const getMovieList = (params) => {
            return movieSearch.get("/openapi-data2/wisenut/search_api/search_json2.jsp", {params})
                .catch((err) => {
                    console.log("error="+err);
                    return Promise.reject(err);
                })
                .then((res) => {
                    if(window.common.isEmpty(res)) return;

                    let movieInfo = res.data.Data[0].Result;
                    if(movieInfo) {
                        movieInfo = movieInfo.filter((item) => window.common.isNotEmpty(item.posters));
                        dispatch(setDataFunction(movieInfo));
                    }
                });
        }
        await getMovieList(searchParam);
    }
}

async function getMovieListInfinityScroll(searchParam, dispatch, setDataFunction, count, setIsLoading) {
    if(window.common.isNotEmpty(searchParam)) {
        const movieSearch = axios.create({
            baseURL: process.env.REACT_APP_KMDB_API_URL,
            timeout: 10000
        });
        const getMovieList = (params) => {
            setIsLoading(true);
            return movieSearch.get("/openapi-data2/wisenut/search_api/search_json2.jsp", {params})
                .catch((err) => {
                    console.log("error="+err);
                    return Promise.reject(err);
                })
                .then((res) => {
                    if(window.common.isEmpty(res)) return;

                    let movieInfo = res.data.Data[0].Result;
                    if(movieInfo) {
                        movieInfo = movieInfo.filter((item) => window.common.isNotEmpty(item.posters));
                        dispatch(setDataFunction(movieInfo));
                    }

                    if(count == 5) {
                        setIsLoading(false);
                    }
                });
        }
        await getMovieList(searchParam);
    }
}

async function getSearchMovieList(searchParam, dispatch, setDataFunction, startCount, setStartCount, listCount, setIsLoading) {
    if(window.common.isNotEmpty(searchParam)) {
        const movieSearch = axios.create({
            baseURL: process.env.REACT_APP_KMDB_API_URL,
            timeout: 10000
        });
        const getMovieList = (params) => {
            setIsLoading(true);
            return movieSearch.get("/openapi-data2/wisenut/search_api/search_json2.jsp", {params})
                .catch((err) => {
                    console.log("error="+err);
                    return Promise.reject(err);
                })
                .then((res) => {
                    if(window.common.isEmpty(res)) return;

                    let movieInfo = res.data.Data[0].Result;
                    if(movieInfo) {
                        movieInfo = movieInfo.filter((item) => window.common.isNotEmpty(item.posters));
                        setStartCount(startCount+listCount);
                        dispatch(setDataFunction(movieInfo));
                        setIsLoading(false);
                    }
                });
        }
        await getMovieList(searchParam);
    }
}

async function getKMDbMovieOne(searchParam) {
    let movieInfo;
    if(window.common.isNotEmpty(searchParam)) {
        const movieSearch = axios.create({
            baseURL: process.env.REACT_APP_KMDB_API_URL,
            timeout: 10000
        });
        const getMovie = (params) => {
            return movieSearch.get("/openapi-data2/wisenut/search_api/search_json2.jsp", {params})
                .catch((err) => {
                    console.log("error="+err);
                    return Promise.reject(err);
                })
                .then((res) => {
                    if(window.common.isEmpty(res)) return;

                    movieInfo = res.data.Data[0].Result;
                });
        }
        await getMovie(searchParam);
    }

    return movieInfo;
}