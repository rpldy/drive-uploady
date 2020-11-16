import React from "react";

import {
  Description,
} from "@storybook/addon-docs/blocks";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  docs: {
    page: () => <>
      <Description/>
    </>,
  },
};
