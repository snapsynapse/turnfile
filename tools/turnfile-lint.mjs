#!/usr/bin/env node

/**
 * turnfile-lint.mjs — SNAP Turnfile YAML validation + schema conformance
 *
 * PRD-013 M2: Validates TURNFILE.yaml against:
 *   1. YAML strictness requirements (PRD-013 R1.1)
 *   2. JSON Schema conformance (PRD-013 R1.2)
 *   3. Semantic invariants (ownership, lease staleness, dependency ordering)
 *
 * Usage:
 *   node tools/turnfile-lint.mjs [--turnfile <path>] [--schema <path>] [--fix-hints]
 *
 * Exit codes:
 *   0 — all checks pass
 *   1 — validation errors found
 *   2 — fatal error (file not found, parse failure)
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const DEFAULT_TURNFILE = "working-session/TURNFILE.yaml";
const DEFAULT_SCHEMA = "schemas/turnfile/turnfile-v0.schema.json";

// --- Argument parsing ---

function usage() {
  console.error(
    "Usage: node tools/turnfile-lint.mjs [--turnfile <path>] [--schema <path>] [--fix-hints]",
  );
}

function parseArgs(argv) {
  const args = {
    turnfile: DEFAULT_TURNFILE,
    schema: DEFAULT_SCHEMA,
    fixHints: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--turnfile") {
      args.turnfile = argv[i + 1];
      i += 1;
    } else if (token === "--schema") {
      args.schema = argv[i + 1];
      i += 1;
    } else if (token === "--fix-hints") {
      args.fixHints = true;
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

// --- YAML strictness checks (PRD-013 R1.1) ---

function checkYamlStrictness(raw, errors, warnings) {
  const lines = raw.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // R1.1.1: No tabs for indentation
    if (/^\t/.test(line) || /^ +\t/.test(line)) {
      errors.push(`L${lineNum}: Tab character found in indentation. Use 2-space indentation only (R1.1.1).`);
    }

    // R1.1.4: No anchors/aliases
    if (/(?:^|\s)&\w/.test(line) && !line.trimStart().startsWith("#")) {
      warnings.push(`L${lineNum}: Possible YAML anchor '&' detected. Anchors/aliases are prohibited (R1.1.4).`);
    }
    if (/(?:^|\s)\*\w/.test(line) && !line.trimStart().startsWith("#")) {
      warnings.push(`L${lineNum}: Possible YAML alias '*' detected. Anchors/aliases are prohibited (R1.1.4).`);
    }

    // R1.1.5: No multi-document streams (--- as document separator)
    // Only flag if it's a bare --- on its own line (not in a comment or string)
    if (i > 0 && /^---\s*$/.test(line)) {
      errors.push(`L${lineNum}: Multi-document separator '---' found. One YAML document per Turnfile (R1.1.5).`);
    }
  }

  // R1.1.6: Check nesting depth (4 levels max for data, not counting YAML structural overhead)
  // This is approximate — we check indentation levels
  const maxIndent = lines.reduce((max, line) => {
    if (line.trim() === "" || line.trimStart().startsWith("#")) return max;
    const indent = line.match(/^(\s*)/)[1].length;
    return Math.max(max, indent);
  }, 0);

  const nestingDepth = Math.floor(maxIndent / 2);
  if (nestingDepth > 6) {
    // Allow some overhead for the YAML structure (turnfile > agents > claude > field = 4 data levels = 8 spaces)
    warnings.push(`Max indentation is ${maxIndent} spaces (~${nestingDepth} nesting levels). Consider flattening if exceeding 4 data levels (R1.1.6).`);
  }
}

// --- Schema validation ---

function validateSchema(turnfile, schemaPath, errors) {
  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  } catch (e) {
    errors.push(`Schema file not found or invalid JSON: ${schemaPath}`);
    return false;
  }

  try {
    const Ajv2020 = require("ajv/dist/2020");
    const ajv = new Ajv2020({ strict: false, allErrors: true });
    const validate = ajv.compile(schema);
    const valid = validate(turnfile);

    if (!valid) {
      for (const err of validate.errors) {
        const path = err.instancePath || "(root)";
        errors.push(`Schema: ${path} ${err.message} ${JSON.stringify(err.params)}`);
      }
    }

    return valid;
  } catch (e) {
    // Ajv not available — fall back to structural check
    console.warn("Warning: ajv not available. Running structural check only.");
    return validateStructure(turnfile, errors);
  }
}

function validateStructure(turnfile, errors) {
  let valid = true;
  const requiredTopLevel = ["turnfile", "agents", "maintainer", "coordination", "locks", "turn_queue", "messages"];
  for (const key of requiredTopLevel) {
    if (!(key in turnfile)) {
      errors.push(`Missing required top-level section: '${key}'`);
      valid = false;
    }
  }

  if (turnfile.coordination && typeof turnfile.coordination.revision !== "number") {
    errors.push("coordination.revision must be an integer");
    valid = false;
  }

  if (turnfile.locks && typeof turnfile.locks !== "object") {
    errors.push("locks must be an object");
    valid = false;
  }

  if (turnfile.turn_queue && !Array.isArray(turnfile.turn_queue)) {
    errors.push("turn_queue must be an array");
    valid = false;
  }

  if (turnfile.messages && !Array.isArray(turnfile.messages)) {
    errors.push("messages must be an array");
    valid = false;
  }

  return valid;
}

// --- Semantic invariant checks ---

function checkSemanticInvariants(turnfile, errors, warnings, fixHints) {
  const rev = turnfile.coordination?.revision;
  const tasks = turnfile.coordination?.tasks || {};
  const locks = turnfile.locks || {};
  const agents = turnfile.agents || {};
  const messages = turnfile.messages || [];

  // 1. Header revision consistency
  // (We can't check YAML comments from parsed data, but note the expectation)

  // 2. Agent current_task references a valid task
  for (const [agentId, agent] of Object.entries(agents)) {
    const instances = agent.instances && typeof agent.instances === "object" ? agent.instances : null;
    if (instances) {
      const instanceEntries = Object.entries(instances);
      if (instanceEntries.length > 3) {
        errors.push(`Agent family '${agentId}' has ${instanceEntries.length} instances; cap is at most 3.`);
      }
      const primaries = instanceEntries.filter(([, instance]) => instance?.lane_role === "primary");
      if (primaries.length !== 1) {
        errors.push(`Agent family '${agentId}' instances must have exactly one primary; found ${primaries.length}.`);
      }
      for (const [instanceId, instance] of instanceEntries) {
        const qualifiedId = `${agentId}/${instanceId}`;
        if (instance.current_task && !(instance.current_task in tasks)) {
          errors.push(`Agent instance '${qualifiedId}' references unknown task '${instance.current_task}'.`);
        }
        if (instance.current_task && instance.current_task in tasks) {
          const task = tasks[instance.current_task];
          if (task.owner !== agentId && task.owner !== qualifiedId) {
            warnings.push(`Agent instance '${qualifiedId}' current_task '${instance.current_task}' is owned by '${task.owner}'.`);
          }
          if (!["in_progress", "claimed"].includes(task.status)) {
            warnings.push(`Agent instance '${qualifiedId}' current_task '${instance.current_task}' has status '${task.status}' (expected in_progress or claimed).`);
          }
        }
      }
    }

    if (agent.current_task && !(agent.current_task in tasks)) {
      errors.push(`Agent '${agentId}' references unknown task '${agent.current_task}'.`);
      if (fixHints) {
        console.log(`  Hint: Set agents.${agentId}.current_task to null or a valid task ID.`);
      }
    }

    // Agent current_task should match a task that's in_progress or claimed and owned by them
    if (agent.current_task && agent.current_task in tasks) {
      const task = tasks[agent.current_task];
      if (task.owner !== agentId && !String(task.owner).startsWith(`${agentId}/`)) {
        warnings.push(`Agent '${agentId}' current_task '${agent.current_task}' is owned by '${task.owner}'.`);
      }
      if (!["in_progress", "claimed"].includes(task.status)) {
        warnings.push(`Agent '${agentId}' current_task '${agent.current_task}' has status '${task.status}' (expected in_progress or claimed).`);
      }
    }
  }

  // 3. Task dependency validation
  for (const [taskId, task] of Object.entries(tasks)) {
    const deps = task.depends_on || [];
    for (const dep of deps) {
      if (!(dep in tasks)) {
        errors.push(`Task '${taskId}' depends on unknown task '${dep}'.`);
      }
    }

    // If task is claimed/in_progress, all deps must be done
    if (["claimed", "in_progress"].includes(task.status)) {
      for (const dep of deps) {
        if (dep in tasks && tasks[dep].status !== "done") {
          warnings.push(`Task '${taskId}' is ${task.status} but dependency '${dep}' is '${tasks[dep].status}' (expected done).`);
        }
      }
    }

    // claim_rev / completed_rev consistency
    if (task.status === "done" && task.completed_rev === null) {
      warnings.push(`Task '${taskId}' is done but completed_rev is null.`);
    }
    if (task.status === "done" && task.claim_rev !== null && task.completed_rev !== null) {
      if (task.completed_rev < task.claim_rev) {
        errors.push(`Task '${taskId}': completed_rev (${task.completed_rev}) < claim_rev (${task.claim_rev}).`);
      }
    }
    if (task.claim_rev !== null && task.claim_rev > rev) {
      errors.push(`Task '${taskId}': claim_rev (${task.claim_rev}) exceeds coordination.revision (${rev}).`);
    }
    if (task.completed_rev !== null && task.completed_rev > rev) {
      errors.push(`Task '${taskId}': completed_rev (${task.completed_rev}) exceeds coordination.revision (${rev}).`);
    }
  }

  // 4. Lock staleness check (PRD-013 R3.3)
  for (const [lockId, lock] of Object.entries(locks)) {
    const age = rev - lock.acquired_rev;
    if (age > lock.lease_revs) {
      warnings.push(`Lock '${lockId}' is stale: age ${age} revisions > lease_revs ${lock.lease_revs}. Held by '${lock.holder}'.`);
      if (fixHints) {
        console.log(`  Hint: Remove stale lock '${lockId}' or renew by re-acquiring.`);
      }
    }

    // Lock holder must be a known agent
    if (!(lock.holder in agents) && lock.holder !== "maintainer") {
      errors.push(`Lock '${lockId}' held by unknown agent '${lock.holder}'.`);
    }
  }

  // 5. Signal ID monotonicity (SIG-NNN should be decreasing in the array = newest-first)
  if (messages.length > 1) {
    for (let i = 0; i < messages.length - 1; i++) {
      const current = messages[i];
      const next = messages[i + 1];
      if (typeof current?.id !== "string" || typeof next?.id !== "string") {
        continue;
      }
      const currentNum = parseInt(current.id.replace("SIG-", ""), 10);
      const nextNum = parseInt(next.id.replace("SIG-", ""), 10);
      if (Number.isNaN(currentNum) || Number.isNaN(nextNum)) {
        continue;
      }
      if (currentNum <= nextNum) {
        warnings.push(`Signal log: ${current.id} is not newer than ${next.id}. Expected newest-first ordering.`);
        break; // Only report once
      }
    }
  }

  // 6. Signal rev should not exceed coordination.revision
  for (const sig of messages) {
    if (!sig || typeof sig !== "object") {
      continue;
    }
    if (sig.rev > rev) {
      errors.push(`Signal '${sig.id ?? "(missing id)"}': rev (${sig.rev}) exceeds coordination.revision (${rev}).`);
    }
  }

  // 7. Exactly one active task per active agent (warning only — soft constraint)
  for (const [agentId, agent] of Object.entries(agents)) {
    if (agent.status === "active" && !agent.current_task) {
      // Check if any tasks are in_progress for this agent
      const inProgress = Object.entries(tasks).filter(
        ([, t]) => t.owner === agentId && t.status === "in_progress"
      );
      if (inProgress.length > 0) {
        warnings.push(`Agent '${agentId}' has in_progress tasks but current_task is null: ${inProgress.map(([id]) => id).join(", ")}`);
      }
    }
  }

  // 8. Duplicate task IDs (should be impossible in YAML mapping, but check anyway)
  // Already handled by YAML parsing — duplicate keys overwrite silently

  // 9. Duplicate signal IDs
  const sigIds = new Set();
  for (const sig of messages) {
    if (!sig || typeof sig.id !== "string") {
      continue;
    }
    if (sigIds.has(sig.id)) {
      errors.push(`Duplicate signal ID: ${sig.id}`);
    }
    sigIds.add(sig.id);
  }
}

// --- Main ---

function main() {
  const args = parseArgs(process.argv);

  // 1. Read raw YAML
  let raw;
  try {
    raw = fs.readFileSync(args.turnfile, "utf8");
  } catch (e) {
    console.error(`Fatal: cannot read Turnfile at ${args.turnfile}: ${e.message}`);
    process.exit(2);
  }

  // 2. Parse YAML
  let yaml;
  try {
    yaml = require("js-yaml");
  } catch (e) {
    console.error("Fatal: js-yaml not available. Install with: npm install js-yaml");
    process.exit(2);
  }

  let turnfile;
  try {
    turnfile = yaml.load(raw);
  } catch (e) {
    console.error(`Fatal: YAML parse error in ${args.turnfile}: ${e.message}`);
    process.exit(2);
  }

  if (!turnfile || typeof turnfile !== "object") {
    console.error("Fatal: Turnfile parsed to non-object value.");
    process.exit(2);
  }

  // 3. Run checks
  const errors = [];
  const warnings = [];

  console.log(`Linting: ${args.turnfile}`);
  console.log(`Schema:  ${args.schema}`);
  console.log("");

  // Phase 1: YAML strictness
  checkYamlStrictness(raw, errors, warnings);

  // Phase 2: Schema validation
  const schemaValid = validateSchema(turnfile, args.schema, errors);

  // Phase 3: Semantic invariants
  if (schemaValid) {
    checkSemanticInvariants(turnfile, errors, warnings, args.fixHints);
  } else {
    warnings.push("Semantic invariant checks skipped because schema validation failed.");
  }

  // 4. Report
  const revision = turnfile.coordination?.revision ?? "?";
  const taskCount = Object.keys(turnfile.coordination?.tasks || {}).length;
  const lockCount = Object.keys(turnfile.locks || {}).length;
  const signalCount = (turnfile.messages || []).length;
  const agentCount = Object.keys(turnfile.agents || {}).length;

  console.log(`Summary: revision=${revision}, agents=${agentCount}, tasks=${taskCount}, locks=${lockCount}, signals=${signalCount}`);
  console.log("");

  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`  \u26a0  ${w}`);
    }
    console.log("");
  }

  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`);
    for (const e of errors) {
      console.log(`  \u2717  ${e}`);
    }
    console.log("");
    console.log("LINT FAILED");
    process.exit(1);
  }

  console.log(`${schemaValid ? "Schema: PASS" : "Schema: SKIPPED (structural check only)"}`);
  console.log("LINT PASSED");
  process.exit(0);
}

main();
