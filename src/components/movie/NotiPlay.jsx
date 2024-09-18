import { PlayArrow } from '@/components/icon';

export default function NotiPlay() {
  return (
    <div className="playback-notification playback-notification--play" data-uia="watch-video-notification-play">
      <div className="playback-notification-background" />
      <div className="playback-notification-icon large ltr-1evcx25" role="presentation">
        <PlayArrow />
      </div>
    </div>
  );
}
