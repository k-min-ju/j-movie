import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import { movieMutedMouseLeave, movieMutedMouseOver, moviePlayBtn, playBackForward } from '@/components/movie/common';
import { Pause, PlayArrow } from '@/components/icon';
import { Volume } from '@/components/movie/index';

export default function ControlBar({
  currentPlayTime,
  setCurrentPlayTime,
  movieMutedClick,
  disableClickBack,
  setDisableClickBack,
  setPlayBackForward,
  disableClickForward,
  setDisableClickForward,
  isPlayMovie,
  setIsPlayMovie,
  videoRef,
  volumeStatus,
  setShowTimeout
}) {
  return (
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
                {isPlayMovie ? <Pause /> : <PlayArrow />}
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
                <Replay10Icon />
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
                <Forward10Icon />
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
                <Volume volumeStatus={volumeStatus} />
              </div>
            </button>
          </div>
        </div>
        <div className="ltr-vf5me0" style={{ alignItems: 'normal', flexGrow: '1', justifyContent: 'normal' }}>
          <div className="ltr-14rufaj" style={{ minWidth: '3rem', width: '3rem' }} />
          <div className="ltr-17qz7j2" style={{ alignItems: 'normal', flexGrow: '1', justifyContent: 'normal' }}>
            <div className="medium ltr-er76rf" id="movieTitle" />
          </div>
        </div>
      </div>
    </div>
  );
}
