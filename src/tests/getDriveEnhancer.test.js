describe("getDriveEnhancer tests", () => {
  let loadGapi, getDriveSender, getDriveEnhancer;

  beforeEach(() => {
    jest.resetModules();
    jest.doMock("../loadGapi", () => jest.fn());
    jest.doMock("../getDriveSender", () => jest.fn());

    loadGapi = require("../loadGapi");
    getDriveSender = require("../getDriveSender");
    getDriveEnhancer = require("../getDriveEnhancer").default;

    clearJestMocks(
      loadGapi,
      getDriveSender,
    );
  });

  it("should accept external gapi", async () => {

    const gapi = {};
    const uploader = { update: jest.fn() };
    getDriveSender.mockReturnValueOnce({ send: "send" });

    const enhancer = getDriveEnhancer({ gapi });

    enhancer(uploader);

    const gApiClientPromise = getDriveSender.mock.calls[0][0];
    const result = await gApiClientPromise;

    expect(uploader.update).toHaveBeenCalledWith({ send: "send" });
    expect(result).toBe(true);
    expect(loadGapi).not.toHaveBeenCalled();
  });

  it("should load gapi internally", async () => {
    const options = { gApiScriptId: "sid", clientId: "cid", scope: "scope" };
    const uploader = { update: jest.fn() };
    getDriveSender.mockReturnValueOnce({ send: "send" });
    loadGapi.mockResolvedValueOnce(true);
    const enhancer = getDriveEnhancer(options);

    enhancer(uploader);

    const gApiClientPromise = getDriveSender.mock.calls[0][0];
    const result = await gApiClientPromise;

    expect(uploader.update).toHaveBeenCalledWith({ send: "send" });
    expect(result).toBe(true);
    expect(loadGapi).toHaveBeenCalledWith(options);
  });

});
