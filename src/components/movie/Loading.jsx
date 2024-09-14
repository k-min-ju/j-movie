import { ClipLoader } from 'react-spinners';

export default function Loading() {
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
