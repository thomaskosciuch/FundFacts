import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

const App: React.FC = () => {
  const { instance, accounts, inProgress } = useMsal();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = () => {
    const thing = instance.loginRedirect();
    console.log(thing);
    console.log(accounts);
    console.log(instance);
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
      login();
    }
  }, [accounts, inProgress, instance]);

  useEffect(() => {
    console.log("accounts", accounts);
    if (accounts.length) {
      const headers = new Headers();
      headers.append("Authorization", `Bearer ${accounts[0]?.idToken}`);
      headers.append("Instance-ClientId", instance?.clientId || "");
      headers.append("Instance-Authority", instance?.authority || "");
      // Send the GET request
      fetch("http://127.0.0.1:5000/", {
        method: "GET",
        headers: headers,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response data:", data);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  }, [accessToken, instance]);

  return (
    <div className="App">
      <h1>Welcome to the App</h1>
      {accessToken ? (
        <p>
          Site Access Token: {accessToken}
          User Access Token: {accounts[0]?.idToken}
          <button onClick={login}>Log In</button>
        </p>
      ) : (
        <button onClick={login}>Log In</button>
      )}
    </div>
  );
};

export default App;
