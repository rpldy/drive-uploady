<p align="center">
    <img src="https://res.cloudinary.com/yoavniran/image/upload/v1605473499/drive-uploady-logo_ymcfcm.png" width="300" alt='react-uploady Logo' aria-label='react-uploady' />   
</p>

# Drive Uploady

Provides a custom [React Uploady](https://github.com/rpldy/react-uploady) for uploading to Google Drive.
All Uploady functionality such as [hooks](https://github.com/rpldy/react-uploady/tree/master/packages/ui/uploady#hooks) and components (ex: [Upload-Preview](https://github.com/rpldy/react-uploady/blob/master/packages/ui/upload-preview)) can be used with this package.

Uploads are sent to the multipart endpoint: [Google Drive docs](https://developers.google.com/drive/api/v3/manage-uploads#multipart). 

> Note: no support for URL based uploads, only files.

## Installation

```shell
#Yarn: 
   $ yarn add drive-uploady

#NPM:
   $ npm i drive-uploady
``` 

## Props

| Name (* = mandatory)                      | Type          | Default       | Description  
| --------------                            | ------------- | ------------- | -------------
| clientId* (unless gapi instance provided) | string        |               | The API client Id. Obtained from the [Google dev console](https://console.developers.google.com/)              
| scopes* (unless gapi instance provided)   | string        |               | The scopes your app requires ([Drive docs](https://developers.google.com/drive/api/v2/about-auth))
| folder                                    | string        |               | The parent folder to upload the file to
| gApiScriptId                              | string        | "uploady-drive-api" | The id of the script tag (loading google api) that will be added to the page 
| gapi                                      |               |               | provide the Google API instance directly to be used
| queryParams                              | Object        |               | [Optional query parameters](https://developers.google.com/drive/api/v3/reference/files/create#parameters)

All other Uploady props can be passed as well. See docs [here](https://github.com/rpldy/react-uploady/tree/master/packages/ui/uploady#props).

> Note: no support for concurrent > 1


## Example

```javascript
import React from "react";
import DriveUploady from "drive-uploady";
import UploadButton from "@rpldy/upload-button";

export const App = () => {

    return <DriveUploady        
            clientId="<my-client-id>"
            scope="https://www.googleapis.com/auth/drive.file"
           >
              <h2>Drive Uploady</h2>

            <UploadButton>Upload to Drive</UploadButton>
        </DriveUploady>;
};

```

### Upload to folder

```javascript
import React from "react";
import DriveUploady from "drive-uploady";
import UploadButton from "@rpldy/upload-button";

export const App = () => {

    return <DriveUploady        
          clientId="<my-client-id>"
          scope="https://www.googleapis.com/auth/drive.file"
          params={{ parents: ["folder-id"] }}
        >
          <h2>Drive Uploady</h2>

          <UploadButton>Upload to Drive</UploadButton>
      </DriveUploady>;
};

```


### Use own GAPI instance

Drive-Uploady will try and use an existing `window.gapi` instance if its available.
If not, it will create a new one (by adding a script tag).

In case you already have a GAPI client running in your page/app that's not available on the window, 
you can pass it as a prop:

```javascript
import React from "react";
import DriveUploady from "drive-uploady";
import UploadButton from "@rpldy/upload-button";

export const App = () => {

    return <DriveUploady        
          clientId="<my-client-id>"
          scope="https://www.googleapis.com/auth/drive.file"
          gapi={window.parent.gapi}
        >
          <h2>Drive Uploady</h2>

          <UploadButton>Upload to Drive</UploadButton>
      </DriveUploady>;
};

```

