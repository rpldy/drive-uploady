import React, { useMemo } from "react";
import Uploady, { composeEnhancers } from "@rpldy/uploady";
import getDriveEnhancer from "./getDriveEnhancer";

const DriveUploady = (props) => {
    const {
        enhancer: extEnhancer,
        gapi,
        dontLoadGapi,
        gApiScriptId,
        clientId,
        scopes,
        ...uploadyProps
    } = props;

    const enhancer = useMemo(() => {
        const driveEnhancer = getDriveEnhancer({
            gapi, dontLoadGapi, gApiScriptId, clientId, scopes
        });

        return extEnhancer ? composeEnhancers(driveEnhancer, extEnhancer) : driveEnhancer;
    }, [extEnhancer, gapi, dontLoadGapi, gApiScriptId, clientId, scopes]);

    return <Uploady {...uploadyProps} enhancer={enhancer}/>;
};

export default DriveUploady;
