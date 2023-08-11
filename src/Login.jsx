import "./LoginMain.css";
import GoogleLoginButton from './login/GoogleLogin.js';
import { GoogleOAuthProvider } from "@react-oauth/google";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {createBrowserHistory} from "history";
import googleLogOut from "./login/GoogleLogOut.js";

function Login() {

    useEffect(() => {
        // 브라우저 뒤로가기 제어
        const history = createBrowserHistory();
        const listenBackEvent = () => {
            // 뒤로가기 할 때 수행할 동작
            const url = process.env.REACT_APP_NETFLIX_URL.split("|");
            const validUrl = url.filter((url) => url == location.origin);
            const loginType = sessionStorage.getItem("loginType");
            if(loginType == 'G' && validUrl.length > 0 && (location.pathname == "/" || location.pathname == "login")) {
                // 구글 로그아웃 처리
                googleLogOut();
            }
        };

        const unlistenHistoryEvent = history.listen(({ action }) => {
            // 브라우저 뒤로가기, 앞으로가기
            if (action === "POP") {
                listenBackEvent();
            }
        });

        return window.addEventListener("popstate", unlistenHistoryEvent);
    }, []);

    useEffect( () => {
        if(localStorage.getItem('rememberId') == 'Y') {
            document.getElementById('rememberId').checked = true;
        }
        if(window.common.isNotEmpty(localStorage.getItem('loginId'))) {
            document.getElementById("loginId").value = localStorage.getItem("loginId");
        }
    }, []);

    const navigate = useNavigate();
    let [inputId, setInputId] = useState();
    let [inputPw, setInputPw] = useState();
    let [idError, setIdError] = useState(false);
    let [pwError, setPwError] = useState(false);

    // 로그인
    const doLogin = () => {
        const rememberId = document.getElementById('rememberId').checked;
        const inputId = document.getElementById("loginId");
        const inputPw = document.getElementById("passWord");

        // 로그인 정보 저장
        if(rememberId) {
            if(window.common.isEmpty(localStorage.getItem('rememberId'))) localStorage.setItem('rememberId', 'Y');
            localStorage.setItem("loginId", inputId.value);
        }
        else {
            localStorage.removeItem('rememberId');
            localStorage.removeItem("loginId");
        }

        // validation check
        if(window.common.isEmpty(inputId.value)) {
            setIdError(true);
            return false;
        }
        else {
            setIdError(false);
        }

        if(window.common.isEmpty(inputPw.value) || !(inputPw.value.length > 3 && inputPw.value.length < 61)) {
            setPwError(true);
            return false;
        }
        else {
            setPwError(false);
        }
        
        // 로그인
        if(window.common.isNotEmpty(inputId.value) && window.common.isNotEmpty(inputPw.value)) {
            sessionStorage.setItem('loginType', 'N');
            navigate('/Browse');
        }
    };

    return (
        <>
            <div className="Login-Wrapper-Background">
                <img className="Login_bg" src={process.env.PUBLIC_URL + '/login_bg.jpg'}/>
            </div>

            <div className="nfHeader login-header signupBasicHeader">
                <a href="/" className="svg-nfLogo signupBasicHeader">
                    <img className="main-logo" src={process.env.PUBLIC_URL + '/mainLogo.png'}/>
                    {/*<svg viewBox="0 0 111 30" className="svg-icon svg-icon-netflix-logo">*/}
                    {/*    <g id="netflix-logo">*/}
                    {/*        <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z" id="Fill-14"></path>*/}
                    {/*    </g>*/}
                    {/*</svg>*/}
                    <span className="screen-reader-text">Netflix 홈</span>
                </a>
            </div>

            <div className="Login-Body">
                <div>
                    <div className="Login-Content Login-Form Login-Form-Signup">
                        <div className="Login-Main">
                            <h1>로그인</h1>
                            {/*<div data-uia="error-message-container" className="ui-message-container ui-message-error" role="alert">*/}
                            {/*    <div className="ui-message-icon"></div>*/}
                            {/*    <div data-uia="text" className="ui-message-contents"><b>비밀번호를 잘못 입력하셨습니다. </b> 다시 입력하시거나 <a href="/loginHelp">비밀번호를 재설정</a>하세요.</div>*/}
                            {/*</div>*/}
                            <div className="LoginId">
                                <div>
                                    <IdInput value={inputId} setIdError={setIdError} doLogin={doLogin} />
                                    <label className="placeLabel">이메일 주소 또는 전화번호</label>
                                </div>
                                {
                                    idError ? <div id="" className="inputError" data-uia="login-field+error">정확한 이메일 주소나 전화번호를 입력하세요.</div> : null
                                }
                            </div>
                            <div className="LoginPassWord">
                                <div>
                                    <PwInput value={inputPw} setPwError={setPwError} doLogin={doLogin} />
                                    <label className="placeLabel">비밀번호</label>
                                </div>
                            </div>
                            {
                                pwError ? <div id="" className="inputError" data-uia="password-field+error">비밀번호는 4~60자 사이여야 합니다.</div> : null
                            }
                            <button className="Login-Button" type="submit" onClick={doLogin}>로그인</button>
                            <div className="LoginHelp">
                                <div className="Ui-Input Login-Remember">
                                    <input type="checkbox" className="LoginCheckbox" id="rememberId"/>
                                    <label className="Login-Remember-Label" htmlFor="rememberId">
                                        <span className="Login-Remember-Text">로그인 정보 저장</span>
                                    </label>
                                    <div className="helper"></div>
                                </div>
                                <a className="LoginHelp-Link" href="/LoginHelp">도움이 필요하신가요?</a>
                            </div>
                            <div className="Login-Api-Zone">
                                <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_KEY}>
                                    <GoogleLoginButton navigate={navigate}/>
                                </GoogleOAuthProvider>
                            </div>
                        </div>

                        {/*<div className="Login-Other" style={{display: 'hidden'}}>*/}
                        {/*    <div className="Login-Signup-Now" >회원이 아닌가요?*/}
                        {/*        <a target="_self" href="/">지금 가입하세요</a>.*/}
                        {/*    </div>*/}
                        {/*    <div className="Recaptcha-Terms-Of-Use">*/}
                        {/*        <p></p>*/}
                        {/*        <div className="Recaptcha-Terms-Of-Use-Disclosure" ></div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </>
    )
}

const IdInput = (props) => {

    const loginIdBlur = () => {
        let inputId = document.getElementById("loginId");
        if(window.common.isEmpty(inputId.value)) {
            props.setIdError(true);
        }
        else {
            props.setIdError(false);
        }
    }

    // 엔터키로 로그인
    const handleOnKeyDown = (e) => {
        if (e.key === 'Enter') {
            props.doLogin();
        }
    };

    return (
        <input id="loginId" type="text" className='LoginTextField' value={props.value} onBlur={loginIdBlur} onKeyDown={handleOnKeyDown} />
    )
}

const PwInput = (props) => {

    const loginPwBlur = () => {
        let inputPw = document.getElementById("passWord");
        if(window.common.isEmpty(inputPw.value)) {
            props.setPwError(true);
        }
        else {
            props.setPwError(false);
        }
    }

    // 엔터키로 로그인
    const handleOnKeyDown = (e) => {
        if (e.key === 'Enter') {
            props.doLogin();
        }
    };

    return (
        <input id="passWord" type="password" className='LoginTextField' value={props.value} onBlur={loginPwBlur} onKeyDown={handleOnKeyDown} />
    )
}


export default Login;