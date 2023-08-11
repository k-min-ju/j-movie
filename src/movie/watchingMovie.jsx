import React, {useState} from "react";
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

function WatchingMovie(props) {
    if(props.movieList.length == 0) return;
    let [movieList, setMovieList] = useState([...props.movieList]);
    let [isVisible, setIsVisible] = useState(true);

    return (
        <div>
            {
                isVisible ? <Watching movieList={movieList} setMovieList={setMovieList} setIsVisible={setIsVisible} /> : null
            }
        </div>
    );
}

function Watching(props) {
    let {movieList, setMovieList, setIsVisible} = props;

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '"></span>';
        },
    };

    const removeWatchingMovie = (index) => {
        const updatedMovieList = movieList.filter((item, i) => i !== index);
        setMovieList(updatedMovieList);
        if(updatedMovieList.length < 1) {
            setIsVisible(false);
        }else {
            setIsVisible(true);
        }
    };

    const movieJsonData = window.common.getMovieJsonData();

    return (
        <div className="lolomoRow lolomoRow_title_card ltr-0" data-list-context="newRelease">
            <h2 className="rowTitle ltr-0">시청중인 영화</h2>
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
                                                let movieVal;
                                                let isDuplicate = false;
                                                let existingData;
                                                if(window.common.isNotEmpty(localStorage.getItem('watchingMovieData'))) {
                                                    existingData = JSON.parse(localStorage.getItem('watchingMovieData'));
                                                    existingData = existingData.find((movie => {
                                                        if(movie.DOCID == item.DOCID) {
                                                            isDuplicate = true;
                                                            return movie;
                                                        }
                                                    }));
                                                }
                                                if(isDuplicate) {
                                                    movieVal = existingData.movieVal;
                                                }
                                                else {
                                                    movieVal = `${movieJsonData[Math.floor(Math.random() * 28)].movieVal}`;
                                                }
                                                return (
                                                    <SwiperSlide key={index}>
                                                        <div className={'slider-item slider-item-' + index} style={{width: '100%'}}>
                                                            <div className={'title-card-container ltr-' + index}>
                                                                <div id={'title-card-1-' + index} className="title-card">
                                                                    <div className="ptrack-content watching-card">
                                                                        <div className="boxart-size-16x9 boxart-container boxart-rounded" style={{height: '170px'}}>
                                                                            <a href={`watch/${item.movieId}/${item.movieSeq}/${movieVal}`} role="link" aria-label={item.title} tabIndex="0" aria-hidden="false" className="slider-refocus">
                                                                                <img className="boxart-image boxart-image-in-padded-container" style={{height: '100%'}} src={
                                                                                    item.posters.split("|")[0]
                                                                                } alt="" />
                                                                            </a>
                                                                            <div className="watching-card-close" onClick={() => {
                                                                                const docId = item.movieId + item.movieSeq;
                                                                                removeWatchingMovie(index);
                                                                                window.common.removeWatchingData(docId);
                                                                            }}>
                                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ltr-0 e1mhci4z1" data-uia="previewModal-closebtn" role="button" aria-label="close" tabIndex="0">
                                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.5858 12L2.29291 3.70706L3.70712 2.29285L12 10.5857L20.2929 2.29285L21.7071 3.70706L13.4142 12L21.7071 20.2928L20.2929 21.7071L12 13.4142L3.70712 21.7071L2.29291 20.2928L10.5858 12Z" fill="currentColor"></path>
                                                                                </svg>
                                                                            </div>
                                                                            <div className="fallback-text-container" aria-hidden="true">
                                                                                <p className="fallback-text">{item.title}</p>
                                                                            </div>
                                                                        </div>
                                                                        {/*</a>*/}
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
    )
}

export default React.memo(WatchingMovie);