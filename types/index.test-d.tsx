import * as React from "react";
import DriveUploady from "./index";

const MyApp: React.FC = () => <DriveUploady
    debug
    autoUpload
    queryParams={{ keepRevisionForever: true }}>
    <div>test</div>
</DriveUploady>;

const testMyApp = (): JSX.Element => {
    return <MyApp/>;
};

export {
    testMyApp,
};
