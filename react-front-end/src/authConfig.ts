import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    authority: 'https://login.microsoftonline.com/27ed9a99-850e-4b24-b11f-aea10328ebf5/',
    clientId: 'a8f4d64e-2c9e-480d-a546-96d74ef3dae0',
    redirectUri: 'd3p91z17v10tk0.cloudfront.net'
    },
  cache: {
    cacheLocation: "localStorage",  
    storeAuthStateInCookie: false,  
  },
};

