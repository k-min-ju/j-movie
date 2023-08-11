import React from 'react';

function SpecialMovie(props) {
    if(props.movieList.length == 0) return;
    let movieList = [...props.movieList];
    let movie = movieList[0];

    const muteBtnClick = () => {
        const movie = document.getElementById("specialMovie");
        if(props.muted == true) {
            movie.muted = false;
            props.setMuted(false);
            localStorage.setItem('specialMovieMuted', "OFF");
        }
        else {
            movie.muted = true;
            props.setMuted(true);
            localStorage.setItem('specialMovieMuted', "ON");
        }
    }

    const movieEnded = () => {
        props.setIsMovieStart(false);
        props.setIsReplay(true);
        let element = document.querySelector('.trailer-billboard');
        element.classList.toggle('video-playing')
        element.children[0].classList.toggle('dismiss-static', 'dismiss-mask');
    }

    return(
        <div>
            <span className="volatile-billboard-animations-container">
                <div className="billboard-row" role="region" aria-label="특별 소개 콘텐츠">
                    <div className="ptrack-container billboard-presentation-tracking">
                        <div className="billboard-presentation-tracking ptrack-content">
                            <div className="billboard-presentation-tracking ptrack-content">
                                <div className="billboard billboard-pane billboard-originals trailer-billboard">
                                    <div className="billboard-motion">
                                        <div className="nfp nf-player-container notranslate NFPlayer" tabIndex="-1">
                                            <div className="VideoContainer VideoContainer--use-element-dimensions" aria-hidden="true" role="presentation" data-uia="player" data-videoid="81636983" style={{height: '100%'}}>
                                                <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
                                                    <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
                                                        <video id="specialMovie" muted playsInline ref={props.specialMovieFunc} style={{height: '100%'}} onEnded={movieEnded}>
                                                            <source src="https://www.kmdb.or.kr/trailer/play/MK059186_P02.mp4" type="video/mp4" />
                                                        </video>
                                                        <div className="player-timedtext" style={{display: 'none', direction: 'ltr'}}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="nfp-aspect-wrapper">
                                                <div className="nfp-aspect-container">
                                                    <div className="nfp-aspect-inner" style={{paddingTop: '56.25%'}}></div>
                                                    <div className="image-based-timed-text" style={{position: 'absolute', inset: '0px 0px 242.993px', transform: 'translateZ(0px)'}}>
                                                        <svg width="100%" height="100%" style={{position: 'absolute', inset: '0px'}} viewBox="0 0 1280 720">
                                                            {/*<image xlinkHref="blob:https://www.netflix.com/4acf31b9-76ec-45ff-b4e8-c06c685ddb6f" width="419" height="54" x="431" y="71" data-id="69222" />*/}
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="PlayerControlsNeo__layout PlayerControlsNeo__layout--inactive">
                                                <div className="PlayerControlsNeo__all-controls PlayerControlsNeo__all-controls--low-power">
                                                    <div className="PlayerControlsNeo__gradient-top"></div>
                                                    <div className="PlayerControlsNeo__gradient-bottom"></div>
                                                    <div className="PlayerControlsNeo__core-controls">
                                                        <div data-uia="nfplayer-bottom-controls" className="PlayerControlsNeo__bottom-controls PlayerControlsNeo__bottom-controls--faded">
                                                            <div className="PlayerControlsNeo__progress-control-row PlayerControlsNeo__progress-control-row--row-standard">
                                                                <div className="PlayerControlsNeo__progress-container"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="motion-background-component bottom-layer full-screen">
                                            <div className="hero-image-wrapper">
                                                <img className="hero static-image image-layer" src="http://occ-0-993-2218.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABXjKQ0Fm3w9S41URw4bNFQtdZmm_o_PyhPyjiUza5gEPkXOgcq35Awo_jGDb5jW-Zxlepc_b_CtPjF66yLGUrbXemqfPaXjD7C3y.webp?r=5ee" alt="" />
                                                {/*<img className="hero static-image image-layer" src="http://occ-0-993-2218.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABXjKQ0Fm3w9S41URw4bNFQtdZmm_o_PyhPyjiUza5gEPkXOgcq35Awo_jGDb5jW-Zxlepc_b_CtPjF66yLGUrbXemqfPaXjD7C3y.webp?r=5ee" alt="" />*/}
                                                <div className="trailer-vignette vignette-layer"></div>
                                                <div className="hero-vignette vignette-layer"></div>
                                                <div className="embedded-components button-layer"></div>
                                            </div>
                                            <div className="embedded-components button-layer">
                                                <span className="ActionButtons">
                                                    {
                                                        props.isMovieStart ? <MuteBtn muted={props.muted} muteBtnClick={muteBtnClick} />: props.isReplay
                                                                           ? <Replay setMuted={props.setMuted} setIsMovieStart={props.setIsMovieStart} setIsReplay={props.setIsReplay} /> : null
                                                    }
                                                </span>
                                                <span className="maturity-rating ">
                                                    <span className="maturity-graphic">
                                                        <svg id="maturity-rating-977" viewBox="0 0 100 100" className="svg-icon svg-icon-maturity-rating-977 ">
                                                            <RatingViewer rating={movie.rating}/>
                                                        </svg>
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fill-container">
                                        <div className="info meta-layer">
                                            <div className="logo-and-text meta-layer">
                                                <div className="titleWrapper">
                                                    <div className="billboard-title">
                                                        <img alt="Queen Cleopatra" className="title-logo" src="http://occ-0-993-2218.1.nflxso.net/dnm/api/v6/LmEnxtiAuzezXBjYXPuDgfZ4zZQ/AAAABRZySGZnShksIyikzJJvzCOEGOzb315hxl8vGI7F0_IE1sVAD4FPtJHeJLrc_EctoJK6LaP07sImaw_4Lk3M8Y5xua2c-axx6SLC-U5XSfth-qMYwKWx2y8uIJ6UvGMQoEbG_dNPMtrAXk8gAQ_3FPcY9blFbK_9t9f4Lhto4faN8Es8i_nG9A.webp?r=4cb" title="Queen Cleopatra" />
                                                    </div>
                                                </div>
                                                <div className="info-wrapper">
                                                    <div className="info-wrapper-fade">
                                                        <div className="episode-title-container"></div>
                                                        <div className="synopsis-fade-container">
                                                            <div className="synopsis no-supplemental">
                                                                <div className="ptrack-content plotText">이집트의 마지막 파라오 클레오파트라. 왕좌와 가족, 그리고 왕조의 유산을 지키기 위해 싸웠던 그녀의 생애를 재연과 전문가 인터뷰를 통해 만나보는 다큐드라마.</div>
                                                                {/*<div className="ptrack-content">*/}
                                                                {/*    {*/}
                                                                {/*        movie.plots.plot[0].plotText*/}
                                                                {/*    }*/}
                                                                {/*</div>*/}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="billboard-links button-layer forward-leaning">
                                                    <a data-uia="play-button" role="link" aria-label="재생"className=" playLink isToolkit"href={`watch/${movie.movieId}/${movie.movieSeq}/MK059186_P02`}>
                                                        <button className="color-primary hasLabel hasIcon ltr-ed00td" tabIndex="-1"type="button">
                                                            <div className="ltr-1ol9m1e">
                                                                <div className="medium ltr-1evcx25" role="presentation">
                                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="Hawkins-Icon Hawkins-Icon-Standard" data-name="Play">
                                                                        <path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="ltr-14rufaj" style={{width: '1rem'}}></div>
                                                            <span className="ltr-j0gpa2">재생</span>
                                                        </button>
                                                    </a>
                                                    <button style={{display: 'none'}} className="color-secondary hasLabel hasIcon ltr-1jtux27" data-uia="billboard-more-info" type="button">
                                                        <div className="ltr-1ol9m1e">
                                                            <div className="medium ltr-1evcx25" role="presentation">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="Hawkins-Icon Hawkins-Icon-Standard" data-name="Info">
                                                                    <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="ltr-14rufaj" style={{width: '1rem'}}></div>
                                                        <span className="ltr-j0gpa2">상세 정보</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        </div>
    )
}

