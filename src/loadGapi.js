import { GOOGLE_API, GOOGLE_GSI } from "./consts";
import loadScript from "./loadScript";

const loadGapi = ({ gApiScriptIdPrefix = "uploady-drive-", apiUrl = GOOGLE_API, gsiUrl = GOOGLE_GSI, clientId, scope, getToken }) => {
  const initAuth = () => {
    const responseCallbacks = [];

    const tokenClient = getToken ? undefined : self.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope,
      callback: (response) => {
        responseCallbacks.forEach((cb) => cb(response));
      },
    });

    const requestToken = (cb) => {
      if (getToken) {
        //external token retriever provided, use it
        getToken(cb);
      } else {
        //check if already has token
        const existingToken = self.gapi.client.getToken();

        if (existingToken?.expires_in) {
          //token not expired, we can re-use
          cb(existingToken);
        } else {
          //use own token client to retrieve new token
          responseCallbacks.splice(0, 1, cb);
          tokenClient.requestAccessToken({ prompt: "consent" });
        }
      }
    };

    //TODO: SIGNOUT
    // function handleSignoutClick() {
    //   const token = gapi.client.getToken();
    //   if (token !== null) {
    //     google.accounts.oauth2.revoke(token.access_token);
    //     gapi.client.setToken('');
    //     document.getElementById('content').innerText = '';
    //     document.getElementById('authorize_button').innerText = 'Authorize';
    //     document.getElementById('signout_button').style.visibility = 'hidden';
    //   }
    // }

    return Promise.resolve({ requestToken });
  };

  const loadAuth = () => new Promise((resolve) => {
    self.gapi.load("client", resolve);
  });

  const loadOwnGoogleApi = () => Promise.all([
    loadScript(`${gApiScriptIdPrefix}gsi`, gsiUrl),
    loadScript(`${gApiScriptIdPrefix}api`, apiUrl),
  ])
    .then(loadAuth);

  return (getToken ?
    //dont load scripts
    Promise.resolve() :
    //load google scripts
    loadOwnGoogleApi())
    .then(initAuth);
};

export default loadGapi;
