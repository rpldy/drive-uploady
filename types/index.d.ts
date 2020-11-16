import { UploadyProps } from '@rpldy/uploady';
import { UploaderEnhancer } from '@rpldy/uploader';

export interface DriveOptions {
  gapi?: unknown,
  gApiScriptId?: string,
  clientId?: string,
  scope?: string,
  queryParams?: Record<string, any>,
}

export interface DriveUploadyProps extends UploadyProps, DriveOptions {
}

export const DriveUploady: React.ComponentType<DriveUploadyProps>;

export const getDriveEnhancer: (options: DriveOptions) => UploaderEnhancer;

export const DRIVE_SENDER_TYPE: string;

export default DriveUploady;