// ??세 관람가 표시
const RatingViewer = (props) => {
    const rating = props.rating;
    switch (rating) {
        case '18세관람가' :
        return (
            <>
                <path id="FIll---Red" fill="#C52E37" d="M88.728 100H11.27C5.043 100 0 94.957 0 88.73V11.274C0 5.048 5.043 0 11.27 0h77.458C94.954 0 100 5.048 100 11.274V88.73c0 6.227-5.046 11.27-11.272 11.27"></path>
                <path id="18" fill="#FFFFFE" d="M81.473 15.482c.846 0 1.534.687 1.534 1.533v22.099c0 2.036-.283 3.563-.852 4.581-.568 1.02-1.542 1.947-2.918 2.784l-4.581 2.431 4.58 2.156c.777.417 1.424.834 1.93 1.254.51.42.917.931 1.215 1.528.298.6.507 1.32.626 2.157.12.84.182 1.858.182 3.058v23.533c0 .846-.686 1.533-1.533 1.533H43.21a1.536 1.536 0 01-1.535-1.533V59.063c0-2.218.255-3.896.763-5.036.51-1.135 1.538-2.127 3.1-2.961l4.582-2.156-4.581-2.43c-1.376-.838-2.35-1.778-2.92-2.832-.565-1.046-.855-2.563-.855-4.534V17.015c0-.846.688-1.533 1.534-1.533zm-45.008 0V84.13H21.103V34.62h-5.485l7.104-19.136h13.743zm29.913 39.176h-7.89c-.845 0-1.534.686-1.534 1.532v13.737c0 .846.689 1.534 1.535 1.534h7.89c.846 0 1.534-.688 1.534-1.534V56.19c0-.846-.688-1.532-1.535-1.532zm0-26.548h-7.89c-.845 0-1.534.686-1.534 1.532v12.014c0 .846.689 1.533 1.535 1.533h7.89c.846 0 1.534-.687 1.534-1.533V29.642c0-.846-.688-1.532-1.535-1.532z"></path>
            </>
        )
        break;

        case '15세관람가' :
        return (
            <>
                <path id="Fill---Orange" fill="#CD6D34" d="M88.727 100H11.27C5.05 100 0 94.952 0 88.727V11.273C0 5.047 5.05 0 11.27 0h77.457C94.952 0 100 5.047 100 11.273v77.454C100 94.952 94.952 100 88.727 100"></path>
                <path id="15" fill="#FFFFFE" d="M36.876 15.482v68.651H21.509v-49.51h-5.484l7.097-19.141h13.754zm45.46 0V28.87H57.175v10.063h24.08c.845 0 1.533.687 1.533 1.534v42.13c0 .845-.688 1.532-1.534 1.532H43.616a1.533 1.533 0 01-1.533-1.533V62.202H57v8.988h10.874V52.052h-25.79v-36.57h40.254z"></path>
            </>
        )
        break;

        case '12세관람가' :
        return (
            <>
                <path id="Fill---Yellow" fill="#DFB039" d="M88.724 100h-77.45C5.049 100 0 94.954 0 88.728V11.274C0 5.048 5.048 0 11.275 0h77.449C94.949 0 100 5.048 100 11.274v77.454C100 94.954 94.95 100 88.724 100"></path>
                <path id="12" fill="#000" d="M36.92 15.484v68.647H21.553V34.62h-5.48l7.097-19.136h13.75zm44.288 0c.848 0 1.535.687 1.535 1.533v18.144c0 1.018-.044 1.885-.133 2.605a8.067 8.067 0 01-.493 1.975 14.48 14.48 0 01-.9 1.843c-.362.631-.84 1.363-1.44 2.204L60.643 70.653h21.923v13.394H41.59v-10.07l26.152-37.29V28.42H57.136v9.345H42.127V17.017c0-.846.687-1.533 1.534-1.533z"></path>
            </>
        )
        break;

        // 전체이용가
        default :
        return (
            <>
                <path id="Fill---Green" fill="#269251" d="M88.729 100H11.274C5.051 100 0 94.954 0 88.728V11.274C0 5.048 5.051 0 11.274 0H88.73C94.956 0 100 5.048 100 11.274v77.454C100 94.954 94.956 100 88.729 100"></path>
                <path id="Combined-Shape" fill="#FFFFFE" d="M68.776 24.428l11.274.001-.004 40.523h13.27V75.1l-24.54-.005V24.428zm-51.928.001l12.335.002L39.86 74.967l.004.131H28.589l-1.196-7.559-8.751.004-1.194 7.552-11.278.003v-.135L16.848 24.43zm36.277-.001v40.524h13.262v10.146h-24.54v-50.67h11.278zM23.015 40.74L20.23 57.987H25.8L23.015 40.74z"></path>
            </>
        )
        break;
    }
}

