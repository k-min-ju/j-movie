export default function TimeLineBar({
  movieDuration,
  timeLinePointerMove,
  timeLinePointerUp,
  timeLinePointerDown,
  timeLinePointerLeave,
  timeLineRef,
  timeLineBarRef,
  redLineRef,
  tickRef,
  redBtnRef,
  trickImageRef
}) {
  return (
    <div className="ltr-14rufaj" style={{ alignItems: 'normal', justifyContent: 'normal' }}>
      <div
        className="ltr-1jnlk6v"
        style={{ alignItems: 'center', flexGrow: '1', justifyContent: 'normal' }}
        onPointerMove={timeLinePointerMove}
        onPointerUp={timeLinePointerUp}
        onPointerDown={timeLinePointerDown}
        onPointerLeave={timeLinePointerLeave}
      >
        <div
          ref={timeLineRef}
          aria-orientation="horizontal"
          className="medium ltr-uykqh0"
          data-uia="timeline"
          role="slider"
          tabIndex="-1"
        >
          <div ref={timeLineBarRef} data-uia="timeline-bar" className="ltr-yzurhj">
            <div className="ltr-1jssjem" />
            <div ref={redLineRef} className="ltr-1xfifdu" />
            <div ref={tickRef} className="ltr-ai5t3i" />
            <div
              ref={redBtnRef}
              aria-label="재생 시간 표시줄"
              aria-valuemax="6520208"
              className="ltr-1gidbvb"
              style={{ left: 'calc(0px - 0.75rem)' }}
            ></div>
          </div>

          <div className="ltr-1kex6ih">
            <div className="ltr-f9fjby">
              <div className="medium ltr-l5iwyw" data-uia="trick-play">
                <div data-uia="trick-play-image">
                  <img ref={trickImageRef} src="" />
                </div>
                <div className="trick-play-text" data-uia="trick-play-text">
                  00:00
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ltr-vpjz8w" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <span className="ltr-13tzgng" id="movieDuration">
          {movieDuration}
        </span>
      </div>
    </div>
  );
}
