import { useEffect } from 'react';
import { convertToHHMM, removeWatchingData, timelineBarUpdate } from '@/components/movie/common';

export default function Video(props) {
  const {
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
        if (!timeLineBarRef.current && !isUpdateNeed) {
          setIsUpdateNeed(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlayMovie]);

  useEffect(() => {
    if (!timeLineBarRef.current) return;
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
              if (redBtnRef.current && redLineRef.current) {
                redBtnRef.current.style.left = 'calc(0px - 0.75rem)';
                redLineRef.current.style.width = '0px';
              }
              localStorage.setItem('redLineWidth', '0px');
              localStorage.setItem('redBtnLeft', 'calc(0px - 0.75rem)');

              const docId = movieData[0].DOCID;
              // 시청중인 영화 삭제
              if (docId) removeWatchingData(docId);
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
