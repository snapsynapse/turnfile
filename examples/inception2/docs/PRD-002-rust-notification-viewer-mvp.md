# PRD-002: Rust Notification Viewer (MVP)

Status: Draft (inception)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-08

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | pending | not yet logged |
| Claude acceptance | pending | not yet logged |
| Maintainer acceptance | pending | not yet logged |
| Eligible for move to `docs/prds` | no | blocked until all three acceptances + zero blockers in `inception/docs/PRD_STATUS.json` |

## Problem

Current mailbox/worklog flow is file-based and auditable, but direct human triage is still cumbersome in plain text files. The maintainer needs a fast way to scan active messages, distinguish maintainer-directed decisions, and correlate them with worklog context and repository files.

## Goal

Ship a Rust-based local viewer MVP that improves human situational awareness without changing canonical protocol artifacts.

## Non-goals (MVP)

1. Editing mailbox/worklog content from the UI.
2. Network services, auth, or cloud sync.
3. Replacing markdown as canonical source.
4. Full IDE/editor replacement.

## Users

1. Primary: Maintainer (human).
2. Secondary: LLM operators during audit/review.

## MVP scope

## S1. Tri-pane layout

1. Pane A: Mailbox open queue + selected message detail.
2. Pane B: Worklog view (latest entries + quick jump by section heading).
3. Pane C: Repository file browser (read-only).

## S2. Maintainer-first filtering

1. Filter: `To=Maintainer`.
2. Filter: `Status=open` (`unread|acknowledged`).
3. Filter: `Priority=P0/P1/P2`.
4. Badge/count: `Needs Maintainer`.

## S3. Data sources

1. Primary parse target: `inception/MAILBOX.json` (generated projection).
2. Fallback parse target: `inception/MAILBOX.md` compact cards.
3. Worklog source: `inception/WORKLOG.md`.
4. File pane source: workspace filesystem tree.

## S4. Refresh model

1. Manual refresh key (`r`).
2. Optional auto-refresh interval (e.g. 2-5 seconds) with file mtime check.

## S5. Audit-safe behavior

1. Viewer is read-only in MVP.
2. Clear on-screen indicator: "Canonical state is markdown files on disk."

## UX requirements

1. Fast keyboard-first navigation:
   - `j/k` or arrow navigation in queue
   - `tab` pane switch
   - `/` filter input
   - `g` jump to top/newest
2. Visual urgency cues:
   - color by priority
   - explicit icon/text for maintainer-directed messages
3. Deterministic sorting:
   - newest-first for open queue
   - maintain stable selection on refresh

## Technical approach (proposed)

1. Language/runtime: Rust stable.
2. Suggested crates:
   - `ratatui` + `crossterm` for TUI
   - `serde` + `serde_json` for JSON parsing
   - `walkdir` for file tree
   - `notify` (optional, phase 2) for file watch
3. Binary target: `tools/mailbox-viewer` or `cmd/mailbox-viewer` (final path TBD in inception).

## Acceptance criteria

1. Maintainer can identify all open `To=Maintainer` messages in under 10 seconds.
2. Maintainer can open related worklog context from the same screen in one action.
3. Maintainer can browse repo files without leaving the viewer.
4. No writes are performed to protocol artifacts in MVP.

## Risks

1. Parser drift if mailbox markdown format changes but JSON schema is not updated.
2. Terminal rendering variability across environments.
3. Scope creep into full editor before interaction semantics stabilize.

## Dependencies

1. PRD-001 maintainer interaction model (message semantics).
2. Stable `MAILBOX.json` projection schema.

## Milestones

1. M0 (1 day): static renderer from sample `MAILBOX.json` + worklog excerpt.
2. M1 (1-2 days): live filesystem reads + filters + tri-pane navigation.
3. M2 (optional): file-watch refresh + polish.
4. M3 (post-MVP): evaluate write-assist mode (not direct editing) for maintainer reply snippets.

## Open questions

1. Should the viewer support both inception and canonical repo contexts at launch?
2. Should maintainer filters default on startup (`To=Maintainer AND open`)?
3. Do we want an "export session snapshot" command for attorney/audit handoff?

## Exit criteria for moving beyond MVP

1. Maintainer uses viewer for at least two real sessions.
2. No critical usability blockers in queue triage.
3. Team agrees response mechanics are stable enough to consider limited write-assist.
