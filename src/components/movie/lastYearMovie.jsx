import React from 'react';
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

function LastYearMovie(props) {
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
                <h2 className="rowTitle ltr-0">지난 1년간 공개된 영화
                    {/*<a className="rowTitle ltr-0" href="/browse/m/new-release">*/}
                    {/*    <div className="row-header-title">지난 1년간 공개된 콘텐츠</div>*/}
                    {/*    <div className="aro-row-header more-visible">*/}
                    {/*        <div className="see-all-link">모두 보기</div>*/}
                    {/*        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi-chevron-right" viewBox="0 0 16 16">*/}
                    {/*            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"></path>*/}
                    {/*        </svg>*/}
                    {/*    </div>*/}
                    {/*</a>*/}
                </h2>
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

                                    {/*<span className="handle handleNext active" tabIndex="0" role="button" aria-label="콘텐츠 더 보기">*/}
                                    {/*    <b className="indicator-icon icon-rightCaret" onClick={() => {*/}

                                    {/*    }}>*/}
                                    {/*        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">*/}
                                    {/*          <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>*/}
                                    {/*        </svg>*/}
                                    {/*    </b>*/}
                                    {/*</span>*/}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(LastYearMovie);