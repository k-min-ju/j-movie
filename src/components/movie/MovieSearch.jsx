import React, { useCallback, useEffect } from 'react';
import { addMovieSearchList } from '@/reducer/movieSearchReducer.js';
import { getSearchMovie } from '@/components/movie/common';
import { getMovieJsonData, getMovieVal, setWatchingMovieData } from '@/common';

function MovieSearch(props) {
  if (props.movieList.length === 0) return;
  let { dispatch, startCount, setStartCount, inputValueRef, isLoading, setIsLoading } = props;
  let movieList = [...props.movieList];

  const movieJsonData = getMovieJsonData();

  const handleScrollSearch = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop > document.documentElement.scrollHeight - 1500) {
      if (!isLoading) {
        getSearchMovie(
          dispatch,
          startCount,
          setStartCount,
          inputValueRef.current,
          40,
          addMovieSearchList,
          setIsLoading
        );
      }
    }
  }, [startCount]);

  useEffect(() => {
    // 스크롤 감지
    window.addEventListener('scroll', handleScrollSearch);

    return () => {
      window.removeEventListener('scroll', handleScrollSearch);
    };
  }, [handleScrollSearch]);

  return (
    <>
      <div data-uia="search-page" className="ltr-14o8fj0">
        <div className="ltr-m94oj6">
          <div>
            <div data-uia="search-video-gallery" className="ltr-gncw81">
              {movieList.map((item, index) => {
                const movieVal = getMovieVal(`${movieJsonData[Math.floor(Math.random() * 28)].movieVal}`, item.DOCID);
                return (
                  <div data-uia="search-video-gallery-item" className="ltr-1cjyscz" key={index}>
                    <div className="title-card-container">
                      <div id="title-card-0-0" className="title-card">
                        <div className="ptrack-content">
                          <a
                            href={`watch/${item.movieId}/${item.movieSeq}/${movieVal}`}
                            role="link"
                            aria-label={item.title}
                            aria-hidden="false"
                            className="slider-refocus"
                          >
                            <div
                              className="boxart-size-16x9 boxart-container boxart-rounded"
                              style={{ height: '170px' }}
                            >
                              <img
                                className="boxart-image boxart-image-in-padded-container"
                                style={{ height: '100%' }}
                                src={item.posters.split('|')[0]}
                                alt=""
                                onClick={() => {
                                  setWatchingMovieData(item, movieVal);
                                }}
                              />
                              <div className="fallback-text-container" aria-hidden="true">
                                <p className="fallback-text">{item.title}</p>
                              </div>
                            </div>
                          </a>
                        </div>
                        <div className="bob-container"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(MovieSearch);
