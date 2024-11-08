import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLoginButton, LoginForm } from '@/components/login';
import '@/style/loginMain.css';

function Login() {
  return (
    <>
      <div className="Login-Wrapper-Background">
        <img className="Login_bg" src={process.env.PUBLIC_URL + '/login_bg.jpg'} alt="login_bg" />
      </div>

      <div className="nfHeader login-header signupBasicHeader">
        <a href="/public" className="svg-nfLogo signupBasicHeader">
          <img className="main-logo" src={process.env.PUBLIC_URL + '/mainLogo.png'} />
          <span className="screen-reader-text">Netflix 홈</span>
        </a>
      </div>

      <div className="Login-Body">
        <div>
          <div className="Login-Content Login-Form Login-Form-Signup">
            <div className="Login-Main">
              <LoginForm />
              <div className="Login-Api-Zone">
                <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_KEY}>
                  <GoogleLoginButton />
                </GoogleOAuthProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
