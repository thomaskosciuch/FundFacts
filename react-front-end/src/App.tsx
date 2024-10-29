// App.tsx
import React, { useState } from "react";
import { useAccessToken } from "./hooks/useAuthentication";
import Header from "./components/Header";
import Authorization from "./hooks/useAuthorization";

const App: React.FC = () => {
  const { accessToken } = useAccessToken();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  return (
    <div className="App">
      <Header />
      <Authorization
        accessToken={accessToken}
        setIsAuthorized={setIsAuthorized}
      />{" "}
      <div>
        {accessToken ? <p>You are logged in</p> : <p>You are not logged in</p>}
        {isAuthorized !== null && (
          <p>
            {isAuthorized ? (
              <div>You are authorized</div>
            ) : (
              <div>You are not authorized</div>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
