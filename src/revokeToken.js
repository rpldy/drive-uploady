const revokeToken = () => {
  const token = gapi.client.getToken();
  if (token) {
    self.google.accounts.oauth2.revoke(token.access_token);
    self.gapi.client.setToken(null);
  }
};

export default revokeToken;
