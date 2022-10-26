
<p align="center">
    <a href="https://badge.fury.io/js/drive-uploady">
        <img src="https://badge.fury.io/js/drive-uploady.svg" alt="npm version" height="20"></a>
    <a href="LICENSE.md">
       <img src="https://img.shields.io/github/license/rpldy/drive-uploady?color=blue&style=plastic" alt="MIT License"/>
    </a>
    <a href="CODE_OF_CONDUCT.md">
       <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg"/> 
    </a>    
</p>


<p align="center">
    <img src="https://res.cloudinary.com/yoavniran/image/upload/v1605473499/drive-uploady-logo_ymcfcm.png" width="300" alt='react-uploady Logo' aria-label='react-uploady' />   
</p>

# Drive Uploady

Provides a custom [React Uploady](https://react-uploady.org) provider for uploading to Google Drive.
All Uploady functionality such as [hooks](https://react-uploady.org/docs/category/hooks/) and components (ex: [Upload-Preview](https://react-uploady.org/docs/api/components/uploadPreview/)) can be used with this package.

Uploads are sent to the multipart endpoint: [Google Drive docs](https://developers.google.com/drive/api/v3/manage-uploads#multipart). 

> Note: no support for URL based uploads, only files.

## Installation

```shell
#Yarn:  
   $ yarn add drive-uploady @rpldy/uploady

#NPM:
   $ npm i drive-uploady @rpldy/uploady
``` 

## Props

| Name (* = mandatory)                    | Type                              | Default            | Description                                                                                               |
|-----------------------------------------|-----------------------------------|--------------------|-----------------------------------------------------------------------------------------------------------|
| clientId* (unless getToken is provided) | string                            |                    | The API client Id. Obtained from the [Google dev console](https://console.developers.google.com/)         |              
| scopes* (unless getToken is provided)   | string                            |                    | The scopes your app requires ([Drive docs](https://developers.google.com/drive/api/v2/about-auth))        |
| gApiScriptIdPrefix                      | string                            | "uploady-drive-"   | The id of the script tag (loading google api) that will be added to the page                              |
| getToken                                | [GetTokenMethod](#gettokenmethod) |                    | provide a function that will provide the (access) token                                                   |
| queryParams                             | Object                            |                    | [Optional query parameters](https://developers.google.com/drive/api/v3/reference/files/create#parameters) |

All other Uploady props can be passed as well. See docs [here](https://react-uploady.org/docs/api/#props).

> Note: no support for concurrent > 1

## Example

```javascript
import React from "react";
import DriveUploady from "drive-uploady";
import UploadButton from "@rpldy/upload-button";

export const App = () => {
  return (
    <DriveUploady
      clientId="<my-client-id>"
      scope="https://www.googleapis.com/auth/drive.file"
    >
      <h2>Drive Uploady</h2>

      <UploadButton>Upload to Drive</UploadButton>
    </DriveUploady>
  );
};
```

### Upload to folder

```javascript
import React from "react";
import DriveUploady from "drive-uploady";
import UploadButton from "@rpldy/upload-button";

export const App = () => {
  return (
    <DriveUploady
      clientId="<my-client-id>"
      scope="https://www.googleapis.com/auth/drive.file"
      params={{ parents: ["folder-id"] }}
    >
      <h2>Drive Uploady</h2>

      <UploadButton>Upload to Drive</UploadButton>
    </DriveUploady>
  );
};

```

## Authentication

By default, Drive-Uploady will load and use its own Google Authentication Provider. 
The process involves loading the scripts from Google:

1. https://apis.google.com/js/api.js
2. https://accounts.google.com/gsi/client

> Note: Using two scripts is due to Google's [deprecation decision](https://developers.googleblog.com/2022/03/gis-jsweb-authz-migration.html).

Once the scripts are loaded. Internally, a [TokenClient](https://developers.google.com/identity/oauth2/web/reference/js-reference#TokenClient) will be created (_google.accounts.oauth2.initTokenClient_) and will be used in order
to retrieve an access token for the user. 

The user will be shown a pop-up through which they can sign-in (if not already) and approve the application to access their Drive. 

> The application (created in the [API Console](https://console.cloud.google.com/)) must have the right scope (ex: https://www.googleapis.com/auth/drive.file).

As long as the page isn't refreshed and the token is still valid, the user will not be prompted to approve again when uploading additional files.
In case the token is expired, the user will be prompted again.

## Own Authentication

In case you are already implementing your own use of the oauth flow with Google. 
Drive-Uploady let's you pass in a _getToken_ method as a prop that will be used to retrieve the access token when needed.

All scripts and authentication will be assumed to have been loaded and set up separately from Drive-Uploady.

### GetTokenMethod

```typescript
export type AuthToken = {
  access_token: string;
  expires_in: number;
};

export type GetTokenMethod = (cb: (token: AuthToken) => void) => void;
```

Example use of getToken() implementation:  

```javascript
import React from "react";
import DriveUploady from "drive-uploady";
import UploadButton from "@rpldy/upload-button";

const getToken = (cb) => {
  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: "MY-CLIENT_ID",
    scope: "MY-SCOPE",
    callback: (response) => {
      cb(response);
    },
  });

  tokenClient.requestAccessToken({ prompt: "consent" });
};

export const App = () => {
  return (
    <DriveUploady
      getToken={getToken}
    >
      <h2>Drive Uploady</h2>

      <UploadButton>Upload to Drive</UploadButton>
    </DriveUploady>
  );
};
```

## Revoke Token

The library provides a utility function to revoke the token previously retrieved on the page:

```javascript
import { revokeToken } from "drive-uploady";

const RevokeButton = () => {
	return (
    <button onClick={revokeToken}>Revoke Token</button>
  );
};
```
