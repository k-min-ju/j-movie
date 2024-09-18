import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { convertToHHMM, KMDBMovieAPI, volumeSvg } from '@/components/movie/common';
import '@/Browse.css';
import {
  Active,
  Loading,
  NotiPause,
  NotiPlay,
  Passive,
  PlayBack,
  PlayForward,
  SoundBar,
  Timer,
  Video
} from '@/components/movie';

function Watch() {
  const { movieId, movieSeq, movieVal } = useParams();
  const navigate = useNavigate();

  const { getKMDBMovieOne } = KMDBMovieAPI();

  const [status, setStatus] = useState('loading'); // loading : 로딩바 표시, active : 영화 상단, 하단 UI표시, passive : 영화 중지 상태일 때 영화에 대한 설명 표시
  const [isPlayMovie, setIsPlayMovie] = useState(false);
  const [movieData, setMovieData] = useState();
  const [volumeStatus, setVolumeStatus] = useState();
  const [playBackForward, setPlayBackForward] = useState();
  const [showTimeout, setShowTimeout] = useState();
  const [disableClickBack, setDisableClickBack] = useState(false);
  const [disableClickForward, setDisableClickForward] = useState(false);
  const [movieDuration, setMovieDuration] = useState(0);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [isUpdateNeed, setIsUpdateNeed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isInit, setIsInit] = useState(true);

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
    if (!localStorage.getItem('movieMuted')) {
      localStorage.setItem('movieMuted', 'OFF');
    }
    // 음량 기본값 설정
    if (!localStorage.getItem('movieVolume')) {
      localStorage.setItem('movieVolume', '0.5');
    }

    getKMDBMovieOne(movieId, movieSeq).then(response => {
      const movieData = response.Data[0].Result;
      setMovieData(movieData);
      document.querySelector('.ltr-omkt8s').classList.replace('inactive', 'active');

      // 영화 상영
      setTimeout(() => {
        setStatus('active');
        setIsPlayMovie(true);
        setMovieDuration(convertToHHMM(videoRef.current.duration));

        document.querySelector('.ltr-1212o1j').style = 'display: block;';
        videoRef.current.play();
        if (localStorage.getItem('movieMuted') === 'ON') {
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
          if (localStorage.getItem('knobTop')) {
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
            {status === 'loading' ? (
              <Loading />
            ) : (
              <Timer
                setStatus={setStatus}
                isPlayMovie={isPlayMovie}
                setIsPlayMovie={setIsPlayMovie}
                videoRef={videoRef}
                isFullScreen={isFullScreen}
                setIsFullScreen={setIsFullScreen}
              />
            )}
            <div className="uma" id="uma" role="region"></div>
            <div className="inactive ltr-omkt8s" tabIndex="0">
              {
                // 영화
                movieData !== null && movieData !== '' ? (
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
                status === 'active' ? (
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
                    isInit={isInit}
                    setIsInit={setIsInit}
                  />
                ) : status === 'passive' && isPlayMovie === false ? (
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

          {playBackForward === 'back' ? <PlayBack /> : playBackForward === 'forward' ? <PlayForward /> : null}
        </div>
      </div>
    </div>
  );
}

export default Watch;