//
function MuteBtn(props) {
    return (
        <>
            <div className="global-supplemental-audio-toggle audio-btn button-layer">
                <button aria-label="음성 켜기"className="color-supplementary hasIcon round ltr-uhap25" type="button" onClick={props.muteBtnClick} id="specialMovieMuteBtn">
                    <div className="ltr-1ol9m1e">
                        <div className="small ltr-1evcx25" role="presentation">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="Hawkins-Icon Hawkins-Icon-Standard" data-name="VolumeHigh">
                                {
                                    props.muted ? <path fillRule="evenodd" clipRule="evenodd" d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z" fill="currentColor"></path>
                                        : <path d="M24 12C24 8.28699 22.525 4.72603 19.8995 2.10052L18.4853 3.51474C20.7357 5.76517 22 8.81742 22 12C22 15.1826 20.7357 18.2349 18.4853 20.4853L19.8995 21.8995C22.525 19.274 24 15.7131 24 12ZM11 4.00001C11 3.59555 10.7564 3.23092 10.3827 3.07613C10.009 2.92135 9.57889 3.00691 9.29289 3.29291L4.58579 8.00001H1C0.447715 8.00001 0 8.44773 0 9.00001V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00001ZM5.70711 9.70712L9 6.41423V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70712ZM16.0001 12C16.0001 10.4087 15.368 8.8826 14.2428 7.75739L12.8285 9.1716C13.5787 9.92174 14.0001 10.9392 14.0001 12C14.0001 13.0609 13.5787 14.0783 12.8285 14.8285L14.2428 16.2427C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92896C18.9462 6.80432 19.9998 9.34786 19.9998 12C19.9998 14.6522 18.9462 17.1957 17.0709 19.0711L15.6567 17.6569C17.157 16.1566 17.9998 14.1218 17.9998 12C17.9998 9.87829 17.157 7.84346 15.6567 6.34317L17.0709 4.92896Z" fill="currentColor"></path>
                                }
                            </svg>
                        </div>
                    </div>
                </button>
            </div>
        </>
    )
}

