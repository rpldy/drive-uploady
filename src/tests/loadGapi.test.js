/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "asyncCheckToken"] }] */
import loadGapi from "../loadGapi";
import loadScript from "../loadScript";

jest.mock("../loadScript");

describe("loadGapi tests", () => {
  const clientId = "1234",
    scope = "drive.file",
    testToken = "token123";

  const mockGetToken = jest.fn();

  const testGapi = {
    load: jest.fn((type, cb) => cb()),
    client: {
      getToken: mockGetToken,
    },
  };

  const mockInitTokenClient = jest.fn(({ callback }) => ({
    requestAccessToken: () => {
      callback(testToken);
    },
  }));

  window.gapi = testGapi;

  window.google = {
    accounts: {
      oauth2: {
        initTokenClient: mockInitTokenClient,
      },
    },
  };

  beforeAll(() => {
    loadScript.mockResolvedValue();
  });

  afterEach(() => {
    clearJestMocks(
      testGapi.load,
      mockGetToken,
      loadScript,
    );
  });

  const asyncCheckToken = (requestToken, expected) => new Promise((resolve) => {
    requestToken((token) => {
      expect(token).toBe(expected);
      resolve();
    });
  });

  it("should load gapi with scripts", async () => {
    const p = loadGapi({ clientId, scope });

    const { requestToken } = await p;

    expect(mockInitTokenClient).toHaveBeenCalledWith({
      client_id: clientId,
      scope: scope,
      callback: expect.any(Function),
      error_callback: expect.any(Function),
    });

    await asyncCheckToken(requestToken, testToken);
  });

  it("should reuse token if already exists", async () => {
    const p = loadGapi({ clientId, scope });

    const { requestToken } = await p;

    const token = {
      expires_in: 123,
      access_token: "aaa",
    };

    mockGetToken.mockReturnValueOnce(token);

    await asyncCheckToken(requestToken, token);
  });

  it("should get new token if existing already expired", async () => {
    const p = loadGapi({ clientId, scope });

    const { requestToken } = await p;

    mockGetToken.mockReturnValueOnce({
      expires_in: 0,
      access_token: "aaa",
    });

    await asyncCheckToken(requestToken, testToken);
  });

  it("should not load gapi if script already present", async () => {
    const getToken = (cb) => cb("1234");

    const p = loadGapi({ getToken });

    const { requestToken } = await p;

    expect(loadScript).not.toHaveBeenCalled();

    await asyncCheckToken(requestToken, "1234");
  });
});
