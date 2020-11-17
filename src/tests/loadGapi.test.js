import loadGapi, { GLOBAL_LOAD_METHOD } from "../loadGapi";

describe("loadGapi tests", () => {
  const clientId = "1234",
    scope = "drive.file";

  const testGapi = {
    load: jest.fn((type, cb) => cb()),
    client: {
      init: jest.fn(() => Promise.resolve()),
    },
  };

  window.gapi = testGapi

  beforeEach(() => {
    clearJestMocks(
      testGapi.load,
      testGapi.client.init,
    )
  });

  it("should load gapi with script", async () => {

    const p = loadGapi({ clientId, scope });

    window[GLOBAL_LOAD_METHOD]();

    const result = await p;

    expect(result).toBe(true);
    expect(window[GLOBAL_LOAD_METHOD]).toBeUndefined();
    expect(window.gapi.client.init).toHaveBeenCalledWith(expect.objectContaining({
      clientId,
      scope,
    }));
  });

  it("should not load gapi if script already present", async () => {
    const gApiScriptId = "gapi-script";

    const s = document.createElement("script");
    s.id = gApiScriptId;
    document.head.appendChild(s);

    const result = await loadGapi({ gApiScriptId, clientId, scope });

    expect(document.getElementById(gApiScriptId).src).toBe("");
    expect(window[GLOBAL_LOAD_METHOD]).toBeUndefined();
    expect(result).toBe(true);

    expect(window.gapi.client.init).toHaveBeenCalledWith(expect.objectContaining({
      clientId,
      scope,
    }));
  });
});
