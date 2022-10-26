import React from "react";
import UploadButton from "@rpldy/upload-button";
import { useItemStartListener, useItemFinishListener } from "@rpldy/uploady";
import DriveUploady, { revokeToken } from "../src";
import loadScript from "../src/loadScript";
import { GOOGLE_API, GOOGLE_GSI } from "../src/consts";

import readme from "../README.md";

const UploadyActionLogger = ({ onItemStart, onItemFinish }) => {
  useItemStartListener(onItemStart);
  useItemFinishListener(onItemFinish);

  return null;
};

export const Simple = ({ clientId, scope, folder, onItemStart, onItemFinish }) => {
  clientId = clientId || process.env.DRIVE_CLIENT_ID || "";

  return <DriveUploady
    debug
    clientId={clientId}
    scope={scope}
    params={{ parents: folder ? [folder] : undefined }}
  >
    <h2>Drive Uploady</h2>

    <UploadButton>Upload to Drive</UploadButton>
    <br/>
    <button style={{ marginTop: "20px" }} onClick={revokeToken}>Revoke Token</button>

    <UploadyActionLogger onItemStart={onItemStart} onItemFinish={onItemFinish}/>
  </DriveUploady>;
};

Simple.args = {
  clientId: "",
  scope: "https://www.googleapis.com/auth/drive.file",
  folder: "",
};

export const ExternalAuth = ({ clientId, scope, folder, onItemStart, onItemFinish }) => {
  clientId = clientId || process.env.DRIVE_CLIENT_ID || "";

  if (self.gapi) {
    throw new Error("Reload the page so GAPI isnt loaded");
  }

  const getToken = (cb) => {
    //do the entire loading and auth logic here -
    const existingToken = self.gapi?.client.getToken();

    if (existingToken?.expires_in) {
      cb(existingToken);
    } else {
      Promise.all([
        loadScript(`gsi`, GOOGLE_GSI),
        loadScript(`api`, GOOGLE_API),
      ]).then(() => {
        self.gapi.load("client", () => {
          const tokenClient = self.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope,
            callback: cb,
            error_callback: (result) => cb({
              error: result.type,
              error_description: result.message,
            }),
          });

          tokenClient.requestAccessToken({ prompt: "consent" });
        });
      });
    }
  };

  return <DriveUploady
    debug
    getToken={getToken}
    params={{ parents: folder ? [folder] : undefined }}
  >
    <h2>Drive Uploady</h2>

    <UploadButton>Upload to Drive</UploadButton>

    <UploadyActionLogger onItemStart={onItemStart} onItemFinish={onItemFinish}/>
  </DriveUploady>;
};

ExternalAuth.args = {
  clientId: "",
  scope: "https://www.googleapis.com/auth/drive.file",
  folder: "",
};

export default {
  component: DriveUploady,
  title: "Drive Uploady",
  parameters: {
    docs: {
      description: { component: readme },
    },
  },
  argTypes: {
    clientId: { description: "The API client Id. Obtained from the Google dev console" },
    scope: { description: "The scope your app requires" },
    folder: { description: "G-Drive Folder ID (not a Prop!)" },
    onItemStart: { action: "item start" },
    onItemFinish: { action: "item finish" },
  },
};
