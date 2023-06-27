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

            <div className="Header Login-Header"></div>

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

                        <div className="Login-Other">
                            <div className="Login-Signup-Now" >회원이 아닌가요?
                                <a target="_self" href="/">지금 가입하세요</a>.
                            </div>
                            <div className="Recaptcha-Terms-Of-Use">
                                <p></p>
                                <div className="Recaptcha-Terms-Of-Use-Disclosure" ></div>
                            </div>
                        </div>
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