import React from "react";
import getDriveEnhancer from "../getDriveEnhancer";
import DriveUploady from "../DriveUploady";

jest.mock("@rpldy/uploady", () => "uploady");
jest.mock("../getDriveEnhancer", () => jest.fn());

describe("<DriveUploady> tests", () => {

  it("should render DriveUploady successfully", () => {
    const enhancer = "enhancer";
    getDriveEnhancer.mockReturnValueOnce(enhancer);
    const wrapper = shallow(<DriveUploady autoUpload={false} queryParams="params"/>);

    const uploady = wrapper.find("uploady");

    expect(uploady).toHaveLength(1);

    expect(uploady.props().enhancer).toBe(enhancer);
    expect(uploady).toHaveProp("autoUpload", false);
  });
});
