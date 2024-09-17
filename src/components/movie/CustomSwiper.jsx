import React from 'react';
import { Swiper } from 'swiper/react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
import { SLIDERS_PER_COUNTS } from '@/configs/constants';

export default function CustomSwiper({ movieTitle, children }) {
  return (
    <div className="lolomoRow lolomoRow_title_card ltr-0" data-list-context="newRelease">
      <h2 className="rowTitle ltr-0">{movieTitle}</h2>
      <div className="rowContainer rowContainer_title_card">
        <div className="ptrack-container">
          <div className="rowContent slider-hover-trigger-layer">
            <div className="slider">
              <div className="sliderMask showPeek">
                <div className="sliderContent row-with-x-columns">
                  <Swiper
                    style={{ '--swiper-pagination-bullet-inactive-opacity': '1' }}
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    navigation
                    spaceBetween={10}
                    speed={750}
                    loop={true}
                    pagination={{
                      clickable: true,
                      renderBullet: function (index, className) {
                        return '<span class="' + className + '"></span>';
                      }
                    }}
                    onSlideChange={swiper => {
                      swiper.update();
                    }}
                    onSlideChangeTransitionEnd={swiper => {
                      const element = swiper.el;
                      // 이전 버튼 활성화
                      element.childNodes[1].style = 'display: flex !important;';
                    }}
                    breakpoints={{
                      1378: {
                        slidesPerView: SLIDERS_PER_COUNTS[0],
                        slidesPerGroup: SLIDERS_PER_COUNTS[0]
                      },
                      998: {
                        slidesPerView: SLIDERS_PER_COUNTS[1],
                        slidesPerGroup: SLIDERS_PER_COUNTS[1]
                      },
                      625: {
                        slidesPerView: SLIDERS_PER_COUNTS[2],
                        slidesPerGroup: SLIDERS_PER_COUNTS[2]
                      },
                      0: {
                        slidesPerView: SLIDERS_PER_COUNTS[3],
                        slidesPerGroup: SLIDERS_PER_COUNTS[3]
                      }
                    }}
                  >
                    {children}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
