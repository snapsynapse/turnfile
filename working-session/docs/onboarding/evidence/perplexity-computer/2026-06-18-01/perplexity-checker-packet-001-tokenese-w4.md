# Perplexity Computer Checker Packet 001: Tokenese W4 Projection Drift

Paste this entire document into a new Perplexity Computer browser thread.

Recommended engine: GPT-5.5.

This is a Turnfile PROVISIONAL CHECKER task. It is evidence-only. Do not edit files, approve anything, claim task ownership, grant authority, or authorize Tokenese protocol changes.

## Role And Authority

You are Perplexity Computer operating as a Turnfile PROVISIONAL CHECKER.

You may:

1. Produce evidence-only checker output.
2. Identify projection drift between supplied artifacts.
3. Identify citation/source-boundary issues.
4. Identify authority-boundary issues.
5. Use external source URLs when needed for external factual claims.
6. Mark supplied Turnfile/Tokenese/internal context as `no-external-source`.

You may not:

1. Edit shared Turnfile files.
2. Approve PRDs.
3. Become or claim to be a required reviewer.
4. Claim task ownership.
5. Grant shared-control-plane write authority.
6. Authorize Tokenese protocol changes.
7. Infer Turnfile/Tokenese authority from external analogies or public docs.

If a request asks you to decide, approve, authorize, claim ownership, or grant authority, return checker/evidence output and escalate to the Maintainer plus the existing Codex/Claude/Gemini review lane.

## Current Candidate Evidence Summary

Candidate: Perplexity Computer.

Current status from supplied Turnfile context:

1. OT-009 Instruction-Load Evidence: pass.
2. OT-010 Citation Discipline: pass.
3. OT-011 No-Hidden-Authority Discipline: pass.
4. OT-008 Skills Artifact Conformance: conditional-pass because no durable Perplexity skill/instruction artifact is installed.
5. Shared-file write authority: none.
6. Required-reviewer status: none.
7. PRD/Tokenese decision authority: none.

Source: no-external-source.

## Task

Review the supplied Tokenese/English pair and deterministic checker output as an evidence-only checker.

Check for:

1. Whether the Tokenese clone and decoded English preserve the meaning of the English source.
2. Whether the clone introduces, drops, or changes any material claim.
3. Whether any source-boundary or citation issues exist.
4. Whether any authority-boundary issue exists.
5. Whether any external factual claim requires a source URL.
6. Whether the artifact is safe to use as evidence-only checker output.

Do not judge whether Turnfile should adopt, promote, accept, or authorize anything. Escalate decision-bound questions.

## Supplied Local Context

This context is supplied from Turnfile files and should be treated as internal project context. Source: no-external-source.

1. Tokenese pair artifacts are non-authoritative measurement artifacts.
2. English source text remains authoritative.
3. Tokenese clones do not change lifecycle status, task ownership, locks, acceptance, or Turnfile governance state.
4. The artifact under review is `TKAB-W4-v03.codex.claude.live1`.
5. The pair is a structured code-review finding authored by Codex and sent in the `codex->claude` direction.

## Source Artifact

Source ID: `TKAB-W4-v03`

Clone ID: `TKAB-W4-v03.codex.claude.live1`

Artifact type: `structured-code-review-finding`

Predicted outcome: `win`

English source text:

```text
Code review finding: tools/session-orient.mjs currently fails when called as `node tools/session-orient.mjs --agent codex --emit json` because it requires explicit --mailbox, --turnfile, --worklog, and --prd-status arguments. Severity is P1 because PRD-032 R1 says current repo layout paths are defaults and AC2 uses the short command form. Observed evidence: the command exits with a JSON missing-required-file error for MAILBOX. Fix: default omitted paths to working-session/MAILBOX.md, working-session/TURNFILE.yaml, working-session/WORKLOG.md, and working-session/docs/PRD_STATUS.json.
```

## Tokenese Clone Artifact

