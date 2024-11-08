import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  const loginSuccess = res => {
    if (res.access_token) {
      sessionStorage.setItem('accessToken', res.access_token);
      sessionStorage.setItem('loginType', 'G');
      navigate('/Browse');
    }
  };

  const loginError = () => {
    alert('로그인 실패');
  };

  const googleSocialLogin = useGoogleLogin({
    onSuccess: loginSuccess,
    onError: loginError
  });

  return (
    <div className="social_login_box" onClick={() => googleSocialLogin()}>
      <div className="social_login_image_box">
        <img className="social_login_img" src={`${process.env.PUBLIC_URL}login_google.png`} alt="google_login" />
      </div>
      <div className="social_login_text_box">구글 로그인</div>
    </div>
  );
}
