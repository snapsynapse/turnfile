# Boot File - Codex (v11)

Read this first on Codex session start. It is the Codex handoff from session 21 closeout.

## Project

Turnfile (SNAP, Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents working as peers with a human Maintainer as arbiter.

Canonical repo: `github.com/snapsynapse/turnfile`

## Startup Read Order

Use `docs/BOOT_SEQUENCE.md` as the canonical boot command manifest. This Codex boot file holds Codex-specific carry-forward and orientation notes.

1. `docs/BOOT_SEQUENCE.md`
2. `working-session/TURNFILE.yaml`
3. `working-session/WORKLOG.md` status block
4. `working-session/MAILBOX.md` inbox snapshot and any Codex-assigned unread cards
5. `working-session/docs/PRD_STATUS.json`
6. `docs/llm/MODEL_LEDGER.md` and `skills/codex/MANIFEST.yaml`
7. `BASELINE.md`
8. `working-session/OPEN_QUESTIONS.md`
9. `working-session/chat-codex.md` latest close snapshot
10. Scope-specific PRDs, evals, and protocol docs for the task at hand

Prefer `tools/session-orient.mjs` for a one-shot fresh-state read after the manual boot file read:

```bash
node tools/session-orient.mjs --agent codex --emit json
```

## Boot Checks

1. Check `working-session/MAILBOX.md` first and action any Codex unread message before asserting readiness.
2. Create or update only the own chat file `working-session/chat-codex.md` when the current session needs a chat snapshot.
3. A missing peer chat file is warning only. Do not create `working-session/chat-claude.md`, `working-session/chat-gemini.md`, or any other peer chat file from the Codex lane.
4. Confirm ownership guard state with `node tools/validate-ownership-guard.mjs --format json`.
5. Run `node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md --agent codex` before assuming Codex can close cleanly.

## Session 21 Close State

Session 21 closed from the Codex side on 2026-06-18 on `main`.

- Turnfile revision at Codex close: `278`.
- Codex status: `idle`; current task: `null`.
- Mailbox state at close: Codex unread `0`; Claude unread `1` (`MSG-20260617-066`); Gemini unread `1` (`MSG-20260618-001`); Maintainer unread `0`.
- Locks at close: none.
- Heartbeat state: no Codex heartbeat carried forward.
- Boot rollover: v10 archived to `docs/archive/boot-codex/boot-codex_v10.md`; active boot is v11.

Immediate rule: re-read live files before asserting shared state. Claude, Gemini, Codex, and the Maintainer may have changed coordination files between sessions.

## Completed In Session 21

1. Booted the three-agent session, established handshakes with Claude and Gemini, and negotiated the heartbeat concept into a read-only steward design.
2. Drafted PRD-038, "Read-Only Heartbeat Steward Contract"; applied Claude C1/C2; recorded Claude and Gemini acceptance; Maintainer accepted; promoted to `docs/prds`.
3. Reviewed PRD-037, "Session Boot Simplification"; applied C1-C5 through Claude; Maintainer accepted; promoted to `docs/prds`.
4. Refreshed current public and agent-facing PRD count claims to 37 registry-tracked and 35 promoted, including README, docs index, `llms.txt`, assistant guide, and manifests.
5. Completed the PRD-014 active-card owner sweep: moved 28 resolved Codex-owned actioned cards to Closed Summary and regenerated `MAILBOX.json`.
6. Added onboarding glossary material and suggested Gemini shutdown parity changes without editing Gemini-owned files.
7. Actioned Claude `MSG-20260618-002`, acknowledging Gemini FULL-ACTIVE ratification, PRD-015 reactivation/promotion, PRD-027 production competence, PRD-017 A1, and the reviewer-policy change that adds Gemini as a required reviewer for new PRDs.
8. Closed Codex-owned `MSG-20260618-003` after Claude acknowledged the shutdown-readiness handoff inline.

## Carry Forward

1. Codex has no unread mailbox messages at close.
2. Claude owns `MSG-20260617-066`, the substantive review request for the PRD-014 active-card owner review gate. Do not close that card from Codex unless Claude responds or the Maintainer directs.
3. Gemini has unread `MSG-20260618-001`, its FULL-ACTIVE welcome and six-item parity checklist.
4. PRD-031 C1 remains the next Codex infrastructure lane when the next session reopens it.
5. Gemini is now a full required PRD reviewer for new PRDs. Future `PRD_STATUS.json` edits must include `acceptance.gemini` for new PRDs unless the Maintainer explicitly creates an exception.
6. PRD-015 is active again and promoted to `docs/prds/`; do not treat the old archived PRD-015 state as current.
7. Dirty worktree remains mixed across Codex, Claude, Gemini, and Maintainer-owned paths. Do not stage or commit peer-owned files from the Codex lane without Maintainer direction.

## Tokenese Guardrails

1. English is authoritative for governance, lifecycle, locks, task claims, acceptance, normative PRD text, exact diffs, and public commitments.
2. Tokenese twins are bounded to approved operational/handoff contexts with English projection.
3. `ev:obs` requires verifiable backing in the same source context. It is not standalone authority.
4. `^N` remains untrusted unless a later calibration decision changes that.
5. Chat dense scratchpads remain OFF unless the Maintainer explicitly unlocks them.
6. Language-level changes stay in `/Users/snap/Git/tokenese` under that repo's process.

## Next Session Handshake

Before substantive work, establish:

1. Turnfile version: `SPEC.md` v0.1.0-reset and `TURNFILE.yaml` protocol version 0.1 unless the Maintainer changes the target.
2. Tokenese state: observe fresh Tokenese repo state before asserting current version; do not rely on v0.3.7 as current without observation.
3. Onboarding and skill state: load the role-keyed Codex skill, verify model ledger coverage, follow `docs/BOOT_SEQUENCE.md`, self-validate with mailbox/Turnfile/PRD checks, and mutually confirm active peer context before write work.
4. Session completion criteria and scope: pick one bounded primary lane before implementation. Current recommendation is PRD-031 C1 unless the Maintainer redirects.
5. Outstanding issues: Claude review of `MSG-20260617-066`, Gemini's session-22 parity checklist, PRD-031 C1 implementation sequencing, and dirty-worktree commit strategy.

## Validation Commands

Run these after any closeout or shared-file mutation:

```bash
node tools/session-orient.mjs --agent codex --emit json
node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md
node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json
node tools/validate-prd-promotion.mjs --registry working-session/docs/PRD_STATUS.json
node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md --agent codex
node tools/validate-ownership-guard.mjs
npm run -s validate:skills
git diff --check
```

Run focused evals for the next implementation lane before relying on current implementation state.
