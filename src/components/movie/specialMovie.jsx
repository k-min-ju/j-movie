import React from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrow from '../icon/PlayArrow';
import { specialMoviePlay } from '@/components/movie/common';
import { Info, Rating12, Rating15, Rating18, RatingAll } from '@/components/icon';

function SpecialMovie({
  movieList,
  specialMovieFunc,
  muted,
  setMuted,
  isMovieStart,
  setIsMovieStart,
  isReplay,
  setIsReplay
}) {
  if (movieList.length === 0) return;
  const movie = movieList[0];

  const muteBtnClick = () => {
    const specialMovie = document.getElementById('specialMovie');
    if (muted === true) {
      specialMovie.muted = false;
      setMuted(false);
      localStorage.setItem('specialMovieMuted', 'OFF');
    } else {
      specialMovie.muted = true;
      setMuted(true);
      localStorage.setItem('specialMovieMuted', 'ON');
    }
  };

  const movieEnded = () => {
    setIsMovieStart(false);
    setIsReplay(true);
    const billboardEl = document.querySelector('.trailer-billboard');
    billboardEl.classList.toggle('video-playing');
    billboardEl.children[0].classList.toggle('dismiss-static', 'dismiss-mask');
  };

  return (
    <div>
      <span className="volatile-billboard-animations-container">
        <div className="billboard-row" role="region" aria-label="특별 소개 콘텐츠">
          <div className="ptrack-container billboard-presentation-tracking">
            <div className="billboard-presentation-tracking ptrack-content">
              <div className="billboard-presentation-tracking ptrack-content">
                <div className="billboard billboard-pane billboard-originals trailer-billboard">
                  <div className="billboard-motion">
                    <div className="nfp nf-player-container notranslate NFPlayer" tabIndex="-1">
                      <div
                        className="VideoContainer VideoContainer--use-element-dimensions"
                        aria-hidden="true"
                        role="presentation"
                        style={{ height: '100%' }}
                      >
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              position: 'relative',
                              width: '100%',
                              height: '100%',
                              overflow: 'hidden'
                            }}
                          >
                            <video
                              id="specialMovie"
                              muted
                              playsInline
                              ref={specialMovieFunc}
                              style={{ height: '100%' }}
                              onEnded={movieEnded}
                            >
                              <source src="https://www.kmdb.or.kr/trailer/play/MK059186_P02.mp4" type="video/mp4" />
                            </video>
                            <div className="player-timedtext" style={{ display: 'none', direction: 'ltr' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="nfp-aspect-wrapper">
                        <div className="nfp-aspect-container">
                          <div className="nfp-aspect-inner" style={{ paddingTop: '56.25%' }} />
                          <div
                            className="image-based-timed-text"
                            style={{
                              position: 'absolute',
                              inset: '0px 0px 243px',
                              transform: 'translateZ(0px)'
                            }}
                          />
                        </div>
                      </div>
                      <div className="PlayerControlsNeo__layout PlayerControlsNeo__layout--inactive">
                        <div className="PlayerControlsNeo__all-controls PlayerControlsNeo__all-controls--low-power">
                          <div className="PlayerControlsNeo__gradient-top" />
                          <div className="PlayerControlsNeo__gradient-bottom" />
                          <div className="PlayerControlsNeo__core-controls">
                            <div
                              data-uia="nfplayer-bottom-controls"
                              className="PlayerControlsNeo__bottom-controls PlayerControlsNeo__bottom-controls--faded"
                            >
                              <div className="PlayerControlsNeo__progress-control-row PlayerControlsNeo__progress-control-row--row-standard">
                                <div className="PlayerControlsNeo__progress-container" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="motion-background-component bottom-layer full-screen">
                      <div className="hero-image-wrapper">
                        <img
                          className="hero static-image image-layer"
                          src="http://occ-0-993-2218.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABXjKQ0Fm3w9S41URw4bNFQtdZmm_o_PyhPyjiUza5gEPkXOgcq35Awo_jGDb5jW-Zxlepc_b_CtPjF66yLGUrbXemqfPaXjD7C3y.webp?r=5ee"
                          alt=""
                        />
                        <div className="trailer-vignette vignette-layer" />
                        <div className="hero-vignette vignette-layer" />
                        <div className="embedded-components button-layer" />
                      </div>
                      <div className="embedded-components button-layer">
                        <span className="ActionButtons">
                          {isMovieStart ? (
                            <div className="global-supplemental-audio-toggle audio-btn button-layer">
                              <button
                                aria-label="음성 켜기"
                                className="color-supplementary hasIcon round ltr-uhap25"
                                type="button"
                                onClick={muteBtnClick}
                              >
                                <div className="ltr-1ol9m1e">
                                  <div className="small ltr-1evcx25" role="presentation">
                                    {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                                  </div>
                                </div>
                              </button>
                            </div>
                          ) : isReplay ? (
                            <button
                              aria-label="다시 재생"
                              className="color-supplementary hasIcon round ltr-uhap25"
                              type="button"
                              onClick={() => {
                                document.getElementById('specialMovie').play();
                                specialMoviePlay(setMuted, setIsMovieStart, 'Y');
                              }}
                            >
                              <div className="ltr-1ol9m1e">
                                <div className="small ltr-1evcx25" role="presentation">
                                  <RefreshIcon />
                                </div>
                              </div>
                            </button>
                          ) : null}
                        </span>
                        <span className="maturity-rating ">
                          <span className="maturity-graphic">
                            {movie.rating === '18세관람가' ? (
                              <Rating18 />
                            ) : movie.rating === '15세관람가' ? (
                              <Rating15 />
                            ) : movie.rating === '12세관람가' ? (
                              <Rating12 />
                            ) : (
                              <RatingAll />
                            )}
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
                            <img
                              alt="Queen Cleopatra"
                              className="title-logo"
                              src="http://occ-0-993-2218.1.nflxso.net/dnm/api/v6/LmEnxtiAuzezXBjYXPuDgfZ4zZQ/AAAABRZySGZnShksIyikzJJvzCOEGOzb315hxl8vGI7F0_IE1sVAD4FPtJHeJLrc_EctoJK6LaP07sImaw_4Lk3M8Y5xua2c-axx6SLC-U5XSfth-qMYwKWx2y8uIJ6UvGMQoEbG_dNPMtrAXk8gAQ_3FPcY9blFbK_9t9f4Lhto4faN8Es8i_nG9A.webp?r=4cb"
                              title="Queen Cleopatra"
                            />
                          </div>
                        </div>
                        <div className="info-wrapper">
                          <div className="info-wrapper-fade">
                            <div className="episode-title-container"></div>
                            <div className="synopsis-fade-container">
                              <div className="synopsis no-supplemental">
                                <div className="ptrack-content plotText">
                                  이집트의 마지막 파라오 클레오파트라. 왕좌와 가족, 그리고 왕조의 유산을 지키기 위해
                                  싸웠던 그녀의 생애를 재연과 전문가 인터뷰를 통해 만나보는 다큐드라마.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="billboard-links button-layer forward-leaning">
                          <a
                            data-uia="play-button"
                            role="link"
                            aria-label="재생"
                            className=" playLink isToolkit"
                            href={`watch/${movie.movieId}/${movie.movieSeq}/MK059186_P02`}
                          >
                            <button className="color-primary hasLabel hasIcon ltr-ed00td" tabIndex="-1" type="button">
                              <div className="ltr-1ol9m1e">
                                <div className="medium ltr-1evcx25" role="presentation">
                                  <PlayArrow />
                                </div>
                              </div>
                              <div className="ltr-14rufaj" style={{ width: '1rem' }}></div>
                              <span className="ltr-j0gpa2">재생</span>
                            </button>
                          </a>
                          <button
                            style={{ display: 'none' }}
                            className="color-secondary hasLabel hasIcon ltr-1jtux27"
                            data-uia="billboard-more-info"
                            type="button"
                          >
                            <div className="ltr-1ol9m1e">
                              <div className="medium ltr-1evcx25" role="presentation">
                                <Info />
                              </div>
                            </div>
                            <div className="ltr-14rufaj" style={{ width: '1rem' }}></div>
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
  );
}

export default React.memo(SpecialMovie);
