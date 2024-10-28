import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const App: React.FC = () => {
  const { instance, accounts, inProgress } = useMsal();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = () => {
    instance.loginRedirect();
  };

  useEffect(() => {
    if (accounts.length > 0 && inProgress === "none") {
      const request = {
        account: accounts[0],
        scopes: ["User.Read"],
      };

      instance
        .acquireTokenSilent(request)
        .then((response) => {
          setAccessToken(response.accessToken);
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect(request);
          }
        });
    } else if (accounts.length === 0 && inProgress === "none") {
      login(); // Automatically trigger login if no accounts found
    }
  }, [accounts, inProgress, instance]);

  return (
    <div className="App">
      <h1>Welcome to the App</h1>
      {accessToken ? (
        <p>Access Token: {accessToken}</p>
      ) : (
        <button onClick={login}>Log In</button>
      )}
    </div>
  );
};

export default App;
