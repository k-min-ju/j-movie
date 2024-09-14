// 음량 조절 게이지 컴포넌트
import { useEffect, useState } from 'react';
import { volumeSvg } from '@/components/movie/common';

export default function SoundBar(props) {
  const { showTimeout, ariaValueRef, railRef, knobRef, videoRef, prevRailHeight, setVolumeStatus } = props;
  const [isDragging, setIsDragging] = useState(false);

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

  useEffect(() => {
    prevRailHeight.current = railRef.current.offsetHeight;
  }, [railRef.current]);

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
