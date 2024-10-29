import React, { useEffect } from "react";

interface AuthorizationProps {
  accessToken: string | null;
  setIsAuthorized: (isAuthorized: boolean | null) => void;
}

const Authorization: React.FC<AuthorizationProps> = ({ accessToken, setIsAuthorized }) => {
  useEffect(() => {
    const checkAuthorization = async () => {
      if (accessToken) {
        try {
          const response = await fetch("http://127.0.0.1:5000/authorization", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.status === 200) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error("Fetch error:", error);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(null);
      }
    };

    checkAuthorization();
  }, [accessToken, setIsAuthorized]);

  return null;
};

export default Authorization;
