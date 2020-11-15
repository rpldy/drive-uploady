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
| scopes* (unless gapi instance provided)   | string        |               |
| folder                                    | string        |               | The parent folder to upload the file to
| gApiScriptId                              | string        | "uploady-drive-api" |
| dontLoadGapi                              | boolean       | false         |
| gapi                                      |               |               |
| query params                              | Object        |               | [Optional query parameters](https://developers.google.com/drive/api/v3/reference/files/create#parameters)

All other Uploady props can be passed as well. See docs [here](https://github.com/rpldy/react-uploady/tree/master/packages/ui/uploady#props).

> Note: no support for concurrent > 1


## Example


```javascript
import React from "react";
import DriveUploady from "drive-uploady";
import UploadButton from "@rpldy/upload-button";

export const Simple = () => {

    return <DriveUploady        
        clientId="<my-client-id>"
        scopes="https://www.googleapis.com/auth/drive">
        <h2>Drive Uploady</h2>

        <UploadButton>Upload to Drive</UploadButton>
    </DriveUploady>;
};

```

### use own GAPI instance

In case you already have a GAPI client running in your page/app. You can tell Drive-Uploady not to create one.
It will then use the instance found on the window object.

