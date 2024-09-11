import { useEffect, useRef, useState } from 'react';
import { IdleTimerProvider } from 'react-idle-timer';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { getKMDBMovieOne } from '@/components/movie/common';
import '@/Browse.css';
import { isEmpty, isNotEmpty, removeWatchingData } from '@/common';

function Watch() {
  const { movieId, movieSeq, movieVal } = useParams();
  const [status, setStatus] = useState('loading'); // loading : 로딩바 표시, active : 영화 상단, 하단 UI표시, passive : 영화 중지 상태일 때 영화에 대한 설명 표시
  const [isPlayMovie, setIsPlayMovie] = useState(false);
  const [movieData, setMovieData] = useState();
  const [volumeStatus, setVolumeStatus] = useState();
  const [playBackForward, setPlayBackForward] = useState();
  const [showTimeout, setShowTimeout] = useState();
  const [disableClickBack, setDisableClickBack] = useState(false);
  const [disableClickForward, setDisableClickForward] = useState(false);
  const [movieDuration, setMovieDuration] = useState();
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [isUpdateNeed, setIsUpdateNeed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isInit, setIsInit] = useState(true);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const ariaValueRef = useRef(null);
  const railRef = useRef(null);
  const knobRef = useRef(null);
  const prevRailHeight = useRef(null);
  const timeLineBarRef = useRef(null);
  const tickRef = useRef(null);
  const tickLeftRef = useRef(null);
  const tickRightRef = useRef(null);
  const redBtnRef = useRef(null);
  const redLineRef = useRef(null);
  const prevTimeLineWidth = useRef(null);

  useEffect(() => {
    document.getElementsByTagName('html')[0].className =
      't_33e568 t_5c6351 t_510ca7 t_17d527 t_75f67f t_89d625 js-focus-visible watch-video-root';

    // localStorage.getItem('movieMuted') : 최초 영화 시작 시 설정에 필요한 음소거 값
    // localStorage.getItem('movieVolume') : 최초 영화 시작 시 설정에 필요한 음량 값
    // 음소거 기본값 설정
    if (localStorage.getItem('movieMuted')) {
      localStorage.setItem('movieMuted', 'OFF');
    }
    // 음량 기본값 설정
    if (isEmpty(localStorage.getItem('movieVolume'))) {
      localStorage.setItem('movieVolume', '0.5');
    }

    getKMDBMovieOne(movieId, movieSeq)
      .catch(err => {
        console.log(err.code);
      })
      .then(data => {
        if (isEmpty(data)) return;

        setMovieData(data);
        document.querySelector('.ltr-omkt8s').classList.replace('inactive', 'active');

        // 영화 상영
        setTimeout(() => {
          setStatus('active');
          setIsPlayMovie(true);
          setMovieDuration(convertToHHMM(videoRef.current.duration));

          document.querySelector('.ltr-1212o1j').style = 'display: block;';
          videoRef.current.play();
          if (localStorage.getItem('movieMuted') == 'ON') {
            document.getElementById('movie').muted = true;
            setVolumeStatus('off');
            ariaValueRef.current.setAttribute('aria-valuenow', 0);
            knobRef.current.style.top = `calc(${Math.floor(
              railRef.current.getBoundingClientRect().height
            )}px - 1.125rem)`;
            railRef.current.children[0].style.top = '0px';
            railRef.current.children[0].style.height = '0px';
          } else {
            document.getElementById('movie').muted = false;
            document.getElementById('movie').volume = localStorage.getItem('movieVolume');
            volumeSvg(videoRef, setVolumeStatus);
            ariaValueRef.current.setAttribute('aria-valuenow', localStorage.getItem('movieVolume'));
            if (isNotEmpty(localStorage.getItem('knobTop'))) {
              knobRef.current.style.top = localStorage.getItem('knobTop');
              railRef.current.children[0].style.top = localStorage.getItem('railTop');
              railRef.current.children[0].style.height = localStorage.getItem('railHeight');
            }
          }
        }, 2500);
      });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = () => {
    // prevRailHeight.current : resize되기 전 레일의 height
    // railRef.current.offsetHeight : resize된 후 레일의 height
    // 사운드바
    const railPercent = ((prevRailHeight.current - railRef.current.offsetHeight) / prevRailHeight.current) * 100; // 브라우저가 줄어들거나 늘어난 % 구하기
    const knobCalcVal = knobRef.current.style.top; // 볼륨 버튼의 top값 > calc(??px-1.125rem)
    // calc()에서 px값만 추출
    let startIndex = knobCalcVal.indexOf('(') + 1;
    let endIndex = knobCalcVal.indexOf('px');
    const knobTop = knobCalcVal.substring(startIndex, endIndex);
    const newTop = knobTop - (knobTop * railPercent) / 100;

    knobRef.current.style.top = `calc(${newTop}px - 1.125rem`;
    railRef.current.children[0].style.top = `${newTop}px`;
    railRef.current.children[0].style.height = `${railRef.current.offsetHeight - newTop}px`;
    prevRailHeight.current = railRef.current.offsetHeight;

    // 타임라인 바
    const timelinePercent =
      ((prevTimeLineWidth.current - timeLineBarRef.current.offsetWidth) / prevTimeLineWidth.current) * 100;
    const redLineWidth = redLineRef.current.style.width.slice(0, -2);
    const redBtnLeft = redBtnRef.current.style.left;
    let newWidth = redLineWidth - (redLineWidth * timelinePercent) / 100;
    startIndex = redBtnLeft.indexOf('(') + 1;
    endIndex = redBtnLeft.indexOf('px');
    let newLeft = redBtnLeft.substring(startIndex, endIndex);
    newLeft = newLeft - (newLeft * timelinePercent) / 100;

    redLineRef.current.style.width = `${newWidth}px`;
    redBtnRef.current.style.left = `${newLeft}px`;
    tickLeftRef.current = tickRef.current.getBoundingClientRect().left;
    tickRightRef.current = Math.round(window.innerWidth - tickRef.current.parentNode.getBoundingClientRect().right);
    prevTimeLineWidth.current = timeLineBarRef.current.offsetWidth;
  };

  return (
    <div className="netflix-sans-font-loaded">
      <div dir="ltr" className="extended-diacritics-language">
        <div className="watch-video" data-live-event-state="false" data-uia="watch-video">
          <div className="watch-video--player-view">
            {
              // 로딩
              status === 'loading' ? (
                <Loading />
              ) : (
                <TimerComponent
                  setStatus={setStatus}
                  isPlayMovie={isPlayMovie}
                  setIsPlayMovie={setIsPlayMovie}
                  videoRef={videoRef}
                  isFullScreen={isFullScreen}
                  setIsFullScreen={setIsFullScreen}
                />
              )
            }
            <div className="uma" id="uma" role="region"></div>
            <div className="inactive ltr-omkt8s" tabIndex="0">
              {
                // 영화
                // status != "loading" ? <Video isPlayMovie={isPlayMovie} setIsPlayMovie={setIsPlayMovie} status={status} setStatus={setStatus} /> : null
                movieData != null && movieData != '' ? (
                  <Video
                    movieVal={movieVal}
                    videoRef={videoRef}
                    redBtnRef={redBtnRef}
                    redLineRef={redLineRef}
                    isPlayMovie={isPlayMovie}
                    setIsPlayMovie={setIsPlayMovie}
                    setMovieDuration={setMovieDuration}
                    timeLineBarRef={timeLineBarRef}
                    currentPlayTime={currentPlayTime}
                    setCurrentPlayTime={setCurrentPlayTime}
                    isUpdateNeed={isUpdateNeed}
                    setIsUpdateNeed={setIsUpdateNeed}
                    setStatus={setStatus}
                    movieData={movieData}
                  />
                ) : null
              }
              {
                // 영화 조작 UI
                status == 'active' ? (
                  <Active
                    movieData={movieData}
                    volumeStatus={volumeStatus}
                    setVolumeStatus={setVolumeStatus}
                    isPlayMovie={isPlayMovie}
                    setIsPlayMovie={setIsPlayMovie}
                    setPlayBackForward={setPlayBackForward}
                    disableClickBack={disableClickBack}
                    disableClickForward={disableClickForward}
                    setDisableClickBack={setDisableClickBack}
                    setDisableClickForward={setDisableClickForward}
                    navigate={navigate}
                    setShowTimeout={setShowTimeout}
                    videoRef={videoRef}
                    ariaValueRef={ariaValueRef}
                    knobRef={knobRef}
                    railRef={railRef}
                    timeLineBarRef={timeLineBarRef}
                    tickRef={tickRef}
                    tickLeftRef={tickLeftRef}
                    tickRightRef={tickRightRef}
                    redBtnRef={redBtnRef}
                    redLineRef={redLineRef}
                    movieDuration={movieDuration}
                    setMovieDuration={setMovieDuration}
                    prevTimeLineWidth={prevTimeLineWidth}
                    currentPlayTime={currentPlayTime}
                    setCurrentPlayTime={setCurrentPlayTime}
                    isUpdateNeed={isUpdateNeed}
                    setIsUpdateNeed={setIsUpdateNeed}
                    isFullScreen={isFullScreen}
                    setIsFullScreen={setIsFullScreen}
                    isInit={isInit}
                    setIsInit={setIsInit}
                  />
                ) : status == 'passive' && isPlayMovie == false ? (
                  <Passive />
                ) : null
              }
            </div>
          </div>
          {
            // 영화 클릭 시 중앙에 play와 pause 이미지 노출
            isPlayMovie ? <NotiPlay /> : <NotiPause />
          }

          <SoundBar
            showTimeout={showTimeout}
            ariaValueRef={ariaValueRef}
            railRef={railRef}
            knobRef={knobRef}
            videoRef={videoRef}
            prevRailHeight={prevRailHeight}
            setVolumeStatus={setVolumeStatus}
          />

          {playBackForward == 'back' ? <PlayBack /> : playBackForward == 'forward' ? <PlayForward /> : null}
        </div>
        {/*<div className="visually-hidden screenReaderMessage" role="alert" aria-live="assertive">*/}
        {/*    <span></span>*/}
        {/*</div>*/}
        {/*<div className="visually-hidden" style={{display: 'none'}}>*/}
        {/*    <div id="standaloneAudioDescriptionAvailable">화면 해설이 제공됩니다</div>*/}
        {/*    <div id="episodesAudioDescriptionAvailable">일부 에피소드에 화면 해설이 제공됩니다</div>*/}
        {/*    <div id="standaloneTextClosedCaptionsAvailable">청각 장애인용 자막이 지원됩니다</div>*/}
        {/*    <div id="episodicTextClosedCaptionsAvailable">일부 에피소드에 청각 장애인용 자막이 지원됩니다</div>*/}
        {/*    <div id="playWithAudioDescription">화면 해설을 켠 채로 시작합니다</div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}

// 10초 전으로 이동 시 화면에 표시
function PlayBack() {
  return (
    <div className="playback-notification playback-notification--back-10" data-uia="watch-video-notification-back-10">
      <div className="playback-notification-background"></div>
      <div className="playback-notification-icon large ltr-1evcx25" role="presentation">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ltr-0 e1mhci4z1"
          data-name="Back10"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.0198 2.04817C13.3222 1.8214 15.6321 2.39998 17.5557 3.68532C19.4794 4.97066 20.8978 6.88324 21.5694 9.09717C22.241 11.3111 22.1242 13.6894 21.2388 15.8269C20.3534 17.9643 18.7543 19.7286 16.714 20.8192C14.6736 21.9098 12.3182 22.2592 10.0491 21.8079C7.77999 21.3565 5.73759 20.1323 4.26989 18.3439C2.80219 16.5555 2 14.3136 2 12L0 12C-2.74181e-06 14.7763 0.962627 17.4666 2.72387 19.6127C4.48511 21.7588 6.93599 23.2278 9.65891 23.7694C12.3818 24.3111 15.2083 23.8918 17.6568 22.5831C20.1052 21.2744 22.0241 19.1572 23.0866 16.5922C24.149 14.0273 24.2892 11.1733 23.4833 8.51661C22.6774 5.85989 20.9752 3.56479 18.6668 2.02238C16.3585 0.479973 13.5867 -0.214321 10.8238 0.0578004C8.71195 0.265799 6.70517 1.02858 5 2.2532V1H3V5C3 5.55228 3.44772 6 4 6H8V4H5.99999C7.45608 2.90793 9.19066 2.22833 11.0198 2.04817ZM2 4V7H5V9H1C0.447715 9 0 8.55228 0 8V4H2ZM14.125 16C13.5466 16 13.0389 15.8586 12.6018 15.5758C12.1713 15.2865 11.8385 14.8815 11.6031 14.3609C11.3677 13.8338 11.25 13.2135 11.25 12.5C11.25 11.7929 11.3677 11.1758 11.6031 10.6488C11.8385 10.1217 12.1713 9.71671 12.6018 9.43388C13.0389 9.14463 13.5466 9 14.125 9C14.7034 9 15.2077 9.14463 15.6382 9.43388C16.0753 9.71671 16.4116 10.1217 16.6469 10.6488C16.8823 11.1758 17 11.7929 17 12.5C17 13.2135 16.8823 13.8338 16.6469 14.3609C16.4116 14.8815 16.0753 15.2865 15.6382 15.5758C15.2077 15.8586 14.7034 16 14.125 16ZM14.125 14.6501C14.5151 14.6501 14.8211 14.4637 15.043 14.0909C15.2649 13.7117 15.3759 13.1814 15.3759 12.5C15.3759 11.8186 15.2649 11.2916 15.043 10.9187C14.8211 10.5395 14.5151 10.3499 14.125 10.3499C13.7349 10.3499 13.4289 10.5395 13.207 10.9187C12.9851 11.2916 12.8741 11.8186 12.8741 12.5C12.8741 13.1814 12.9851 13.7117 13.207 14.0909C13.4289 14.4637 13.7349 14.6501 14.125 14.6501ZM8.60395 15.8554V10.7163L7 11.1405V9.81956L10.1978 9.01928V15.8554H8.60395Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
}

// 10초 다음으로 이동 시 화면에 표시
function PlayForward() {
  return (
    <div
      className="playback-notification playback-notification--forward-10"
      data-uia="watch-video-notification-forward-10"
    >
      <div className="playback-notification-background"></div>
      <div className="playback-notification-icon large ltr-1evcx25" role="presentation">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ltr-0 e1mhci4z1"
          data-name="Forward10"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.4443 3.68532C8.36795 2.39998 10.6778 1.8214 12.9802 2.04817C14.8093 2.22833 16.5439 2.90793 18 4H16V6H20C20.5523 6 21 5.55229 21 5V1H19V2.2532C17.2948 1.02859 15.2881 0.2658 13.1762 0.057802C10.4133 -0.214319 7.64154 0.479975 5.33316 2.02238C3.02478 3.56479 1.32262 5.85989 0.516718 8.51661C-0.289188 11.1733 -0.148981 14.0273 0.913451 16.5922C1.97588 19.1572 3.8948 21.2744 6.34325 22.5831C8.79169 23.8918 11.6182 24.3111 14.3411 23.7694C17.064 23.2278 19.5149 21.7588 21.2761 19.6127C23.0374 17.4666 24 14.7763 24 12L22 12C22 14.3136 21.1978 16.5555 19.7301 18.3439C18.2624 20.1323 16.22 21.3565 13.9509 21.8079C11.6818 22.2592 9.32641 21.9098 7.28604 20.8192C5.24567 19.7286 3.64657 17.9643 2.76121 15.8269C1.87585 13.6894 1.75901 11.3111 2.4306 9.09718C3.10219 6.88324 4.52065 4.97067 6.4443 3.68532ZM22 4V7H19V9H23C23.5523 9 24 8.55229 24 8V4H22ZM12.6018 15.5758C13.0389 15.8586 13.5466 16 14.125 16C14.7034 16 15.2078 15.8586 15.6382 15.5758C16.0753 15.2865 16.4116 14.8815 16.6469 14.3609C16.8823 13.8338 17 13.2135 17 12.5C17 11.7929 16.8823 11.1759 16.6469 10.6488C16.4116 10.1217 16.0753 9.71671 15.6382 9.43389C15.2078 9.14463 14.7034 9 14.125 9C13.5466 9 13.0389 9.14463 12.6018 9.43389C12.1713 9.71671 11.8385 10.1217 11.6031 10.6488C11.3677 11.1759 11.25 11.7929 11.25 12.5C11.25 13.2135 11.3677 13.8338 11.6031 14.3609C11.8385 14.8815 12.1713 15.2865 12.6018 15.5758ZM15.043 14.0909C14.8211 14.4637 14.5151 14.6501 14.125 14.6501C13.7349 14.6501 13.429 14.4637 13.207 14.0909C12.9851 13.7117 12.8741 13.1814 12.8741 12.5C12.8741 11.8186 12.9851 11.2916 13.207 10.9187C13.429 10.5395 13.7349 10.3499 14.125 10.3499C14.5151 10.3499 14.8211 10.5395 15.043 10.9187C15.2649 11.2916 15.3759 11.8186 15.3759 12.5C15.3759 13.1814 15.2649 13.7117 15.043 14.0909ZM8.60395 10.7163V15.8554H10.1978V9.01929L7 9.81956V11.1405L8.60395 10.7163Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
}

// 음량 조절 게이지 컴포넌트
function SoundBar(props) {
  let { showTimeout, ariaValueRef, railRef, knobRef, videoRef, prevRailHeight, setVolumeStatus } = props;
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    prevRailHeight.current = railRef.current.offsetHeight;
  }, [railRef.current]);

  const volumeControl = event => {
    prevRailHeight.current = railRef.current.offsetHeight;
    const knobHeight = knobRef.current.offsetHeight;
    const railTop = railRef.current.getBoundingClientRect().top;
    const railHeight = Math.floor(railRef.current.getBoundingClientRect().height);
    const mouseY = event.clientY;
    const newTop = Math.max(0, Math.min(railHeight, mouseY - railTop - knobHeight / 2));
    const newValue = 1 - newTop / railHeight;
    let volume = Math.min(1, newValue).toString();

    knobRef.current.style.top = `calc(${newTop}px - 1.125rem`; // 볼륨 버튼 위치
    ariaValueRef.current.setAttribute('aria-valuenow', volume);
    videoRef.current.volume = volume; // 영화의 실제 볼륨 조절
    railRef.current.children[0].style.top = `${newTop}px`; // 볼륨 버튼 이동 시 레일의 빨간색 게이지 표시하기 위한 top
    railRef.current.children[0].style.height = `${railRef.current.offsetHeight - newTop}px`; // 볼륨 버튼 이동 시 레일의 빨간색 게이지 표시하기 위한 height

    volumeSvg(videoRef, setVolumeStatus);

    localStorage.setItem('movieVolume', volume);
    localStorage.setItem('knobTop', knobRef.current.style.top);
    localStorage.setItem('railTop', railRef.current.children[0].style.top);
    localStorage.setItem('railHeight', railRef.current.children[0].style.height);
  };

  const volumePointerDown = event => {
    setIsDragging(true);
    volumeControl(event);
  };

  const volumePointerUp = () => {
    setIsDragging(false);

    if (videoRef.current.volume > 0) {
      localStorage.setItem('movieMuted', 'OFF');
    } else {
      localStorage.setItem('movieMuted', 'ON');
    }
  };

  const volumePointerMove = event => {
    if (!isDragging) return;
    volumeControl(event);
  };

  const timeoutClear = () => {
    clearTimeout(showTimeout);
  };

  const timeout = () => {
    setTimeout(() => {
      const muteBtn = document.getElementById('muteBtn').children[0];
      const soundBar = document.querySelector('.ltr-4dcwks');
      muteBtn.classList.remove('active');
      soundBar.classList.remove('show');
    }, 300);
  };

  return (
    <div
      className="ltr-4dcwks"
      style={{ left: '272px', top: '640px' }}
      onMouseOver={timeoutClear}
      onMouseLeave={timeout}
    >
      <div className="ltr-f9fjby">
        <div
          className="watch-video--scrubber-volume-container medium"
          data-uia="watch-video-volume-content"
          onPointerDown={volumePointerDown}
          onPointerUp={volumePointerUp}
          onPointerMove={volumePointerMove}
          onPointerLeave={volumePointerUp}
        >
          <div
            ref={ariaValueRef}
            aria-orientation="vertical"
            aria-valuemax="1"
            aria-valuemin="0"
            aria-valuenow="0"
            className="medium ltr-p2znkt"
            data-uia="scrubber"
            max="1"
            min="0"
            role="slider"
            tabIndex="0"
            style={{ height: '100%', width: 'auto', padding: '1.35rem 1.125rem' }}
          >
            <div
              ref={railRef}
              data-uia="scrubber-rail"
              className="ltr-c5fsq2"
              style={{ height: '100%', width: '1.125rem' }}
              onPointerDown={volumePointerDown}
              onPointerUp={volumePointerUp}
            >
              <div
                data-uia="scrubber-rail-filled"
                className="ltr-1bhvfwo"
                style={{ top: '50%', width: '100%', height: '50%' }}
              />
              <div
                ref={knobRef}
                data-uia="scrubber-knob"
                className="ltr-16i8klm"
                style={{ left: '-0.5625rem', top: '50%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotiPlay() {
  return (
    <div className="playback-notification playback-notification--play" data-uia="watch-video-notification-play">
      <div className="playback-notification-background"></div>
      <div className="playback-notification-icon large ltr-1evcx25" role="presentation">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ltr-0 e1mhci4z1"
          data-name="Play"
          aria-hidden="true"
        >
          <path
            d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
}

function NotiPause() {
  return (
    <div className="playback-notification playback-notification--pause" data-uia="watch-video-notification-pause">
      <div className="playback-notification-background"></div>
      <div className="playback-notification-icon large ltr-1evcx25" role="presentation">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ltr-0 e1mhci4z1"
          data-name="Pause"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.5 3C4.22386 3 4 3.22386 4 3.5V20.5C4 20.7761 4.22386 21 4.5 21H9.5C9.77614 21 10 20.7761 10 20.5V3.5C10 3.22386 9.77614 3 9.5 3H4.5ZM14.5 3C14.2239 3 14 3.22386 14 3.5V20.5C14 20.7761 14.2239 21 14.5 21H19.5C19.7761 21 20 20.7761 20 20.5V3.5C20 3.22386 19.7761 3 19.5 3H14.5Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
}

// 로딩바
function Loading() {
  return (
    <div className="player-loading">
      <div className="player-loading-background-image player-loading-background-image-loading"></div>
      <div className="gradient"></div>
      <div>
        <div className="loading-children-container">
          <ClipLoader color="rgba(214, 54, 54, 1)" size={65} speedMultiplier={0.8} />
          <div className="nfp-control-row top-right-controls">
            <button
              className="touchable PlayerControls--control-element nfp-button-control circle-control-button button-nfplayerExit"
              role="button"
              aria-label="뒤로 가기"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 영화
function Video(props) {
  let {
    movieVal,
    videoRef,
    redBtnRef,
    redLineRef,
    isPlayMovie,
    setIsPlayMovie,
    setMovieDuration,
    timeLineBarRef,
    currentPlayTime,
    setCurrentPlayTime,
    isUpdateNeed,
    setIsUpdateNeed,
    setStatus,
    movieData
  } = props;

  useEffect(() => {
    if (isPlayMovie) {
      const interval = setInterval(() => {
        setCurrentPlayTime(prevTime => prevTime + 1);
        if (isEmpty(timeLineBarRef.current) && isUpdateNeed === false) {
          setIsUpdateNeed(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlayMovie]);

  useEffect(() => {
    if (isEmpty(timeLineBarRef.current)) return;
    timelineBarUpdate(timeLineBarRef, videoRef, currentPlayTime, redLineRef, redBtnRef, setMovieDuration, movieData);
  }, [currentPlayTime]);

  return (
    <div className="ltr-1212o1j" data-uia="video-canvas" style={{ display: 'none' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            id="movie"
            onEnded={() => {
              setIsPlayMovie(false);
              setCurrentPlayTime(0);
              setStatus('ended');
              setMovieDuration(convertToHHMM(videoRef.current.duration));
              if (isNotEmpty(redBtnRef.current) && isNotEmpty(redLineRef.current)) {
                redBtnRef.current.style.left = 'calc(0px - 0.75rem)';
                redLineRef.current.style.width = '0px';
              }
              localStorage.setItem('redLineWidth', '0px');
              localStorage.setItem('redBtnLeft', 'calc(0px - 0.75rem)');

              const docId = movieData[0].DOCID;
              // 시청중인 영화 삭제
              removeWatchingData(docId);
              document.getElementById('backBtn').click();
            }}
            src={`https://www.kmdb.or.kr/trailer/play/${movieVal}.mp4`}
            style={{ width: '100%', height: '1208px' }}
          />
          <div className="player-timedtext" style={{ display: 'none', direction: 'ltr' }} />
        </div>
      </div>
    </div>
  );
}

// 재생버튼
function moviePlayBtn(isPlayMovie, setIsPlayMovie, videoRef) {
  if (isPlayMovie) {
    videoRef.current.pause();
  } else {
    videoRef.current.play();
  }
  setIsPlayMovie(!isPlayMovie);
}

// 음소거 버튼 컴포넌트
function MovieMutedBtn({ volumeStatus }) {
  switch (volumeStatus) {
    case 'high':
      return <VolumeUpIcon />;
    case 'medium':
      return <VolumeDownIcon />;
    case 'low':
      return <VolumeMuteIcon />;
    case 'off':
      return <VolumeOffIcon />;
    default:
      return <VolumeOffIcon />;
  }
}

function Active(props) {
  let {
    movieData,
    volumeStatus,
    setVolumeStatus,
    isPlayMovie,
    setIsPlayMovie,
    setPlayBackForward,
    disableClickBack,
    disableClickForward,
    setDisableClickBack,
    setDisableClickForward,
    navigate,
    setShowTimeout,
    videoRef,
    ariaValueRef,
    knobRef,
    railRef,
    timeLineBarRef,
    tickRef,
    tickLeftRef,
    tickRightRef,
    redBtnRef,
    redLineRef,
    movieDuration,
    setMovieDuration,
    prevTimeLineWidth,
    currentPlayTime,
    setCurrentPlayTime,
    isUpdateNeed,
    setIsUpdateNeed,
    isFullScreen,
    setIsFullScreen,
    isInit,
    setIsInit
  } = props;

  useEffect(() => {
    document.getElementById('movieTitle').innerText = movieData[0].title;
    prevTimeLineWidth.current = timeLineBarRef.current.offsetWidth;

    if (isUpdateNeed || isPlayMovie == false) {
      timelineBarUpdate(timeLineBarRef, videoRef, currentPlayTime, redLineRef, redBtnRef, setMovieDuration, movieData);
      setIsUpdateNeed(false);
    }

    // 최초 로드 시 1번만 실행. 시청중인 영화 타임 라인 바 setting
    if (isInit) {
      if (isNotEmpty(localStorage.getItem(movieData[0].DOCID))) {
        const watchingData = JSON.parse(localStorage.getItem(movieData[0].DOCID));
        redLineRef.current.style.width = watchingData.redLineWidth;
        redBtnRef.current.style.left = watchingData.redBtnLeft;
        videoRef.current.currentTime = watchingData.currentTime;
        setMovieDuration(convertToHHMM(watchingData.duration));
        setCurrentPlayTime(watchingData.currentTime);
      }
    }
    setIsInit(false);
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  let [trickMovieTime, setTrickMovieTime] = useState(0);
  const timeLineRef = useRef(null);
  const trickImageRef = useRef(null);
  const fullScreenRef = useRef(null);

  useEffect(() => {
    tickLeftRef.current = tickRef.current.getBoundingClientRect().left;
    tickRightRef.current = Math.round(window.innerWidth - tickRef.current.parentNode.getBoundingClientRect().right);
  }, [tickRef]);

  // 음소거 버튼 클릭
  const movieMutedClick = () => {
    chgVolumeStatus(videoRef, setVolumeStatus, ariaValueRef, knobRef, railRef);
  };

  const timeLinePointerMove = event => {
    // setIsPointerMove(true);
    // 틱 표시
    timeLineRef.current.classList.add('active');

    const tickNewLeft = event.clientX - tickLeftRef.current;
    tickRef.current.style.left = `${tickNewLeft}px`;

    // 타임라인 바에 마우스 오버 시 바로 위에 이동 시간 표시
    let trickDiv = timeLineRef.current.children[1];
    trickDiv.classList.add('show');

    let trickOffsetWidth = trickDiv.offsetWidth;
    let trickMinLeft = trickOffsetWidth / 2;
    let trickMaxLeft = window.innerWidth - trickOffsetWidth / 2;
    let trickLeft = 0;
    let trickTop = 0;

    // trick영역이 화면 밖으로 벗어나지 않기 위함
    if (trickMinLeft > event.clientX) {
      // 왼쪽으로 벗어날 때
      trickLeft = `-${tickLeftRef.current}px`;
    } else if (trickMaxLeft < event.clientX) {
      // 오른쪽으로 벗어날 때
      trickLeft = `${window.innerWidth - (trickOffsetWidth + tickLeftRef.current)}px`;
    } else {
      trickLeft = `${tickNewLeft - trickOffsetWidth / 2}px`;
    }
    trickTop = `${
      Math.floor(timeLineBarRef.current.getBoundingClientRect().top) -
      window.innerHeight -
      Math.floor(trickDiv.offsetHeight / 2)
    }px`;

    trickDiv.style.left = trickLeft;
    trickDiv.style.top = trickTop;

    setTrickMovieTime(Math.floor((event.clientX / timeLineBarRef.current.offsetWidth) * videoRef.current.duration));

    trickImageRef.current.src = 'http://file.koreafilm.or.kr/still/copy/00/64/40/DST798040_01.jpg'; // trick영역에 이미지 넣기
    document.querySelector('.trick-play-text').innerText = convertToHHMM(trickMovieTime); // trick영역에 영화 이동 시간 setting

    if (!isDragging) return;
    timeLineControl(event);
  };

  const timeLinePointerUp = () => {
    setMovieDuration(convertToHHMM(videoRef.current.duration - trickMovieTime));
    setIsDragging(false);
  };

  const timeLinePointerDown = event => {
    setIsDragging(true);
    timeLineControl(event);
  };

  const timeLinePointerLeave = () => {
    timeLineRef.current.classList.remove('active');
    tickRef.current.style.left = '0px';
    setIsDragging(false);

    timeLineRef.current.children[1].classList.remove('show');
    trickImageRef.current.src = '';
  };

  const timeLineControl = event => {
    const barRect = timeLineBarRef.current.getBoundingClientRect();
    const leftOffset = event.clientX - timeLineRef.current.getBoundingClientRect().left;
    const newLeftOffset = Math.max(0, Math.min(leftOffset, barRect.width));

    redLineRef.current.style.width = `${newLeftOffset}px`;
    redBtnRef.current.style.left = `calc(${newLeftOffset}px - 0.75rem)`;
    // localStorage.setItem('redLineWidth', redLineRef.current.style.width);
    // localStorage.setItem('redBtnLeft', redBtnRef.current.style.left);

    // 영화 재생 시간 = (버튼이 드래그되는 위치 / 타임라인 바의 가로 길이) * 전체 영화 재생 시간
    const currentTimeInSeconds = (newLeftOffset / barRect.width) * videoRef.current.duration;
    videoRef.current.currentTime = currentTimeInSeconds;
    setCurrentPlayTime(currentTimeInSeconds);

    // 시청중인 영화 타임라인 바 데이터 저장
    setStorageMovieIdSeq(
      movieData[0].DOCID,
      redLineRef.current.style.width,
      redBtnRef.current.style.left,
      currentTimeInSeconds,
      videoRef.current.duration
    );
  };

  return (
    <div className="ltr-16tr625" style={{ alignItems: 'normal', justifyContent: 'flex-end' }}>
      <div className="ltr-1jnlk6v" style={{ alignItems: 'flex-start', flexGrow: '1', justifyContent: 'flex-start' }}>
        <div className="ltr-14rufaj" style={{ alignItems: 'normal', justifyContent: 'normal' }}>
          <div
            className="watch-video--back-container ltr-1jnlk6v"
            onClick={() => {
              moviePlayBtn(isPlayMovie, setIsPlayMovie, videoRef);
            }}
            style={{ alignItems: 'normal', flexGrow: '1', justifyContent: 'flex-start' }}
          >
            <div className="medium ltr-my293h">
              <button
                id="backBtn"
                aria-label="Back to Browse"
                className=" ltr-14ph5iy"
                data-uia="control-nav-back"
                onClick={() => {
                  navigate('/Browse');
                }}
              >
                <div className="control-medium ltr-1evcx25" role="presentation">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ltr-0 e1mhci4z1"
                    data-name="ArrowLeft"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M24 11.0001L3.41421 11.0001L8.70711 5.70718L7.29289 4.29297L0.292892 11.293C0.105356 11.4805 0 11.7349 0 12.0001C0 12.2653 0.105356 12.5196 0.292892 12.7072L7.29289 19.7072L8.70711 18.293L3.41421 13.0001H24V11.0001Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
          </div>
          <div
            className="watch-video--flag-container ltr-1jnlk6v"
            onClick={() => {
              moviePlayBtn(isPlayMovie, setIsPlayMovie, videoRef);
            }}
            style={{ alignItems: 'normal', flexGrow: '1', justifyContent: 'flex-end' }}
          >
            <div className="medium ltr-my293h" style={{ visibility: 'hidden' }}>
              <button aria-label="Netflix 재생 문제 신고" className=" ltr-14ph5iy" data-uia="control-flag">
                <div className="control-medium ltr-1evcx25" role="presentation">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ltr-0 e1mhci4z1"
                    data-name="Flag"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1 3C0.447715 3 0 3.44772 0 4V10.5714V21H2L2 11.5783C4.05836 11.6067 6.06478 11.7223 8 11.9167V14.5714C8 15.042 8.32807 15.4489 8.78794 15.5487C13.0747 16.4789 17.9011 17 23 17C23.5523 17 24 16.5523 24 16V9.42857C24 8.87629 23.5523 8.42857 23 8.42857C20.5907 8.42857 18.2474 8.30904 16 8.08326V5.42857C16 4.95801 15.6719 4.55111 15.2121 4.45132C10.9253 3.52108 6.09885 3 1 3ZM2 9.57813C4.44972 9.61098 6.83093 9.76415 9.11345 10.0248L10 10.126V11.0183V13.7591C13.6576 14.4969 17.7153 14.9341 22 14.9931V10.4219C19.5503 10.389 17.1691 10.2359 14.8866 9.97522L14 9.87399V8.98168V6.24091C10.3424 5.50309 6.2847 5.06594 2 5.00688V9.57813Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="watch-video--bottom-controls-container ltr-1jnlk6v"
        style={{ alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <div className="ltr-1qb0uev">
          <div className="ltr-1bt0omd">
            <div className="ltr-14rufaj" style={{ alignItems: 'normal', justifyContent: 'normal' }}>
              <div
                className="ltr-1jnlk6v"
                style={{ alignItems: 'center', flexGrow: '1', justifyContent: 'normal' }}
                onPointerMove={timeLinePointerMove}
                onPointerUp={timeLinePointerUp}
                onPointerDown={timeLinePointerDown}
                onPointerLeave={timeLinePointerLeave}
              >
                <div
                  ref={timeLineRef}
                  aria-orientation="horizontal"
                  className="medium ltr-uykqh0"
                  data-uia="timeline"
                  role="slider"
                  tabIndex="-1"
                >
                  <div ref={timeLineBarRef} data-uia="timeline-bar" className="ltr-yzurhj">
                    <div className="ltr-1jssjem" />
                    <div ref={redLineRef} className="ltr-1xfifdu" />
                    <div ref={tickRef} className="ltr-ai5t3i" />
                    <div
                      ref={redBtnRef}
                      aria-label="재생 시간 표시줄"
                      aria-valuemax="6520208"
                      className="ltr-1gidbvb"
                      style={{ left: 'calc(0px - 0.75rem)' }}
                    ></div>
                  </div>

                  <div className="ltr-1kex6ih">
                    <div className="ltr-f9fjby">
                      <div className="medium ltr-l5iwyw" data-uia="trick-play">
                        <div data-uia="trick-play-image">
                          <img ref={trickImageRef} src="" />
                        </div>
                        <div className="trick-play-text" data-uia="trick-play-text">
                          00:00
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ltr-vpjz8w" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <span className="ltr-13tzgng" id="movieDuration">
                  {movieDuration}
                </span>
              </div>
            </div>
            <div
              className="ltr-14rufaj"
              style={{ height: '3rem', minHeight: '3rem', minWidth: '100%', width: '100%' }}
            />
            <div className="ltr-1bt0omd">
              <div className="ltr-14rufaj" style={{ alignItems: 'normal', justifyContent: 'normal' }}>
                <div className="ltr-1jnlk6v" style={{ alignItems: 'normal', justifyContent: 'normal' }}>
                  <div className="medium ltr-my293h">
                    <button
                      aria-label="재생"
                      id="moviePlay"
                      className=" ltr-14ph5iy"
                      onClick={() => {
                        moviePlayBtn(isPlayMovie, setIsPlayMovie, videoRef);
                      }}
                    >
                      <div className="control-medium ltr-1evcx25" role="presentation">
                        {props.isPlayMovie ? (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="svg-icon-nfplayerPause ltr-0 e1mhci4z1"
                            data-name="Pause"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.5 3C4.22386 3 4 3.22386 4 3.5V20.5C4 20.7761 4.22386 21 4.5 21H9.5C9.77614 21 10 20.7761 10 20.5V3.5C10 3.22386 9.77614 3 9.5 3H4.5ZM14.5 3C14.2239 3 14 3.22386 14 3.5V20.5C14 20.7761 14.2239 21 14.5 21H19.5C19.7761 21 20 20.7761 20 20.5V3.5C20 3.22386 19.7761 3 19.5 3H14.5Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="svg-icon-nfplayerPlay ltr-0 e1mhci4z1"
                          >
                            <path
                              d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                  <div className="ltr-14rufaj" style={{ minWidth: '3rem', width: '3rem' }} />
                  <div className="medium ltr-my293h">
                    <button
                      aria-label="뒤로 가기"
                      className=" ltr-14ph5iy"
                      onClick={() => {
                        if (videoRef.current.ended || disableClickBack) return;
                        playBackForward(
                          'back',
                          setPlayBackForward,
                          setDisableClickBack,
                          setDisableClickForward,
                          videoRef,
                          currentPlayTime,
                          setCurrentPlayTime
                        );
                      }}
                    >
                      <div className="control-medium ltr-1evcx25" role="presentation">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ltr-0 e1mhci4z1"
                          data-name="Back10"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.0198 2.04817C13.3222 1.8214 15.6321 2.39998 17.5557 3.68532C19.4794 4.97067 20.8978 6.88324 21.5694 9.09718C22.241 11.3111 22.1242 13.6894 21.2388 15.8269C20.3534 17.9643 18.7543 19.7286 16.714 20.8192C14.6736 21.9098 12.3182 22.2592 10.0491 21.8079C7.77999 21.3565 5.73759 20.1323 4.26989 18.3439C2.80219 16.5555 2 14.3136 2 12L0 12C-2.74181e-06 14.7763 0.962627 17.4666 2.72387 19.6127C4.48511 21.7588 6.93599 23.2278 9.65891 23.7694C12.3818 24.3111 15.2083 23.8918 17.6568 22.5831C20.1052 21.2744 22.0241 19.1572 23.0866 16.5922C24.149 14.0273 24.2892 11.1733 23.4833 8.51661C22.6774 5.85989 20.9752 3.56479 18.6668 2.02238C16.3585 0.479975 13.5867 -0.214319 10.8238 0.057802C8.71195 0.2658 6.70517 1.02859 5 2.2532V1H3V5C3 5.55229 3.44772 6 4 6H8V4H5.99999C7.45608 2.90793 9.19066 2.22833 11.0198 2.04817ZM2 4V7H5V9H1C0.447715 9 0 8.55229 0 8V4H2ZM14.125 16C13.5466 16 13.0389 15.8586 12.6018 15.5758C12.1713 15.2865 11.8385 14.8815 11.6031 14.3609C11.3677 13.8338 11.25 13.2135 11.25 12.5C11.25 11.7929 11.3677 11.1759 11.6031 10.6488C11.8385 10.1217 12.1713 9.71671 12.6018 9.43389C13.0389 9.14463 13.5466 9 14.125 9C14.7034 9 15.2077 9.14463 15.6382 9.43389C16.0753 9.71671 16.4116 10.1217 16.6469 10.6488C16.8823 11.1759 17 11.7929 17 12.5C17 13.2135 16.8823 13.8338 16.6469 14.3609C16.4116 14.8815 16.0753 15.2865 15.6382 15.5758C15.2077 15.8586 14.7034 16 14.125 16ZM14.125 14.6501C14.5151 14.6501 14.8211 14.4637 15.043 14.0909C15.2649 13.7117 15.3759 13.1814 15.3759 12.5C15.3759 11.8186 15.2649 11.2916 15.043 10.9187C14.8211 10.5395 14.5151 10.3499 14.125 10.3499C13.7349 10.3499 13.4289 10.5395 13.207 10.9187C12.9851 11.2916 12.8741 11.8186 12.8741 12.5C12.8741 13.1814 12.9851 13.7117 13.207 14.0909C13.4289 14.4637 13.7349 14.6501 14.125 14.6501ZM8.60395 15.8554V10.7163L7 11.1405V9.81956L10.1978 9.01929V15.8554H8.60395Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                  <div className="ltr-14rufaj" style={{ minWidth: '3rem', width: '3rem' }} />
                  <div className="medium ltr-my293h">
                    <button
                      aria-label="앞으로 가기"
                      className=" ltr-14ph5iy"
                      onClick={() => {
                        if (videoRef.current.ended || disableClickForward) return;
                        playBackForward(
                          'forward',
                          setPlayBackForward,
                          setDisableClickBack,
                          setDisableClickForward,
                          videoRef,
                          currentPlayTime,
                          setCurrentPlayTime
                        );
                      }}
                    >
                      <div className="control-medium ltr-1evcx25" role="presentation">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ltr-0 e1mhci4z1"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.4443 3.68532C8.36794 2.39998 10.6778 1.8214 12.9802 2.04817C14.8093 2.22833 16.5439 2.90793 18 4H16V6H20C20.5523 6 21 5.55228 21 5V1H19V2.2532C17.2948 1.02858 15.288 0.265799 13.1762 0.0578004C10.4133 -0.214321 7.64153 0.479973 5.33315 2.02238C3.02478 3.56479 1.32262 5.85989 0.516716 8.51661C-0.28919 11.1733 -0.148983 14.0273 0.913448 16.5922C1.97588 19.1572 3.8948 21.2744 6.34325 22.5831C8.79169 23.8918 11.6182 24.3111 14.3411 23.7694C17.064 23.2278 19.5149 21.7588 21.2761 19.6127C23.0374 17.4666 24 14.7763 24 12L22 12C22 14.3136 21.1978 16.5555 19.7301 18.3439C18.2624 20.1323 16.22 21.3565 13.9509 21.8079C11.6818 22.2592 9.32641 21.9098 7.28604 20.8192C5.24567 19.7286 3.64657 17.9643 2.76121 15.8269C1.87585 13.6894 1.75901 11.3111 2.4306 9.09717C3.10218 6.88324 4.52065 4.97066 6.4443 3.68532ZM22 4V7H19V9H23C23.5523 9 24 8.55228 24 8V4H22ZM12.6018 15.5758C13.0389 15.8586 13.5466 16 14.125 16C14.7034 16 15.2077 15.8586 15.6382 15.5758C16.0753 15.2865 16.4116 14.8815 16.6469 14.3609C16.8823 13.8338 17 13.2135 17 12.5C17 11.7929 16.8823 11.1758 16.6469 10.6488C16.4116 10.1217 16.0753 9.71671 15.6382 9.43388C15.2077 9.14463 14.7034 9 14.125 9C13.5466 9 13.0389 9.14463 12.6018 9.43388C12.1713 9.71671 11.8385 10.1217 11.6031 10.6488C11.3677 11.1758 11.25 11.7929 11.25 12.5C11.25 13.2135 11.3677 13.8338 11.6031 14.3609C11.8385 14.8815 12.1713 15.2865 12.6018 15.5758ZM15.043 14.0909C14.8211 14.4637 14.5151 14.6501 14.125 14.6501C13.7349 14.6501 13.4289 14.4637 13.207 14.0909C12.9851 13.7117 12.8741 13.1814 12.8741 12.5C12.8741 11.8186 12.9851 11.2916 13.207 10.9187C13.4289 10.5395 13.7349 10.3499 14.125 10.3499C14.5151 10.3499 14.8211 10.5395 15.043 10.9187C15.2649 11.2916 15.3759 11.8186 15.3759 12.5C15.3759 13.1814 15.2649 13.7117 15.043 14.0909ZM8.60395 10.7163V15.8554H10.1978V9.01928L7 9.81956V11.1405L8.60395 10.7163Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                  <div className="ltr-14rufaj" style={{ minWidth: '3rem', width: '3rem' }} />
                  <div className="medium ltr-my293h">
                    <button
                      id="muteBtn"
                      aria-label="음량"
                      className=" ltr-14ph5iy"
                      onClick={movieMutedClick}
                      onMouseOver={e => {
                        movieMutedMouseOver(e);
                      }}
                      onMouseEnter={e => {
                        movieMutedMouseOver(e);
                      }}
                      onMouseLeave={e => {
                        movieMutedMouseLeave(e, setShowTimeout);
                      }}
                    >
                      <div className="control-medium ltr-1evcx25" role="presentation">
                        <MovieMutedBtn volumeStatus={volumeStatus} />
                      </div>
                    </button>
                  </div>
                </div>
                <div className="ltr-vf5me0" style={{ alignItems: 'normal', flexGrow: '1', justifyContent: 'normal' }}>
                  <div className="ltr-14rufaj" style={{ minWidth: '3rem', width: '3rem' }} />
                  <div
                    className="ltr-17qz7j2"
                    style={{ alignItems: 'normal', flexGrow: '1', justifyContent: 'normal' }}
                  >
                    <div className="medium ltr-er76rf" id="movieTitle"></div>
                  </div>
                </div>
                <div
                  className="ltr-1jnlk6v"
                  style={{ alignItems: 'normal', justifyContent: 'flex-end', visibility: 'hidden' }}
                >
                  <div className="ltr-14rufaj" style={{ minWidth: '3rem', width: '3rem' }} />
                  <div className="ltr-14rufaj" style={{ minWidth: '3rem', width: '3rem' }} />
                  <div className="medium ltr-my293h">
                    <button aria-label="음성 및 자막" className=" ltr-14ph5iy">
                      <div className="control-medium ltr-1evcx25" role="presentation">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ltr-0 e1mhci4z1"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 4C0 3.44772 0.447715 3 1 3H23C23.5523 3 24 3.44772 24 4V16C24 16.5523 23.5523 17 23 17H19V20C19 20.3688 18.797 20.7077 18.4719 20.8817C18.1467 21.0557 17.7522 21.0366 17.4453 20.8321L11.6972 17H1C0.447715 17 0 16.5523 0 16V4ZM2 5V15H12H12.3028L12.5547 15.1679L17 18.1315V16V15H18H22V5H2ZM10 9H4V7H10V9ZM20 11H14V13H20V11ZM12 13H4V11H12V13ZM20 7H12V9H20V7Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                  <div className="ltr-14rufaj" style={{ minWidth: '3rem', width: '3rem' }} />
                  <div className="medium ltr-my293h">
                    <button aria-label="1x (기본)" className=" ltr-14ph5iy">
                      <div className="control-medium ltr-1evcx25" role="presentation">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ltr-0 e1mhci4z1"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M17.6427 7.43779C14.5215 4.1874 9.47851 4.1874 6.35734 7.43779C3.21422 10.711 3.21422 16.0341 6.35734 19.3074L4.91474 20.6926C1.02842 16.6454 1.02842 10.0997 4.91474 6.05254C8.823 1.98249 15.177 1.98249 19.0853 6.05254C22.9716 10.0997 22.9716 16.6454 19.0853 20.6926L17.6427 19.3074C20.7858 16.0341 20.7858 10.711 17.6427 7.43779ZM14 14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14C10 12.8954 10.8954 12 12 12C12.1792 12 12.3528 12.0236 12.518 12.0677L15.7929 8.79289L17.2071 10.2071L13.9323 13.482C13.9764 13.6472 14 13.8208 14 14Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                  <div className="ltr-14rufaj" style={{ minWidth: '3rem', width: '3rem' }}></div>
                  <div className="medium ltr-my293h">
                    <button
                      ref={fullScreenRef}
                      aria-label="전체 화면"
                      className=" ltr-14ph5iy"
                      onClick={() => {
                        fullScreen(isFullScreen, setIsFullScreen);
                      }}
                      onMouseOver={() => {
                        fullScreenRef.current.classList.add('active');
                      }}
                      onMouseLeave={() => {
                        fullScreenRef.current.classList.remove('active');
                      }}
                    >
                      <div className="control-medium ltr-1evcx25" role="presentation">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ltr-0 e1mhci4z1"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 5C0 3.89543 0.895431 3 2 3H9V5H2V9H0V5ZM22 5H15V3H22C23.1046 3 24 3.89543 24 5V9H22V5ZM2 15V19H9V21H2C0.895431 21 0 20.1046 0 19V15H2ZM22 19V15H24V19C24 20.1046 23.1046 21 22 21H15V19H22Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="ltr-14rufaj"
              style={{ height: '3rem', minHeight: '3rem', minWidth: '100%', width: '100%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 볼륨 상태 변경 및 음소거처리
function chgVolumeStatus(videoRef, setVolumeStatus, ariaValueRef, knobRef, railRef) {
  if (videoRef.current.muted) {
    videoRef.current.muted = false;
    if (videoRef.current.volume >= 0.7) {
      setVolumeStatus('high');
    } else if (videoRef.current.volume >= 0.4) {
      setVolumeStatus('medium');
    } else if (videoRef.current.volume > 0) {
      setVolumeStatus('low');
    } else if (videoRef.current.volume == 0) {
      setVolumeStatus('off');
    }
    localStorage.setItem('movieMuted', 'OFF');
    ariaValueRef.current.setAttribute('aria-valuenow', localStorage.getItem('movieVolume'));
    knobRef.current.style.top = localStorage.getItem('knobTop');
    railRef.current.children[0].style.top = localStorage.getItem('railTop');
    railRef.current.children[0].style.height = localStorage.getItem('railHeight');
  } else {
    videoRef.current.muted = true;
    setVolumeStatus('off');
    localStorage.setItem('movieMuted', 'ON');
    ariaValueRef.current.setAttribute('aria-valuenow', 0);
    knobRef.current.style.top = 'calc(' + Math.floor(railRef.current.getBoundingClientRect().height) + 'px - 1.125rem)';
    railRef.current.children[0].style.top = '0px';
    railRef.current.children[0].style.height = '0px';
  }
}

// 볼륨 상태 값만 변경
function volumeSvg(videoRef, setVolumeStatus) {
  if (videoRef.current.volume >= 0.7) {
    setVolumeStatus('high');
  } else if (videoRef.current.volume >= 0.4) {
    setVolumeStatus('medium');
  } else if (videoRef.current.volume > 0) {
    setVolumeStatus('low');
  } else if (videoRef.current.volume === 0) {
    setVolumeStatus('off');
  }
}

function Passive() {
  return (
    <div className="watch-video--evidence-overlay-container">
      <div className="medium ltr-1rl4r83" data-uia="evidence-overlay">
        <span className="ltr-1nxl1ss">시청 중인 콘텐츠</span>
        <h2 className="ltr-tznaxg">사도행자: 특별수사대</h2>
        <h3 className="ltr-1mauwht" data-uia="evidence-overlay-episode-metadata">
          <span>2023</span>
          <span>15+</span>
          <span>1시간 40분</span>
        </h3>
        <p className="ltr-l09063" data-uia="evidence-overlay-synopsis">
          경찰 정보 요원이 범죄 조직에 의해 사살되면서, 관리하던 위장 요원 &apos;블랙잭&apos;의 모든 정보를 삭제한다.
          어느 날 갑자기 &apos;블랙 잭&apos;을 자처하는 인물의 연락을 받은 홍콩 경찰은 블랙잭과의 접선을 위해 파티에
          요원을 보낸다.
        </p>
        <span className="ltr-hpadbw">일시정지됨</span>
      </div>
    </div>
  );
}

function TimerComponent(props) {
  const { setStatus, isPlayMovie, setIsPlayMovie, videoRef, isFullScreen, setIsFullScreen } = props;
  let [changeTimeout, setChangeTimeout] = useState();
  let timeout;

  const changeUI = status => {
    document.querySelector('.ltr-omkt8s').classList.replace(document.querySelector('.ltr-omkt8s').classList[0], status);
    setStatus(status);
  };

  // timeout 경과 시
  const onIdle = () => {
    document.querySelector('.ltr-omkt8s').style.cursor = 'none';
    changeUI('inactive');

    if (isPlayMovie === false && document.querySelector('.ltr-omkt8s').classList[0] === 'inactive') {
      timeout = 8000;
    } else {
      timeout = 3000;
    }

    setChangeTimeout(
      setTimeout(() => {
        changeUI('passive');
      }, timeout)
    );
  };

  // 화면 클릭, 움직임 감지
  const onAction = event => {
    clearTimeout(changeTimeout);
    changeUI('active');

    // 스페이스바 입력
    if (event.code === 'Space' || event.code === 'Enter') {
      moviePlayBtn(isPlayMovie, setIsPlayMovie, videoRef);
    }

    if (event.code === 'F11') {
      fullScreen(isFullScreen, setIsFullScreen);
    }

    document.querySelector('.ltr-omkt8s').style.cursor = 'default';
  };

  return (
    <div>
      <IdleTimerProvider timeout={3000} onIdle={onIdle} onAction={onAction} />
    </div>
  );
}

// 영화 상영 시간 계산
function convertToHHMM(totalSeconds) {
  let hours;
  let minutes;
  let formattedHours;
  let formattedMinutes;
  let result;

  hours = Math.floor(totalSeconds / 60); // 시간 구하기
  minutes = Math.floor(totalSeconds % 60); // 초 구하기
  formattedHours = ('0' + hours).slice(-2); // 시간과 분을 두 자릿수로 표시
  formattedMinutes = ('0' + minutes).slice(-2); // 시간과 분을 두 자릿수로 표시

  result = formattedHours + ':' + formattedMinutes;
  return result;
}

// 영화 10초 전 후 이동
function playBackForward(
  type,
  setPlayBackForward,
  setDisableClickBack,
  setDisableClickForward,
  videoRef,
  currentPlayTime,
  setCurrentPlayTime
) {
  // currentPlayTime값을 변경하면 useEffect 의존성 때문에 timelineBarUpdate호출
  if (type == 'back') {
    if (currentPlayTime > 0) {
      videoRef.current.currentTime -= 10;
      setPlayBackForward('back');
      setDisableClickBack(true);
      setCurrentPlayTime(Math.max(0, Number(currentPlayTime - 10)));
      setTimeout(() => {
        setPlayBackForward('');
        setDisableClickBack(false);
      }, 500);
    }
  } else if (type == 'forward') {
    if (Number(currentPlayTime + 10) < videoRef.current.duration) {
      videoRef.current.currentTime += 10;
      setPlayBackForward('forward');
      setDisableClickForward(true);
      setCurrentPlayTime(Math.min(videoRef.current.duration, Number(currentPlayTime + 10)));
      setTimeout(() => {
        setPlayBackForward('');
        setDisableClickForward(false);
      }, 500);
    }
  }
}

// 음량 조절 바 생성
function movieMutedMouseOver(e) {
  const muteBtn = e.target.parentNode.parentNode;
  const soundBar = document.querySelector('.ltr-4dcwks');

  const muteBtnRect = document.getElementById('muteBtn').getBoundingClientRect();
  const soundBarRect = document.querySelector('.ltr-4dcwks').getBoundingClientRect();

  let left = Math.floor(muteBtnRect.x) + 5;
  let top = Math.floor(muteBtnRect.y - soundBarRect.height) - 10;

  if (muteBtn.classList.contains('active') == false) {
    muteBtn.className = 'active ' + muteBtn.className;
  }
  if (soundBar.classList.contains('show') == false) {
    soundBar.style.left = `${left}px`;
    soundBar.style.top = `${top}px`;
    soundBar.classList.add('show');
  }
}

function movieMutedMouseLeave(e, setShowTimeout) {
  const muteBtn = e.target.parentNode.parentNode;
  const soundBar = document.querySelector('.ltr-4dcwks');

  let showTimeout = setTimeout(() => {
    muteBtn.classList.remove('active');
    soundBar.classList.remove('show');
  }, 300);

  setShowTimeout(showTimeout);
}

function timelineBarUpdate(
  timeLineBarRef,
  videoRef,
  currentPlayTime,
  redLineRef,
  redBtnRef,
  setMovieDuration,
  movieData
) {
  // 영화 재생 시간이 업데이트될 때마다 타임라인 바를 업데이트하는 로직
  // 영화의 현재 재생 시간을 타임라인 바의 길이에 대한 비율로 변환 - (현재 재생 시간 / 전체 재생 시간) * 타임라인 바 전체 길이
  const timelineBarWidth = timeLineBarRef.current.offsetWidth;
  const movieDuration = videoRef.current.duration;
  const timelineRatio = (currentPlayTime / movieDuration) * timelineBarWidth;

  if (isNotEmpty(timeLineBarRef.current) && isNotEmpty(timeLineBarRef.current)) {
    redLineRef.current.style.width = `${timelineRatio}px`;
    redBtnRef.current.style.left = `calc(${timelineRatio}px - 0.75rem)`;
  }

  setMovieDuration(convertToHHMM(movieDuration - currentPlayTime));

  // localStorage.setItem('currentDuration', convertToHHMM(movieDuration-currentPlayTime));
  // localStorage.setItem('redLineWidth', redLineRef.current.style.width);
  // localStorage.setItem('redBtnLeft', redBtnRef.current.style.left);

  // 시청중인 영화 타임라인 바 데이터 저장
  setStorageMovieIdSeq(
    movieData[0].DOCID,
    redLineRef.current.style.width,
    redBtnRef.current.style.left,
    currentPlayTime,
    videoRef.current.duration
  );
}

function fullScreen(isFullScreen, setIsFullScreen) {
  if (isFullScreen) {
    setIsFullScreen(false);
  } else {
    setIsFullScreen(true);
  }
}

function setStorageMovieIdSeq(docId, redLineWidth, redBtnLeft, currentTime, duration) {
  localStorage.setItem(
    docId,
    JSON.stringify({
      redLineWidth: redLineWidth,
      redBtnLeft: redBtnLeft,
      currentTime: currentTime,
      duration: duration
    })
  );
}

export default Watch;
