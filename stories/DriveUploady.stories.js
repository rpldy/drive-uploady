import React from "react";
import UploadButton from "@rpldy/upload-button";
import { useItemStartListener, useItemFinishListener } from "@rpldy/uploady";
import DriveUploady from "../src";

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

    <UploadyActionLogger onItemStart={onItemStart} onItemFinish={onItemFinish}/>
  </DriveUploady>;
};

Simple.args = {
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
    folder: { description: "G-Drive Folder ID (not a Prop!)"},
    onItemStart: { action: "item start" },
    onItemFinish: { action: "item finish" },
  },
};
