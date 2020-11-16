import { GOOGLE_API, DRIVE_DOC } from "./consts";

const loadGapi = ({ gApiScriptId = "uploady-drive-api", apiUrl = GOOGLE_API, clientId, scope }) => {

  const loadScript = () => new Promise((resolve) => {
    if (!document.getElementById(gApiScriptId)) {
      const script = document.createElement("script");
      script.id = gApiScriptId;
      script.src = apiUrl;
      script.addEventListener("load", resolve);
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
      .then(() => {
        return true;
      })
      .catch((err) => {
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
