# Working Session Workspace

This directory is the live Turnfile coordination workspace. Use current control-plane files as authoritative; older handoffs, charters, and evidence are retained here only while active validators, PRDs, or session history still point at them.

## Current Authority

- `TURNFILE.yaml` - live coordination state, tasks, locks, active step, and revision.
- `MAILBOX.md` and `MAILBOX.json` - human mailbox and generated machine mailbox view.
- `WORKLOG.md` - append-only audit trail for material session changes.
- `docs/PRD_STATUS.json` - source of truth for PRD shelf, acceptance, blockers, and implementation state.
- `OPEN_QUESTIONS.md` - working-session open-question register. Deferred canonical questions live in `docs/OPEN_QUESTIONS.md`.
- `NEXT_SESSION_HANDSHAKE.md` - handshake sign-off surface plus historical addendum log. Do not treat older addenda as current release state without checking the current files above.

## Active Release Surface

- `docs/PRD-047-cross-repo-v1-validation-tests.md` is the only active PRD draft still on the working-session shelf.
- `docs/v1-cross-repo-test-tokenese-2026-06-23.md` and `docs/v1-cross-repo-test-aidr-2026-07-02.md` are the current v1 dogfood evidence files.
- `docs/v1-fresh-context-probe-2026-06-23-claude-haiku.md` and `docs/v1-fresh-context-probe-2026-06-23-claude-sonnet.md` remain v1 fresh-context evidence.

## Historical And Evidence Shelves

- `SESSION_CHARTER.md` is the ratified Session 15 Tokenese A/B charter, retained as PRD-027 evidence. It is not the active session charter.
- `docs/onboarding/`, `docs/onboarding/evidence/`, `docs/gemini-onboarding/`, `docs/gemini-teach-gate.md`, and `docs/local-model-onboarding-matrix.md` are onboarding protocol and candidate evidence shelves.
- `docs/tokenese-*.md`, `docs/tk-*.md`, and `tokenese-pairs/` are Tokenese measurement and pilot artifacts retained for PRD-027/035 traceability.
- `docs/prd-031-*.md`, `docs/s21-prd-031-infrastructure-audit.md`, and `docs/r4-arbitration-primitive-schema-spike-prd-041.md` are historical implementation notes.
- `docs/qwen-mlx-*.md` and `docs/onboarding/evidence/qwen-mlx/` are Qwen relay/onboarding evidence shelves.

## Peer-Owned Working Files

- `boot-claude.md`, `boot-codex.md`, and `boot-gemini.md` are agent-owned boot files. Owners should keep them lookup-based rather than stateful.
- `chat-claude.md`, `chat-codex.md`, and `chat-gemini.md` are agent-owned scratchpads and should be rolled over by the owning agent when they become unwieldy.
- `HEARTBEAT.md` may name a single agent runtime. Do not assume it describes every active heartbeat in the Codex app.

## Cleanup Rules

1. Completed PRDs belong in `docs/prds/`, not `working-session/docs/`.
2. Active PRD shelf truth comes from `docs/PRD_STATUS.json`, not from hand-written lists.
3. Historical implementation notes should move to an archive only after references in PRDs, worklog entries, and validators are updated.
4. Peer-owned boot/chat files should be changed by their owners unless the Maintainer explicitly authorizes cross-agent edits.
5. Before shared-file writes, derive the next revision and signal with `tools/next-state.mjs`, then update audit state and run validators.