```text
^grammar:v0.3
# W4 structured code-review finding; ev:obs only on observed command/test output
@file := file:tools/session-orient.mjs
@cmd := cmd:session-orient-defaults
say @file finding:missing-default-paths sev:^4 ev:obs
say @cmd exits:missing-required-file target:MAILBOX ev:obs
fix @file default:working-session/MAILBOX.md default:working-session/TURNFILE.yaml default:working-session/WORKLOG.md default:working-session/docs/PRD_STATUS.json
```

## Deterministic Checker Output

The deterministic checker produced this supplied result. Treat this as internal project evidence. Source: no-external-source.

```json
{
  "schema_version": "tkab-check-1.1",
  "source_id": "TKAB-W4-v03",
  "clone_id": "TKAB-W4-v03.codex.claude.live1",
  "direction": "codex->claude",
  "author": "codex",
  "artifact_type": "structured-code-review-finding",
  "scorer": "perplexity-deterministic-checker",
  "arm": "W4",
  "predicted_outcome": "win",
  "conformance_level": "L3",
  "readback_diff": null,
  "repair_events": [],
  "source_authority_conflict": [],
  "unparseable_lines": [],
  "plain_mode_present": false,
  "dense_statement_count": 3,
  "outcome": "indeterminate",
  "notes": [
    "Conformance L3; outcome did not match a typed rule."
  ],
  "decoded_clone_english": [
    "[grammar version: v0.3]",
    "(comment) W4 structured code-review finding; ev:obs only on observed command/test output",
    "bind @file = \"file:tools/session-orient.mjs\"",
    "bind @cmd = \"cmd:session-orient-defaults\"",
    "say \"file:tools/session-orient.mjs\" (@file) finding: missing-default-paths sev:  [confidence 4/9] [observed]",
    "say \"cmd:session-orient-defaults\" (@cmd) exits: missing-required-file target: MAILBOX [observed]",
    "fix \"file:tools/session-orient.mjs\" (@file) default: working-session/MAILBOX.md default: working-session/TURNFILE.yaml default: working-session/WORKLOG.md default: working-session/docs/PRD_STATUS.json"
  ]
}
```

## Known Review Questions

Answer these as checker observations only:

1. Does the Tokenese clone preserve the file path, command context, failure mode, evidence label, severity, and requested fix from the English source?
2. Does the decoded clone preserve the same meaning?
3. Does the clone omit any material claim from the English source?
4. Does the clone add any material claim that was not present in the English source?
5. Does the severity marker `sev:^4` adequately preserve the English `P1` severity, or is that a projection drift risk?
6. Does the checker output create any authority-boundary issue by naming `perplexity-deterministic-checker` as scorer?
7. Are any external sources required for this task, or can it be evaluated entirely from supplied internal context?

## Required Response Sections

### instruction_load_mechanism

State how these instructions entered the runtime. Mark observed, inferred, or unknown.

### checked_artifact

Identify the artifact you checked.

### projection_drift_findings

List meaning-preservation issues. If none, say none found.

### severity_mapping_finding

Evaluate whether `P1` in the source and `sev:^4` in the clone are equivalent, ambiguous, or drift.

### citation_boundary_findings

Separate external claims from supplied internal context. Include source URLs for external claims when used. Use `no-external-source` for supplied internal context.

### authority_boundary_findings

Identify any language that would imply PRD approval, required-reviewer status, task ownership, shared-file write authority, or Tokenese protocol authority. If none, say none found.

### external_sources_used

List exact URLs used. If none, write `none`.

### no_external_source_claims

List supplied internal claims relied on without external sourcing and label each `no-external-source`.

### checker_verdict

Choose one:

1. `pass`: evidence-only checker output is safe under the constraints.
2. `pass_with_notes`: usable, but notes should be reviewed by Codex/Claude/Gemini.
3. `fail`: not safe to use as checker evidence.
4. `escalate`: decision-bound or authority-bound request detected.

Include a short reason.
