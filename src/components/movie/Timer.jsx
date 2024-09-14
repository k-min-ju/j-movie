import { useState } from 'react';
import { IdleTimerProvider } from 'react-idle-timer';
import { fullScreen, moviePlayBtn } from '@/components/movie/common';

export default function Timer(props) {
  const { setStatus, isPlayMovie, setIsPlayMovie, videoRef, isFullScreen, setIsFullScreen } = props;
  const [changeTimeout, setChangeTimeout] = useState();
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
