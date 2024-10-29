import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export const useAccessToken = () => {
  const { instance, accounts, inProgress } = useMsal();
  const [accessToken, setAccessToken] = useState<string | null>(null);

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
    }
  }, [accounts, inProgress, instance]); // Removed the false from dependencies

  return { accessToken, instance, accounts };
};

