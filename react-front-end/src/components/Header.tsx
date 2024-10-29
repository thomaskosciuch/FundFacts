import React from "react";
import { useAccessToken } from "../hooks/useAuthentication";

const Header: React.FC = () => {
  const { instance, accounts } = useAccessToken();

  return (
    <header className="header">
      <h1>Excellerate your Fund Facts</h1>
      <div className="auth-buttons">
        {accounts.length > 0 ? (
          <button onClick={() => instance.logoutRedirect()}>Log Out</button>
        ) : (
          <button onClick={() => instance.loginRedirect()}>Log In</button>
        )}
      </div>
    </header>
  );
};

export default Header;
