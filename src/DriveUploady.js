import React, { useMemo } from "react";
import Uploady, { composeEnhancers } from "@rpldy/uploady";
import getDriveEnhancer from "./getDriveEnhancer";

const DriveUploady = (props) => {
  const {
    enhancer: extEnhancer,
    getToken,
    gApiScriptIdPrefix,
    clientId,
    scope,
    queryParams,
    ...uploadyProps
  } = props;

  const enhancer = useMemo(() => {
    const driveEnhancer = getDriveEnhancer({
      getToken, gApiScriptIdPrefix, clientId, scope, queryParams,
    });

    return extEnhancer ? composeEnhancers(driveEnhancer, extEnhancer) : driveEnhancer;
  }, [extEnhancer, getToken, gApiScriptIdPrefix, clientId, scope, queryParams]);

  return <Uploady {...uploadyProps} enhancer={enhancer}/>;
};

export default DriveUploady;
