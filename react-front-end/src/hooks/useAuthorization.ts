import React, { useEffect } from "react";
import { backendUrl } from "../constants";

interface AuthorizationProps {
  accessToken: string | null;
  setIsAuthorized: (isAuthorized: boolean | null) => void;
}

const Authorization: React.FC<AuthorizationProps> = ({ accessToken, setIsAuthorized }) => {
  useEffect(() => {
    const checkAuthorization = async () => {
      if (accessToken) {
        console.log(`Bearer ${accessToken}`)
        try {
          const response = await fetch(`${backendUrl}/authorization/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.status === 200) {
            console.log('is ok')
            setIsAuthorized(true);
          } else {
            console.log('is not ok - other status')
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error("Fetch error:", error);
          setIsAuthorized(false);
        }
      } else {
        console.log('no auth')
        setIsAuthorized(null);
      }
    };

    checkAuthorization();
  }, [accessToken, setIsAuthorized]);

  return null;
};

export default Authorization;
