import * as React from 'react';
import DriveUploady, { AuthToken, GetTokenMethod } from './index';

const MyApp: React.FC = () => <DriveUploady
  debug
  autoUpload
  queryParams={{ keepRevisionForever: true }}>
  <div>test</div>
</DriveUploady>;

const testMyApp = (): JSX.Element => {
  return <MyApp/>;
};

const getToken: GetTokenMethod = (cb) => {
  // @ts-ignore
  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: 'MY-CLIENT_ID',
    scope: 'MY-SCOPE',
    callback: (response: AuthToken) => {
      cb(response);
    },
  });

  tokenClient.requestAccessToken({ prompt: 'consent' });
};

export const GetTokenApp = () => {
  return <DriveUploady
    getToken={getToken}
  >
    <h2>Drive Uploady</h2>
  </DriveUploady>;
};

const testMyAppWithGetToken = (): JSX.Element => {
  return <GetTokenApp/>;
};

export {
  testMyApp,
  testMyAppWithGetToken,
};
