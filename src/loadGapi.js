import { GOOGLE_API, DRIVE_DOC } from "./consts";

export const GLOBAL_LOAD_METHOD = "_uploadyOnGapiLoaded";

const loadGapi = ({ gApiScriptId = "uploady-drive-api", apiUrl = GOOGLE_API, clientId, scope }) => {

  const loadScript = () => new Promise((resolve) => {
    if (!document.getElementById(gApiScriptId)) {
      window[GLOBAL_LOAD_METHOD] = () => {
        //clean up
        window[GLOBAL_LOAD_METHOD] = undefined;
        resolve();
      };

      const script = document.createElement("script");
      script.id = gApiScriptId;
      script.src = apiUrl + `?onload=${GLOBAL_LOAD_METHOD}`;
      document.head.appendChild(script);
    } else {
      resolve();
    }
  });

  const initAuth = () => {
    return window.gapi.client.init({
      clientId,
      scope: scope,
      discoveryDocs: [DRIVE_DOC],
    })
      .then(() => true)
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
        return false;
      });
  };

  const loadAuth = () => new Promise((resolve) =>
    window.gapi.load("client:auth2", resolve));

  return loadScript()
    .then(loadAuth)
    .then(initAuth);
};

export default loadGapi;
