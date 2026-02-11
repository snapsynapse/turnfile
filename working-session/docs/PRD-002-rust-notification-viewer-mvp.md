# PRD-002: Rust Notification Viewer (MVP)

Status: Draft (working-session scaffold v2)  
Owner: Maintainer + Codex + Claude  
Date: 2026-02-08  
Last revised: 2026-02-11

## Promotion Gate Snapshot (PRD-006 R2a)

| Gate | Status | Evidence |
|------|--------|----------|
| Codex acceptance | accepted | scaffold v2 + Claude counters applied in MSG-20260211-014 follow-through |
| Claude acceptance | accepted | MSG-20260211-014 review: APPLY with counters |
| Maintainer acceptance | pending | pending post-review pass |
| Eligible for move to `docs/prds` | no | blocked until all three acceptances + zero blockers in `working-session/docs/PRD_STATUS.json` |

## Alignment Reference

This PRD aligns with:

1. `docs/prds/PRD-001-maintainer-interaction-model.md`
2. `docs/prds/PRD-003-message-lifecycle-sla-contract.md`
3. `docs/prds/PRD-004-maintainer-decision-contract.md`
4. `docs/prds/PRD-005-protocol-data-schema-compatibility.md`
5. `docs/prds/PRD-006-session-promotion-pipeline.md`
6. `working-session/docs/PRD-019-mailbox-first-approval-and-polling-cadence-contract.md`

## Problem

Mailbox/worklog flow is auditable, but maintainer triage in raw markdown is slower than needed during active sessions. The maintainer needs a fast, local, read-only operational view that surfaces open decisions, related worklog context, and referenced repository files from one interface.

## Goal

Deliver a Rust-based terminal viewer MVP that improves maintainer triage speed without changing canonical protocol artifacts or approval mechanics.

## Non-goals (MVP)

1. Writing or editing `MAILBOX.md`, `WORKLOG.md`, or PRD files from the UI.
2. Replacing markdown as source-of-truth.
3. Network services, cloud sync, or authentication.
4. Full editor/IDE functionality.

## Users

1. Primary: Maintainer (human decision authority).
2. Secondary: Agent operators running audit and review cycles.

## MVP Scope

1. Tri-pane terminal UI.
2. Maintainer-focused message filtering and urgency cues.
3. Linked context views (`MAILBOX`, `WORKLOG`, repository tree).
4. Deterministic refresh behavior with read-only guarantees.

## Requirements

## R1. Read-only Canonical Artifact Contract

1. Viewer must not write to protocol artifacts in MVP.
2. UI must display a persistent indicator that canonical state remains on disk markdown artifacts.
3. Any future write-assist ideas must remain out-of-scope for MVP and require separate PRD approval.

## R2. Maintainer-First Queue Contract

1. Queue panel must support default filter preset: `To=Maintainer` and open statuses.
2. Priority filters (`P0`, `P1`, `P2`) must be toggleable without leaving the queue panel.
3. Queue ordering must remain newest-first and stable across refresh cycles.
4. Queue panel must display Maintainer unread count and oldest-unread reference from inbox snapshot.

## R3. Message Detail Contract

1. Selecting a queue item must render full message card content in detail pane.
2. Detail pane must preserve markdown text fidelity for decision asks, ack lines, and reply bullets.
3. Missing fields should render explicit placeholders rather than failing silently.

## R4. Worklog Context Contract

1. Viewer must show latest WORKLOG status block and recent session entries.
2. Viewer must support section jump by heading or decision index entry.
3. Message-to-worklog context links should be one action from selected message.

## R5. Repository Browser Contract

1. Viewer must provide a read-only file tree scoped to repository root.
2. Selecting a file shows textual contents with basic scrolling.
3. Binary/unreadable files must show a deterministic unsupported-type notice.

## R6. Refresh and Consistency Contract

1. Manual refresh key (`r`) is required.
2. Optional periodic refresh may be enabled via configurable interval with mtime checks.
3. Selection context should be preserved on refresh when target item still exists.
4. Viewer refresh is independent of agent event-based polling in PRD-019 R2; this tool is passive/read-only and does not participate in agent mailbox-check events.

## R7. Parse Strategy Contract

1. Primary source for queue rendering: `working-session/MAILBOX.json`.
2. Fallback parsing of `working-session/MAILBOX.md` is allowed when JSON is missing or stale.
3. Parse failures must surface actionable diagnostics in UI (file, field, error summary).
4. Parser must extract at minimum: `id`, `from`, `to`, `type`, `priority`, `status`, `subject`, `date`, `response_needed_by`; missing required fields trigger diagnostics behavior in R7.3.

## R8. Audit Safety Contract

1. Startup should log loaded source paths and last-modified timestamps in a diagnostics panel or footer.
2. Viewer must expose current filter state to reduce triage ambiguity.
3. Crash/failure paths must avoid partial writes by design (read-only process).

## MVP UX Contract

1. Keyboard-first controls:
   - `j/k` or arrows: move queue/file selection
   - `tab`: cycle panes
   - `/`: edit filter query
   - `g`: jump to newest/top
   - `r`: refresh
   - `q`: quit
2. Visual urgency cues:
   - Priority color coding
   - Explicit marker for Maintainer-directed decision-required messages
3. Deterministic layout:
   - Pane A: Queue + message detail
   - Pane B: WORKLOG context
   - Pane C: Repository file browser

## Implementation Scaffold (Proposed Work Split)

1. Track A (Codex lead): data model, parser adapters (`MAILBOX.json` primary + markdown fallback), refresh state machine, diagnostics/error model.
2. Track B (Claude lead): TUI interaction model, layout ergonomics, keyboard flow, visual triage cues.
3. Track C (Joint): integration hardening against live `working-session/` artifacts and maintainer workflow rehearsal.

## Acceptance Criteria

1. Maintainer can identify all open `To=Maintainer` messages in under 10 seconds on a warm run.
2. Maintainer can open related WORKLOG context from selected message in one action.
3. Maintainer can browse repository files without leaving the viewer process.
4. Viewer performs zero writes to protocol artifacts during normal operation and error paths.

## Risks

1. Projection drift between `MAILBOX.md` and `MAILBOX.json` can degrade queue fidelity.
2. Terminal rendering differences may impact readability across environments.
3. Scope creep toward interactive editing before protocol semantics stabilize.

## Dependencies

1. `working-session/MAILBOX.json` export freshness (`tools/export-mailbox-json.mjs`).
2. Mailbox lifecycle and field expectations from PRD-003/PRD-004/PRD-019.
3. Maintainer interaction semantics from PRD-001.

## Open Questions

1. Should default startup always apply `To=Maintainer` + open-status filters, or remember last session filters?
2. Is markdown fallback mandatory for MVP launch, or acceptable as a gated post-MVP hardening item?
3. Do we need a compact diagnostics pane in MVP, or is footer-level status sufficient?

## Milestones (Scaffold)

1. M0: Parser + static tri-pane shell with fixture data.
2. M1: Live artifact loading, queue filtering, and keyboard navigation.
3. M2: WORKLOG jump actions, repository pane polish, and refresh consistency.
4. M3: Maintainer trial run in real session and acceptance log capture.

## Exit Criteria Beyond MVP

1. Maintainer uses viewer during at least two real protocol sessions.
2. No P1 usability blockers remain in triage workflow.
3. Team agrees on whether to propose a separate write-assist PRD.
