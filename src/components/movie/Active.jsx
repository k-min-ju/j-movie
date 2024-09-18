import { useEffect, useRef, useState } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { ControlBar, TimeLineBar } from '@/components/movie/index';
import {
  chgVolumeStatus,
  convertToHHMM,
  moviePlayBtn,
  setStorageMovieIdSeq,
  timelineBarUpdate
} from '@/components/movie/common';

export default function Active(props) {
  const {
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
    isInit,
    setIsInit
  } = props;
  const [isDragging, setIsDragging] = useState(false);
  const [trickMovieTime, setTrickMovieTime] = useState(0);

  const timeLineRef = useRef(null);
  const trickImageRef = useRef(null);

  useEffect(() => {
    document.getElementById('movieTitle').innerText = movieData[0].title;
    prevTimeLineWidth.current = timeLineBarRef.current.offsetWidth;

    if (isUpdateNeed || !isPlayMovie) {
      timelineBarUpdate(timeLineBarRef, videoRef, currentPlayTime, redLineRef, redBtnRef, setMovieDuration, movieData);
      setIsUpdateNeed(false);
    }

    // 최초 로드 시 1번만 실행. 시청중인 영화 타임 라인 바 setting
    if (isInit && localStorage.getItem(movieData[0].DOCID)) {
      const watchingData = JSON.parse(localStorage.getItem(movieData[0].DOCID));
      redLineRef.current.style.width = watchingData.redLineWidth;
      redBtnRef.current.style.left = watchingData.redBtnLeft;
      videoRef.current.currentTime = watchingData.currentTime;
      setMovieDuration(convertToHHMM(watchingData.duration));
      setCurrentPlayTime(watchingData.currentTime);
    }
    setIsInit(false);
  }, []);

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
    const trickDiv = timeLineRef.current.children[1];
    trickDiv.classList.add('show');

    const trickOffsetWidth = trickDiv.offsetWidth;
    const trickMinLeft = trickOffsetWidth / 2;
    const trickMaxLeft = window.innerWidth - trickOffsetWidth / 2;
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
                  <KeyboardBackspaceIcon />
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
          ></div>
        </div>
      </div>
      <div
        className="watch-video--bottom-controls-container ltr-1jnlk6v"
        style={{ alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <div className="ltr-1qb0uev">
          <div className="ltr-1bt0omd">
            <TimeLineBar
              movieDuration={movieDuration}
              timeLinePointerMove={timeLinePointerMove}
              timeLinePointerUp={timeLinePointerUp}
              timeLinePointerDown={timeLinePointerDown}
              timeLinePointerLeave={timeLinePointerLeave}
              timeLineRef={timeLineRef}
              timeLineBarRef={timeLineBarRef}
              redLineRef={redLineRef}
              tickRef={tickRef}
              redBtnRef={redBtnRef}
              trickImageRef={trickImageRef}
            />
            <div
              className="ltr-14rufaj"
              style={{ height: '3rem', minHeight: '3rem', minWidth: '100%', width: '100%' }}
            />
            <ControlBar
              currentPlayTime={currentPlayTime}
              setCurrentPlayTime={setCurrentPlayTime}
              movieMutedClick={movieMutedClick}
              disableClickBack={disableClickBack}
              setDisableClickBack={setDisableClickBack}
              setPlayBackForward={setPlayBackForward}
              disableClickForward={disableClickForward}
              setDisableClickForward={setDisableClickForward}
              isPlayMovie={isPlayMovie}
              setIsPlayMovie={setIsPlayMovie}
              videoRef={videoRef}
              volumeStatus={volumeStatus}
              setShowTimeout={setShowTimeout}
            />
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
