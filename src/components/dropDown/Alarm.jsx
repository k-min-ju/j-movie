export default function AlarmDropDown() {
  return (
    <div role="menu" className="sub-menu theme-lakira">
      <div className="topbar"></div>
      <ul className="sub-menu-list">
        <li className="sub-menu-item" role="none">
          <div className="ptrack-container">
            <div className="ptrack-content">
              <ul className="notifications-container">
                <li className="notification">
                  <div className="ptrack-content">
                    <div className="image-text-notification">
                      <a
                        className="element image notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <img
                          className="title-card"
                          src="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABZM9OQV_AzE2OI71hROhPiTzW5vxf_L3dsnlfmbMsrjzULHwuyG4RtW2Qu_nIvL8kWSeT7nCBMMs8uFj19vo4Q4eonw60rx6namp3lOGjYkqFbmy_E-N3V7SY88I01kkBeLzaQQhhkKbjoI.jpg?r=64b"
                          srcSet="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABZM9OQV_AzE2OI71hROhPiTzW5vxf_L3dsnlfmbMsrjzULHwuyG4RtW2Qu_nIvL8kWSeT7nCBMMs8uFj19vo4Q4eonw60rx6namp3lOGjYkqFbmy_E-N3V7SY88I01kkBeLzaQQhhkKbjoI.jpg?r=64b 112w"
                          alt="킹더랜드"
                          sizes="112px"
                        />
                      </a>
                      <a
                        className="element text notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <div className="header">신규 콘텐츠</div>
                        <div className="body">킹더랜드</div>
                        <div className="age">
                          <span className="relative-time">4일 </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </li>
                <li className="notification">
                  <div className="ptrack-content">
                    <div className="image-text-notification">
                      <a
                        className="element image notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <img
                          className="title-card"
                          src="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABTmqM34BObZYbNqmkFJABVUUqE62TARgTJaKkiJ-DDOCtljIkpimHZ6x26OpMJSo1-nrCJcwJDv7W_DvO77nUIlCqKNi9b0IMk7ztUdpj-iEAqApwlAncNeQaCGOt1ldH-4mFfwb3nPHN5M.jpg?r=869"
                          srcSet="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABTmqM34BObZYbNqmkFJABVUUqE62TARgTJaKkiJ-DDOCtljIkpimHZ6x26OpMJSo1-nrCJcwJDv7W_DvO77nUIlCqKNi9b0IMk7ztUdpj-iEAqApwlAncNeQaCGOt1ldH-4mFfwb3nPHN5M.jpg?r=869 112w"
                          alt="마당이 있는 집"
                          sizes="112px"
                        />
                      </a>
                      <a
                        className="element text notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <div className="header">신규 콘텐츠</div>
                        <div className="body">마당이 있는 집</div>
                        <div className="age">
                          <span className="relative-time">1주 전</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </li>
                <li className="notification">
                  <div className="ptrack-content">
                    <div className="image-text-notification">
                      <a
                        className="element image notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <img
                          className="title-card"
                          src="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABfAkGwOZiC9U8eqVJEI6OWevKAA0ByiiencOc7G-HcUMtFmgIQzifTAg-TmiNPkVmyFoSw9PBjqF5oZdGfbCnp4GP7ugl05VxhrGG9_jbNn_aGpsn3HSNxRPtD4nrTcvxU0q-dk-xSYh_1Q.jpg?r=3b4"
                          srcSet="https://dnm.nflximg.net/api/v6/kvDymu0eXRyicIuSUzvRrxrm5dU/AAAABfAkGwOZiC9U8eqVJEI6OWevKAA0ByiiencOc7G-HcUMtFmgIQzifTAg-TmiNPkVmyFoSw9PBjqF5oZdGfbCnp4GP7ugl05VxhrGG9_jbNn_aGpsn3HSNxRPtD4nrTcvxU0q-dk-xSYh_1Q.jpg?r=3b4 112w"
                          alt="이번 생도 잘 부탁해"
                          sizes="112px"
                        />
                      </a>
                      <a
                        className="element text notification-link"
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                        }}
                      >
                        <div className="header">신규 콘텐츠</div>
                        <div className="body">이번 생도 잘 부탁해</div>
                        <div className="age">
                          <span className="relative-time">1주 전</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
