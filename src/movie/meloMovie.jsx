import React from "react";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

let slidesPer1 = 7;
let slidesPer2 = 5;
let slidesPer3 = 4;
let slidesPer4 = 3;

function MeloMovie(props) {
    if(props.movieList.length == 0) return;
    let movieList = [...props.movieList];

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '"></span>';
        },
    };

    const movieJsonData = window.common.getMovieJsonData();

    return (
        <div>
            <div className="lolomoRow lolomoRow_title_card ltr-0" data-list-context="newRelease">
                <h2 className="rowTitle ltr-0">멜로 영화</h2>
                <div className="rowContainer rowContainer_title_card" id="row-1">
                    <div className="ptrack-container">
                        <div className="rowContent slider-hover-trigger-layer">
                                <div className="slider">
                                    <div className="sliderMask showPeek">
                                        <div className="sliderContent row-with-x-columns">
                                            <Swiper style={{'--swiper-pagination-bullet-inactive-opacity': '1'}}
                                                modules={[Navigation, Pagination, Scrollbar, A11y]}
                                                navigation
                                                spaceBetween={10}
                                                speed={750}
                                                loop={true}
                                                pagination={pagination}
                                                onSlideChange={(swiper) => {
                                                    swiper.update();
                                                }}
                                                onSlideChangeTransitionEnd={(swiper) => {
                                                    const element = swiper.el;
                                                    // 이전 버튼 활성화
                                                    element.childNodes[1].style = 'display: flex !important;';
                                                }}
                                                breakpoints={{
                                                    1378: {
                                                        slidesPerView: slidesPer1,
                                                        slidesPerGroup: slidesPer1,
                                                    },
                                                    998: {
                                                        slidesPerView: slidesPer2,
                                                        slidesPerGroup: slidesPer2,
                                                    },
                                                    625: {
                                                        slidesPerView: slidesPer3,
                                                        slidesPerGroup: slidesPer3,
                                                    },
                                                    0: {
                                                        slidesPerView: slidesPer4,
                                                        slidesPerGroup: slidesPer4,
                                                    }
                                                }}
                                            >
                                            {
                                                movieList.map((item, index) => {
                                                    const movieVal = window.common.getMovieVal(`${movieJsonData[Math.floor(Math.random() * 28)].movieVal}`, item.DOCID);
                                                    return (
                                                        <SwiperSlide key={index}>
                                                            <div className={'slider-item slider-item-' + index} style={{width: '100%'}}>
                                                                <div className={'title-card-container ltr-' + index}>
                                                                    <div id={'title-card-1-' + index} className="title-card">
                                                                        <div className="ptrack-content" data-ui-tracking-context="" data-tracking-uuid="">
                                                                            <a href={`watch/${item.movieId}/${item.movieSeq}/${movieVal}`} role="link" aria-label={item.title} tabIndex="0" aria-hidden="false" className="slider-refocus">
                                                                                <div className="boxart-size-16x9 boxart-container boxart-rounded" style={{height: '170px'}}>
                                                                                    <img className="boxart-image boxart-image-in-padded-container" style={{height: '100%'}} src={
                                                                                        item.posters.split("|")[0]
                                                                                    } alt=""
                                                                                     onClick={() => {
                                                                                         window.common.setWatchingMovieData(item, movieVal);
                                                                                     }} />
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
                                                    )
                                                })
                                            }
                                            </Swiper>
                                        </div>
                                    </div>
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(MeloMovie);