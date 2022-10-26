import loadGapi from "../loadGapi";
import getDriveSender from "../getDriveSender";
import getDriveEnhancer from "../getDriveEnhancer";

jest.mock("../loadGapi");
jest.mock("../getDriveSender");

describe("getDriveEnhancer tests", () => {
  beforeEach(() => {
    clearJestMocks(
      loadGapi,
      getDriveSender,
    );
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
