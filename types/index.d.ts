import { UploadyProps } from "@rpldy/uploady";
import { UploaderEnhancer } from "@rpldy/uploader";

export type AuthToken = {
  access_token: string;
  expires_in: number;
};

export type GetTokenMethod = (cb: (token: AuthToken) => void) => void;

export interface DriveOptions {
  getToken?: GetTokenMethod;
  gApiScriptIdPrefix?: string;
  clientId?: string;
  scope?: string;
  queryParams?: Record<string, any>;
}

export interface DriveUploadyProps extends UploadyProps, DriveOptions {
}

export const DriveUploady: React.ComponentType<DriveUploadyProps>;

export const getDriveEnhancer: (options: DriveOptions) => UploaderEnhancer;

export const DRIVE_SENDER_TYPE: string;

export default DriveUploady;
