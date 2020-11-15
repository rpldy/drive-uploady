import React from "react";
import DriveUploady from "./src";
import { withKnobs } from "@storybook/addon-knobs";
import readme from "./README.md";
import UploadButton from "@rpldy/upload-button";

export const Simple = () => {

    //TODO !!!!!!!!!!!!! REMOVE CLIENT ID - MOVE TO ENV !!!!!!!!!!

    return <DriveUploady
        debug
        clientId={process.env.DRIVE_CLIENT_ID || ""}
        scopes="https://www.googleapis.com/auth/drive">
        <h2>Drive Uploady</h2>

        <UploadButton>Upload to Drive</UploadButton>
    </DriveUploady>;
};

export default {
    component: DriveUploady,
    title: "Drive Uploady",
    decorators: [withKnobs],
    parameters: {
        readme: {
            sidebar: readme,
        },
        options: {
            showPanel: true,
            //needed until storybook-readme fixes their bug - https://github.com/tuchk4/storybook-readme/issues/221
            theme: {}
        },
    },
};
