import Forward10Icon from '@mui/icons-material/Forward10';

export default function PlayForward() {
  return (
    <div
      className="playback-notification playback-notification--forward-10"
      data-uia="watch-video-notification-forward-10"
    >
      <div className="playback-notification-background" />
      <div className="playback-notification-icon large ltr-1evcx25" role="presentation">
        <Forward10Icon />
      </div>
    </div>
  );
}
