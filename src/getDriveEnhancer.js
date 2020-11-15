import loadGapi from "./loadGapi";
import getDriveSender from "./getDriveSender";

const getDriveEnhancer = ({ gapi, dontLoadGapi, gApiScriptId, clientId, scopes  }) => {
    gapi = gapi || window.gapi;

    const gApiClientPromise = new Promise((resolve) => {
        if (gapi) {
            resolve(true);
        } else if (!dontLoadGapi) {
            //no google api loaded, need to load it
            loadGapi({ gApiScriptId, clientId, scopes })
                .then(resolve);
        }
    });

    return (uploader) => {
        const sender = getDriveSender(gApiClientPromise, { gapi });
        uploader.update({ send: sender.send });
        return uploader;
    };
};

export default getDriveEnhancer;
