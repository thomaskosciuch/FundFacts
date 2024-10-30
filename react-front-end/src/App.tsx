import React, { useState } from "react";
import { useAccessToken } from "./hooks/useAuthentication";
import Header from "./components/Header";
import Authorization from "./hooks/useAuthorization";
import ExcelUploader from "./components/ExcelUploader";

const App: React.FC = () => {
  const { accounts } = useAccessToken();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  return (
    <div className="App">
      <Header />
      <Authorization
        accessToken={accounts[0]?.idToken ?? null}
        setIsAuthorized={setIsAuthorized}
      />
      <div>
        {accounts[0] ? <p>You are logged in</p> : <p>You are not logged in</p>}
        {isAuthorized !== null &&
          (isAuthorized ? (
            <p>You are authorized</p>
          ) : (
            <p>You are not authorized</p>
          ))}
      </div>
      {accounts[0] ? <ExcelUploader /> : <p></p>}
    </div>
  );
};

export default App;
