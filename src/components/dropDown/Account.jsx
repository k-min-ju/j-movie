import { storageClear } from '@/common';

export default function AccountDropDown() {
  const doLogout = () => {
    storageClear();
    location.href = '/login';
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
