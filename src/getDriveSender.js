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

const getDriveSender = (authPromise, { queryParams }) => {
  const signInToDrive = (tokenClient) =>
    new Promise((resolve) => {
      tokenClient.requestToken((response) => {
        if (response.access_token && response.expires_in) {
          resolve(response);
        } else {
          // eslint-disable-next-line
          console.error("Encountered Auth Error ", {
            code: response.error,
            description: response.error_description,
            uri: response.error_uri,
          });

          resolve();
        }
      });
    });

  const xhrSend = getXhrSend({
    getRequestData: () => null,
    preRequestHandler: (issueRequest, items, url, options) =>
      authPromise
        .then((tokenClient) => {
          if (!tokenClient) {
            throw new Error("Uploady Drive Sender - failed to initialize gapi");
          }

          return signInToDrive(tokenClient);
        })
        .then((authResponse) => {
          let result;

          if (authResponse) {
            const token = authResponse.access_token;

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
            throw new Error("Uploady Drive Sender - authentication failure");
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
