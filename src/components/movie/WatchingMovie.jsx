import React, { useState } from 'react';
import { SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Remove from '../icon/Remove';
import { getMovieJsonData } from '@/common';
import { removeWatchingData } from '@/components/movie/common';
import { CustomSwiper } from '@/components/movie';

function WatchingMovie(props) {
  if (props.movieList.length === 0) return;
  const [movieList, setMovieList] = useState([...props.movieList]);
  const [isVisible, setIsVisible] = useState(true);

  const removeWatchingMovie = index => {
    const updatedMovieList = movieList.filter((item, i) => i !== index);
    setMovieList(updatedMovieList);
    if (updatedMovieList.length < 1) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  const movieJsonData = getMovieJsonData();

  return (
    <>
      {isVisible ? (
        <CustomSwiper movieTitle="시청중인 영화">
          {movieList.map((item, index) => {
            let movieVal = `${movieJsonData[Math.floor(Math.random() * 28)].movieVal}`;
            if (localStorage.getItem('watchingMovieData')) {
              const existingData = JSON.parse(localStorage.getItem('watchingMovieData')).find(
                movie => movie.DOCID === item.DOCID
              );
              if (existingData) movieVal = existingData.movieVal;
            }
            return (
              <SwiperSlide key={index} className="zxczxc">
                <div className={'slider-item slider-item-' + index} style={{ width: '100%' }}>
                  <div className={'title-card-container ltr-' + index}>
                    <div className="title-card">
                      <div className="ptrack-content watching-card">
                        <div className="boxart-size-16x9 boxart-container boxart-rounded" style={{ height: '170px' }}>
                          <a
                            href={`watch/${item.movieId}/${item.movieSeq}/${movieVal}`}
                            role="link"
                            aria-label={item.title}
                            tabIndex="0"
                            aria-hidden="false"
                            className="slider-refocus"
                          >
                            <img
                              className="boxart-image boxart-image-in-padded-container"
                              style={{ height: '100%' }}
                              src={item.posters.split('|')[0]}
                              alt=""
                            />
                          </a>
                          <div
                            className="watching-card-close"
                            onClick={() => {
                              const docId = item.movieId + item.movieSeq;
                              removeWatchingMovie(index);
                              if (docId) removeWatchingData(docId);
                            }}
                          >
                            <Remove />
                          </div>
                          <div className="fallback-text-container" aria-hidden="true">
                            <p className="fallback-text">{item.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </CustomSwiper>
      ) : null}
    </>
  );
}

export default React.memo(WatchingMovie);
