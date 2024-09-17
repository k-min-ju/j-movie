import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { SwiperSlide } from 'swiper/react';
import { getMovieJsonData } from '@/common';
import { getMovieVal, setWatchingMovieData } from '@/components/movie/common';
import { CustomSwiper } from '@/components/movie';

function GenreMovieCarousel({ genreTitle, movieList }) {
  if (movieList.length === 0) return;
  const movieJsonData = getMovieJsonData();
  return (
    <div>
      <CustomSwiper movieTitle={genreTitle}>
        {movieList.map((item, index) => {
          const movieVal = getMovieVal(`${movieJsonData[Math.floor(Math.random() * 28)].movieVal}`, item.DOCID);
          return (
            <SwiperSlide key={index}>
              <div className={'slider-item slider-item-' + index} style={{ width: '100%' }}>
                <div className={'title-card-container ltr-' + index}>
                  <div className="title-card">
                    <div className="ptrack-content">
                      <a
                        href={`watch/${item.movieId}/${item.movieSeq}/${movieVal}`}
                        role="link"
                        aria-label={item.title}
                        tabIndex="0"
                        aria-hidden="false"
                        className="slider-refocus"
                      >
                        <div className="boxart-size-16x9 boxart-container boxart-rounded" style={{ height: '170px' }}>
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
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </CustomSwiper>
    </div>
  );
}

export default React.memo(GenreMovieCarousel);
