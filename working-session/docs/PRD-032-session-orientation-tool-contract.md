# PRD-032: Session Orientation Tool Contract

Status: Draft
Owner: Codex proposer; Claude reviewer; Maintainer decision pending
Date: 2026-06-17

## Input Provenance Tags

1. `explicit`: Maintainer asked for recommendations from session lessons and then asked Codex to draft the recommended PRD.
2. `derived`: Session 16 repeatedly required the same file-first orientation sequence before any reliable current-state claim: `MAILBOX.md`, `TURNFILE.yaml`, `WORKLOG.md`, `PRD_STATUS.json`, git state, relevant PRDs, and relevant validators.
3. `derived`: PRD-030 R9 makes Turnfile project files authoritative session memory and model/platform/thread memory non-authoritative cache.
4. `derived`: PRD-029 already provides fresh ID/count derivation through `tools/next-state.mjs`, but it does not summarize the whole orientation read set.
5. `derived`: PRD-031 Phase 1 adds shard-derived coordination views, increasing the need for one deterministic orientation surface that reports whether an aggregate is current, stale, or derived.

## Problem

Agents currently perform session orientation manually. The same checks are repeated with ad hoc shell reads:

1. Current unread mailbox counts.
2. Current Turnfile revision and max signal id.
3. Top WORKLOG status.
4. PRD registry state for the task being discussed.
5. Git dirty state and peer-owned changes.
6. Relevant validator status.
7. Open review or handoff messages that affect the next action.

This manual sequence works, but it is error-prone. Session 16 had multiple stale-state hazards: status text lagged behind Claude review, tool argument forms were misremembered, and concurrent edits changed the ground truth between reads. The protocol rule is already clear: files win. The missing piece is a standard read-only tool that performs the orientation read set consistently and emits a compact report agents can quote before acting.

## Goal

1. Define a deterministic `tools/session-orient.mjs` command for current-state orientation.
2. Make the file-first read set executable and repeatable.
3. Give agents one standard current-state summary before assertions, mailbox work, PRD routing, closeout, or heartbeat no-op reports.
4. Preserve Turnfile's thin-governance design: the tool reads and reports; it does not decide, mutate, or become protocol authority.
5. Make stale aggregate and projection conditions visible early, before a shared-file edit.

## Non-goals

1. Replacing `tools/next-state.mjs`. Orientation may call or embed the same derivation logic, but `next-state` remains the write-window derivation tool.
2. Replacing validators. Orientation can report validator command outcomes or stale/unknown status, but validation tools remain separate.
3. Creating a daemon, heartbeat, or live monitor.
4. Inferring state from model, platform, thread, or automation memory.
5. Making aggregate views authoritative after PRD-031. The tool reports source and freshness; it does not change the source of truth.

## Requirements

## R1. Command shape

The repo gains a read-only command:

```bash
node tools/session-orient.mjs \
  --mailbox working-session/MAILBOX.md \
  --turnfile working-session/TURNFILE.yaml \
  --worklog working-session/WORKLOG.md \
  --prd-status working-session/docs/PRD_STATUS.json \
  [--agent codex] \
  [--task <task-id>] \
  [--prd PRD-032] \
  [--emit human|json]
```

Defaults match the current repo layout. `--emit human` is concise and Maintainer-readable. `--emit json` is stable for evals, heartbeats, and future tooling.

## R2. Read-only behavior

1. The tool must not write files.
2. The tool must not stage, commit, push, fetch, or call the network.
3. The tool may inspect git status through local read-only commands.
4. The tool exits nonzero only when required input files are missing, malformed, or unreadable. Stale state is reported as a finding, not a process failure unless a `--strict` option is later added.

## R3. Orientation report contents

The report includes:

