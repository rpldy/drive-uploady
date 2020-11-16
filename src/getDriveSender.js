import { getXhrSend } from "@rpldy/sender";
import { DRIVE_SENDER_TYPE, DRIVE_UPLOAD_URL_MULTI } from "./consts";

const validateItems = (items) => {
  if (items.length > 1) {
    throw new Error("Uploady Drive Sender - only 1 file can be uploaded per request (use concurrent = 1)");
  }

  if (!items[0].file) {
    throw new Error("Uploady Drive Sender - uploaded item must be file");
  }
};

const getUploadUrl = (queryParams) => {
  const paramsString = queryParams &&
    Object.entries(queryParams)
      .map(([key, val]) => `${key}=${val}`)
      .join("&");

  return `${DRIVE_UPLOAD_URL_MULTI}${paramsString ? "&" + paramsString : ""}`;
};

const getDriveSender = (authPromise, { gapi: extGapi, queryParams }) => {
  const getGapi = () => extGapi || self.gapi;

  const signInToDrive = () => {
    const gapi = getGapi();

    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();

    return isSignedIn ?
      Promise.resolve(true) :
      new Promise((resolve) => {
        gapi.auth2.getAuthInstance().isSignedIn
          .listen(resolve);

        gapi.auth2.getAuthInstance().signIn();
      });
  };

  const xhrSend = getXhrSend({
    getRequestData: () => null,
    preRequestHandler: (issueRequest, items, url, options) => authPromise
      .then((isInit) => {
        if (!isInit) {
          throw new Error("Uploady Drive Sender - failed to initialize gapi");
        }

        return signInToDrive();
      })
      .then((isSignedIn) => {
        let result;

        const gapi = getGapi();

        if (isSignedIn) {
          const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;

          const metadata = JSON.stringify({
            name: items[0].file.name,
            mimeType: items[0].file.type,
            ...options.params,
          });

          const requestData = new FormData();
          requestData.append("metadata", new Blob([metadata], { type: "application/json" }));
          requestData.append("file", items[0].file);

          //return result of issueRequest to ensure sender has the upload XHR
          result = issueRequest(getUploadUrl(queryParams), requestData, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
        } else {
          throw new Error("Uploady Drive Sender - not authenticated failure");
        }

        return result;
      }),
  });

  const send = (items, url, sendOptions, onProgress) => {
    validateItems(items);

    const sendResult = xhrSend(items, "dummy", sendOptions, onProgress);

    sendResult.senderType = DRIVE_SENDER_TYPE;

    return sendResult;
  };

  return {
    send,
  };
};

export default getDriveSender;
