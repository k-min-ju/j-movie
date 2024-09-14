import { googleLogOut } from '@/common';

export default function AccountDropDown() {
  const doLogout = () => {
    const loginType = sessionStorage.getItem('loginType');
    switch (loginType) {
      case 'G':
        googleLogOut();
        location.href = '/login';
        break;
      case 'N':
        sessionStorage.removeItem('loginType');
        location.href = '/login';
        break;
      default:
        sessionStorage.removeItem('loginType');
        location.href = '/login';
        break;
    }
  };

  return (
    <>
      <div className="account-drop-down sub-menu theme-lakira">
        <div className="ptrack-content">
          <div className="topbar"></div>
          <ul className="sub-menu-list sign-out-links">
            <li className="sub-menu-item">
              <a className="sub-menu-link" onClick={doLogout}>
                J MOVIE에서 로그아웃
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