1. File freshness receipt: absolute paths, hashes, Turnfile revision, max signal id, max message sequence by date.
2. Inbox snapshot: unread count, oldest unread, and whether the selected agent has unread work.
3. Open own-action cards for the selected agent.
4. Top WORKLOG status block summary.
5. Selected task state when `--task` is provided.
6. Selected PRD registry state when `--prd` is provided.
7. Git status summary: branch, dirty paths, and a separate list of files outside the selected agent's expected ownership if detectable.
8. Projection freshness: whether `MAILBOX.json` matches `MAILBOX.md` and whether Turnfile header revision matches `coordination.revision`.
9. Validator quick status when cheap and local: mailbox invariants, Turnfile lint, PRD promotion registry validity. Expensive or task-specific evals are listed as recommended commands, not run by default.

## R4. Human output contract

The human output must be short enough to paste into a turn update:

1. Current revision and next derived IDs.
2. Selected agent unread count.
3. Blocking findings.
4. Current next owner if derivable from unread cards or task status.
5. Recommended next validation commands.

It must distinguish facts from recommendations. It must say "unknown" rather than infer from missing files.

## R5. JSON output contract

The JSON output includes stable top-level keys:

```json
{
  "agent": "codex",
  "freshness": {},
  "inbox": {},
  "turnfile": {},
  "worklog": {},
  "prd_status": {},
  "git": {},
  "projection": {},
  "validators": {},
  "findings": [],
  "recommended_commands": []
}
```

Findings carry `level` values: `info`, `warning`, `blocker`. The tool must not use `blocker` for work that is merely pending review.

## R6. Relationship to PRD-031 derived views

Before PRD-031 Phase 2, the tool reads current aggregate files directly. After shard-derived views become authoritative, the tool must either:

1. Run the aggregate derivation tool first in read-only mode and report derived output freshness, or
2. Report that aggregate derivation is unavailable and mark aggregate freshness as `unknown`.

The tool must never silently treat stale aggregate views as authoritative.

## R7. Skill and heartbeat integration

1. Codex and Claude skills should prefer `tools/session-orient.mjs` before substantive current-state claims once the tool exists.
2. PRD-030 heartbeat no-op reports may use the tool for quiet state refresh.
3. Session closeout may cite the tool output, but closeout validators remain required.

## Acceptance Criteria

1. `tools/session-orient.mjs --emit json` returns the stable JSON shape and exits 0 on the current repo.
2. `tools/session-orient.mjs --emit human --agent codex` reports Codex unread count, current revision, next message id, next signal id, and next revision.
3. The tool detects stale `MAILBOX.json` when the JSON projection differs from `MAILBOX.md`.
4. The tool detects Turnfile header/coordination revision mismatch.
5. The tool reports selected PRD registry state for `--prd PRD-024` and selected task state for `--task s14-prd024-validator-rule`.
6. The tool reports git dirty paths without modifying the worktree.
7. Missing required files produce a nonzero exit and a machine-readable error in JSON mode.
8. Skill guidance for Codex and Claude references the tool as the preferred orientation helper once implemented.

## Risks

1. Agents may treat orientation output as authority.
   Mitigation: the PRD states that files remain authoritative; the tool is a read-only report.
2. The tool may become noisy.
   Mitigation: human output is intentionally short; JSON contains the detailed fields.
3. Validator execution could become slow.
   Mitigation: run only cheap validators by default and list task-specific evals as recommended commands.
4. PRD-031 may change the source layout.
   Mitigation: R6 requires explicit source/freshness reporting across the aggregate-to-shard transition.

## Dependencies

1. PRD-029 pre-write state derivation.
2. PRD-030 R9 Turnfile memory boundary.
3. PRD-031 derived aggregate direction.
4. PRD-014 closeout projection sync.
5. PRD-024 human-legibility requirements.

## Open Questions

1. Should `session-orient` run cheap validators by default, or only report the commands unless `--validate` is provided?
2. Should the tool read PRD-031 shard files directly in Phase 1, or wait until Phase 2 makes shards authoritative for tasks/status?
3. Should orientation reports be archived at closeout, or treated as transient command output only?
