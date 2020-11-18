import loadGapi from "./loadGapi";
import getDriveSender from "./getDriveSender";

let gApiClientPromise;

const getDriveEnhancer = ({ gapi, gApiScriptId, clientId, scope, queryParams } = {}) => {
  gapi = gapi || window.gapi;

  gApiClientPromise = gApiClientPromise || new Promise((resolve) => {
    if (gapi) {
      resolve(true);
    } else {
      //no google api, need to load it
      loadGapi({ gApiScriptId, clientId, scope })
        .then(resolve);
    }
  });

  return (uploader) => {
    const sender = getDriveSender(gApiClientPromise, { gapi, queryParams });
    uploader.update({ send: sender.send });
    return uploader;
  };
};

export default getDriveEnhancer;