// specialMovie 영상 종료 후 다시보기 버튼 show
function Replay(props) {
    const replayBtn = () => {
        document.getElementById("specialMovie").play();
        // props.setIsMovieStart(true);
        // props.setIsReplay(false);
        specialMoviePlay(props.setMuted, props.setIsMovieStart, 'Y');
    }

    return (
        <>
            <button aria-label="다시 재생" className="color-supplementary hasIcon round ltr-uhap25" type="button" onClick={replayBtn}>
                <div className="ltr-1ol9m1e">
                    <div className="small ltr-1evcx25" role="presentation">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="Hawkins-Icon Hawkins-Icon-Standard" data-name="Refresh">
                            <path d="M13.1747 3.07702C11.01 2.79202 8.81537 3.30372 6.99988 4.51679C5.18439 5.72987 3.8718 7.56158 3.30668 9.67065C2.74155 11.7797 2.96243 14.0223 3.92815 15.9806C4.89388 17.9389 6.53859 19.4794 8.55586 20.3149C10.5731 21.1505 12.8254 21.2242 14.893 20.5224C16.9606 19.8205 18.7025 18.391 19.7942 16.5L18.0622 15.5C17.2131 16.9708 15.8582 18.0826 14.2501 18.6285C12.642 19.1744 10.8902 19.1171 9.32123 18.4672C7.75224 17.8173 6.47302 16.6192 5.7219 15.096C4.97078 13.5729 4.79899 11.8287 5.23853 10.1883C5.67807 8.5479 6.69897 7.12324 8.11102 6.17973C9.52307 5.23623 11.23 4.83824 12.9137 5.05991C14.5974 5.28158 16.1432 6.10778 17.2629 7.3846C18.1815 8.43203 18.762 9.7241 18.9409 11.0921L17.5547 10.168L16.4453 11.8321L19.4453 13.8321C19.7812 14.056 20.2188 14.056 20.5547 13.8321L23.5547 11.8321L22.4453 10.168L20.9605 11.1578C20.784 9.27909 20.0201 7.49532 18.7666 6.06591C17.3269 4.42429 15.3395 3.36202 13.1747 3.07702Z" fill="currentColor"></path>
                        </svg>
                    </div>
                </div>
            </button>
        </>
    )
}

export function specialMoviePlay(setMuted, setIsMovieStart, replay) {
    // 메인 이미지 걷어낸 후 동영상 재생
    let element = document.querySelector('.trailer-billboard');
    if(element) {
        element.classList.toggle('video-playing')
        element.children[0].classList.toggle('dismiss-static', 'dismiss-mask');
        element.children[0].children[0].className = 'nfp nf-player-container notranslate inactive NFPlayer';
    }

    // chrome 자동 재생 정책 > 음소거를 해야만 autoPlay 사용가능(동영상 자동 재생 시 원치 않는 사운드 재생 방지)
    // specialMovie컴포넌트 로드 후 동영상을 강제로 재생시키고 사운드 설정.
    // 동영상 강제 재생 후 사운드ON이 chrome 정책상 불가
    const specialMovie = document.getElementById("specialMovie");
    if(window.common.isEmpty(specialMovie)) return;

    // 사운드OFF
    if (localStorage.getItem('specialMovieMuted') == "ON") {
        specialMovie.play();
        setMuted(true);
    }
    // 사운드ON
    else if(localStorage.getItem('specialMovieMuted') == "OFF") {
        specialMovie.muted = true;
        specialMovie.play();
        specialMovie.muted = false;
        setMuted(false);
    }
    else {
        specialMovie.play();
        if(replay != 'Y') {
            specialMovie.muted = false;
            setMuted(false);
        }
    }
    setIsMovieStart(true);
}

export default React.memo(SpecialMovie);