#!/usr/bin/env node
// tools/validate-tkab-results.mjs — validate active TKAB pair and result JSON artifacts.

import fs from "node:fs";
import path from "node:path";

const TKAB_OUTCOMES = new Set([
  "win-conformant",
  "l1-plain-success",
  "fail-unparseable",
  "fail-source-authority-conflict",
  "fail-unsupported-causation",
  "fail-illegal-derivation",
  "fail-three-repairs",
  "fail-grammar",
  "fail-misparse",
  "fail-no-plain-exit",
  "fail-mixed-exit",
  "fail-declared-level-mismatch",
  "indeterminate",
]);

function usage() {
  console.error("Usage: node tools/validate-tkab-results.mjs [--root <dir>] [--format <json|text>]");
}

function parseArgs(argv) {
  const args = { root: ".", format: "text" };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--root") {
      args.root = argv[i + 1];
      i += 1;
    } else if (token === "--format") {
      args.format = argv[i + 1];
      i += 1;
    } else if (token === "--help" || token === "-h") {
      usage();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${token}`);
      usage();
      process.exit(2);
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv);
  let searchDir = path.join(args.root, "working-session/tokenese-pairs");
  if (!fs.existsSync(searchDir)) {
    searchDir = path.join(args.root, "tokenese-pairs");
  }

  if (!fs.existsSync(searchDir)) {
    if (args.format === "json") {
      console.log(JSON.stringify({ ok: true, checked: 0, note: "Directory not found" }));
    } else {
      console.log("No tokenese-pairs directory found. Checked: 0");
    }
    process.exit(0);
  }

  const files = fs.readdirSync(searchDir);
  const pairs = files.filter((f) => f.endsWith(".pair.json"));
  const errors = [];

  for (const pairFile of pairs) {
    const pairPath = path.join(searchDir, pairFile);
    const resultFile = pairFile.replace(/\.pair\.json$/, ".result.json");
    const resultPath = path.join(searchDir, resultFile);

    if (!fs.existsSync(resultPath)) {
      errors.push(`Missing matching result JSON for pair: ${pairFile}`);
      continue;
    }

    let pair, result;
    try {
      pair = JSON.parse(fs.readFileSync(pairPath, "utf8"));
      result = JSON.parse(fs.readFileSync(resultPath, "utf8"));
    } catch (err) {
      errors.push(`JSON parse error in ${pairFile} or ${resultFile}: ${err.message}`);
      continue;
    }

    // 1. Result fields must match pair
    const fieldsToMatch = ["source_id", "clone_id", "direction", "author", "artifact_type"];
    for (const field of fieldsToMatch) {
      if (pair[field] !== result[field]) {
        errors.push(`Mismatch in field '${field}' for ${pairFile} vs ${resultFile}: '${pair[field]}' !== '${result[field]}'`);
      }
    }

    // 2. Result schema is tkab-check-1.1 or explicitly allowed
    if (!result.schema_version || !result.schema_version.startsWith("tkab-check-")) {
      errors.push(`Invalid schema_version in ${resultFile}: '${result.schema_version}'`);
    }

    // 3. Provenance checks
    if (!result.provenance || !result.provenance.grammar_version_supported || !result.provenance.grammar_version_detected) {
      errors.push(`Missing provenance grammar version support/detection in ${resultFile}`);
    }

    // 4. Frameset validation checks (if claiming v0.3/v0.3.2 scoring)
    if (!result.frameset_validation) {
      if (result.arm !== "W2" && result.arm !== "W5") {
        errors.push(`Missing frameset_validation in ${resultFile}`);
      }
    } else if (
      result.frameset_validation.status !== "report-only" &&
      result.frameset_validation.status !== "experimental-report-only"
    ) {
      errors.push(`frameset_validation status in ${resultFile} must be report-only or experimental-report-only: '${result.frameset_validation.status}'`);
    }

    // 5. Verbatim text preservation
    if (pair.source_text !== result.source_text) {
      errors.push(`Verbatim source_text mismatch in ${pairFile} vs ${resultFile}`);
    }
    if (pair.clone_text !== result.clone_text) {
      errors.push(`Verbatim clone_text mismatch in ${pairFile} vs ${resultFile}`);
    }

    // 6. Outcome enumeration
    if (!TKAB_OUTCOMES.has(result.outcome)) {
      errors.push(`Invalid outcome in ${resultFile}: '${result.outcome}'`);
    }

    // 7. Token counts check
    if (result.token_counts) {
      const checkCounts = (obj, name) => {
        if (obj) {
          if (obj.o200k !== undefined && typeof obj.o200k !== "number") {
            errors.push(`Invalid o200k count in ${resultFile} ${name}`);
          }
          if (obj.anthropic !== undefined && typeof obj.anthropic !== "number") {
            errors.push(`Invalid anthropic count in ${resultFile} ${name}`);
          }
        }
      };
      checkCounts(result.token_counts.source, "source");
      checkCounts(result.token_counts.clone, "clone");
    }
  }

  if (errors.length > 0) {
    if (args.format === "json") {
      console.log(JSON.stringify({ ok: false, errors }));
    } else {
      console.error(`Validation failed with ${errors.length} errors:`);
      for (const err of errors) {
        console.error(`  - ${err}`);
      }
    }
    process.exit(1);
  }

  if (args.format === "json") {
    console.log(JSON.stringify({ ok: true, checked: pairs.length, msg: `Checked ${pairs.length} TKAB pairs in tokenese-pairs/` }));
  } else {
    console.log(`TKAB results validation passed. Checked ${pairs.length} TKAB pairs in tokenese-pairs/`);
  }
}

main();
