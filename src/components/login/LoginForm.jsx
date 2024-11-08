import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import '@/style/loginMain.css';

export default function LoginForm() {
  const navigate = useNavigate();

  const rememberIdRef = useRef(null);
  const [inputId, setInputId] = useState('test');
  const [inputPw, setInputPw] = useState('1234');
  const [idError, setIdError] = useState(false);
  const [pwError, setPwError] = useState(false);

  // 로그인
  const doLogin = () => {
    const rememberId = rememberIdRef.current.checked;

    // 로그인 정보 저장
    if (rememberId) {
      if (!localStorage.getItem('rememberId')) localStorage.setItem('rememberId', 'Y');
      localStorage.setItem('loginId', inputId);
    } else {
      localStorage.removeItem('rememberId');
      localStorage.removeItem('loginId');
    }

    if (!inputId) {
      setIdError(true);
      return false;
    } else setIdError(false);

    if (!inputPw || !(inputPw.length > 3 && inputPw.length < 61)) {
      setPwError(true);
      return false;
    } else setPwError(true);

    // 로그인
    if (inputId && inputPw) {
      sessionStorage.setItem('loginType', 'N');
      navigate('/Browse');
    }
  };

  const handleIdChange = event => setInputId(event.target.value);

  const handleIdKeyDown = event => event.key === 'Enter' && doLogin();

  const handleIdBlur = () => !inputId && setIdError(true);

  const handlePwChange = event => setInputPw(event.target.value);

  const handlePwKeyDown = event => event.key === 'Enter' && doLogin();

  const handlePwBlur = () => !inputPw && setPwError(true);

  useEffect(() => {
    if (localStorage.getItem('rememberId') === 'Y') rememberIdRef.current.checked = true;
    if (localStorage.getItem('loginId')) setInputId(localStorage.getItem('loginId'));
  }, []);

  return (
    <>
      <h1>로그인</h1>
      <div className="LoginId">
        <div>
          <input
            className="LoginTextField"
            type="text"
            value={inputId}
            onBlur={handleIdBlur}
            onKeyDown={handleIdKeyDown}
            onChange={handleIdChange}
          />
          <label className="placeLabel">이메일 주소 또는 전화번호</label>
        </div>
        {idError ? (
          <div id="" className="inputError" data-uia="login-field+error">
            정확한 이메일 주소나 전화번호를 입력하세요.
          </div>
        ) : null}
      </div>
      <div className="LoginPassWord">
        <div>
          <input
            className="LoginTextField"
            type="password"
            value={inputPw}
            onBlur={handlePwBlur}
            onKeyDown={handlePwKeyDown}
            onChange={handlePwChange}
          />
          <label className="placeLabel">비밀번호</label>
        </div>
      </div>
      {pwError ? (
        <div id="" className="inputError" data-uia="password-field+error">
          비밀번호는 4~60자 사이여야 합니다.
        </div>
      ) : null}
      <button className="Login-Button" type="submit" onClick={doLogin}>
        로그인
      </button>
      <div className="LoginHelp">
        <div className="Ui-Input Login-Remember">
          <input type="checkbox" className="LoginCheckbox" id="rememberId" ref={rememberIdRef} />
          <label className="Login-Remember-Label" htmlFor="rememberId">
            <span className="Login-Remember-Text">로그인 정보 저장</span>
          </label>
          <div className="helper"></div>
        </div>
        <a className="LoginHelp-Link" href="/LoginHelp">
          도움이 필요하신가요?
        </a>
      </div>
    </>
  );
}
