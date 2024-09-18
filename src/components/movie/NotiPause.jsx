import { Pause } from '@/components/icon';

export default function NotiPause() {
  return (
    <div className="playback-notification playback-notification--pause" data-uia="watch-video-notification-pause">
      <div className="playback-notification-background" />
      <div className="playback-notification-icon large ltr-1evcx25" role="presentation">
        <Pause />
      </div>
    </div>
  );
}
