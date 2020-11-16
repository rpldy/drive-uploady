#!/usr/bin/env node
const assert = require("assert"),
  path = require("path"),
  fs = require("fs-extra"),
  pkg = require("../package.json");

const TYPES_FOLDER = "types",
  DEF_FILE = "index.d.ts",
  DEF_TEST_FILE = "index.test-d.ts";

const ensureTypes = () => {
  console.log(`>>> ensuring package type definitions`);

  assert.ok(pkg.types, `expect ${pkg.name} package.json types field is defined`);

  const defFile = path.join(TYPES_FOLDER, DEF_FILE),
    defFileExists = fs.existsSync(defFile);

  assert.ok(defFileExists, `expect ${pkg.name} types definition file to exist at:
        ${defFile}`);

  const defTestFile = path.join(TYPES_FOLDER, DEF_TEST_FILE),
    defTestFileExists = fs.existsSync(defTestFile) || fs.existsSync(defTestFile + "x");

  assert.ok(defTestFileExists, `expect ${pkg.name} types test file to exist at:
            ${defTestFile}(x)`);
};

ensureTypes();
