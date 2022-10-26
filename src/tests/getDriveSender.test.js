import { getXhrSend } from "@rpldy/sender";
import { DRIVE_UPLOAD_URL_MULTI } from "../consts";
import getDriveSender from "../getDriveSender";

jest.mock("@rpldy/sender");

describe("getDriveSender tests", () => {
  beforeEach(() => {
    clearJestMocks(getXhrSend);
  });

  it("should send file with drive sender", async () => {
    const token = "1234";
    const authP = Promise.resolve({
      requestToken: (cb) => cb({
        access_token: token,
        expires_in: 100,
      }),
    });

    const { send } = getDriveSender(authP, { queryParams: { foo: "bar" } });

    expect(send).toBeDefined();

    const issueRequest = jest.fn(() => "success");

    const items = [{
      id: "i1",
      file: {
        name: "test1",
        type: "image/jpeg",
      },
    }];

    const result = await getXhrSend.mock.calls[0][0].preRequestHandler(issueRequest, items, "", {});

    expect(result).toBe("success");

    expect(issueRequest.mock.calls[0][0]).toBe(`${DRIVE_UPLOAD_URL_MULTI}&foo=bar`);
    expect(issueRequest.mock.calls[0][2].headers["Authorization"]).toBe(`Bearer ${token}`);
    expect(issueRequest.mock.calls[0][1].get("metadata").type).toBe("application/json");
    expect(issueRequest.mock.calls[0][1].get("file")).toBeDefined();
  });

  it("should throw error if not valid token", async () => {
    const authP = Promise.resolve({
      requestToken: (cb) => cb({
        access_token: "token",
        expires_in: 0,
      }),
    });

    getDriveSender(authP, { queryParams: { foo: "bar" } });

    await expect(getXhrSend.mock.calls[0][0].preRequestHandler())
      .rejects.toThrow("Uploady Drive Sender - authentication failure");
  });
});
