// turnfile-schema.mjs — pick the TURNFILE.yaml JSON Schema that matches a session.
//
// A session whose `turnfile.version` has major version 1 is a v1 session and is
// validated against schemas/v1/turnfile-v1.schema.json, the contract that
// CONFORMANCE.md and validate-v1-profile.mjs apply. Anything else, including a
// missing or unparseable version, falls back to schemas/turnfile/turnfile-v0.schema.json.
// The repository's own `npm run lint:turnfile` keeps its explicit v0 default.

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

export const V0_SCHEMA = "schemas/turnfile/turnfile-v0.schema.json";
export const V1_SCHEMA = "schemas/v1/turnfile-v1.schema.json";

export function schemaForTurnfile(turnfilePath, { absolute = true } = {}) {
  let rel = V0_SCHEMA;
  try {
    const yaml = require("js-yaml");
    const doc = yaml.load(fs.readFileSync(turnfilePath, "utf8"));
    const version = String(doc?.turnfile?.version ?? "");
    if (/^1\./.test(version)) rel = V1_SCHEMA;
  } catch {
    // Unreadable or invalid YAML: keep v0 so turnfile-lint reports the real error.
  }
  return absolute ? path.join(REPO_ROOT, rel) : rel;
}
