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

  it("should load gapi with scripts", async (done) => {
    const p = loadGapi({ clientId, scope });

    const { requestToken } = await p;

    expect(mockInitTokenClient).toHaveBeenCalledWith({
      client_id: clientId,
      scope: scope,
      callback: expect.any(Function),
      error_callback: expect.any(Function),
    })

    requestToken((token) => {
      expect(token).toBe(testToken);
      done();
    });
  });

  it("should reuse token if already exists", async (done) => {
    const p = loadGapi({ clientId, scope });

    const { requestToken } = await p;

    mockGetToken.mockReturnValueOnce({
      expires_in: 123,
      access_token: "aaa",
    });

    requestToken((token) => {
      expect(token.access_token).toBe("aaa");
      done();
    });
  });

  it("should get new token if existing already expired", async (done) => {
    const p = loadGapi({ clientId, scope });

    const { requestToken } = await p;

    mockGetToken.mockReturnValueOnce({
      expires_in: 0,
      access_token: "aaa",
    });

    requestToken((token) => {
      expect(token).toBe(testToken);
      done();
    });
  });

  it("should not load gapi if script already present", async (done) => {
    const getToken = (cb) => cb("1234");

    const p = loadGapi({ getToken });

    const { requestToken } = await p;

    expect(loadScript).not.toHaveBeenCalled();

    requestToken((token) => {
      expect(token).toBe("1234");
      done();
    });
  });
});
