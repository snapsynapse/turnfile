---
name: turnfile-protocol-gemini
description: Execute the Turnfile protocol (a SNAP protocol) in Gemini CLI for mailbox lifecycle, payload-first review, lock-safe shared-file updates, session start/close, Turnfile task/lock coordination, and OQ management. Use when the maintainer explicitly asks Gemini to run a protocol module or produce an auditable protocol-conforming change.
---

# WARNING: SUPERSEDED BY THE ANTIGRAVITY PATH
# This legacy Gemini CLI skill file is superseded by the active Antigravity skill
# bundle located at `.agents/skills/turnfile-protocol-gemini/SKILL.md`.
# Do not run or modify modules from this legacy file.

# Turnfile Protocol Skill File — Gemini

Version: 0.1.0
Protocol revision baseline: PRD-003 through PRD-014 (all promoted to docs/prds/)
Agent: Gemini (Google)
Last updated: 2026-02-11

---

## How to use this file

This is Gemini's complete protocol execution guide. It encodes the Turnfile protocol (a SNAP protocol) as operational instructions for Gemini CLI's environment (sandboxed file writes, shell access, MCP tool integration, 1M token context).

Run modules only on explicit maintainer instruction. (PRD-012 R3)

## Execution Contract

1. Start in propose-only mode.
2. Treat invocation as write permission only when maintainer explicitly includes apply intent (e.g., "run and apply").
3. Require explicit maintainer confirmation before any file write if apply intent is absent. (PRD-012 R5.1)
4. Keep all substantive actions audit-visible in `working-session/MAILBOX.md`, `working-session/WORKLOG.md`, or `working-session/TURNFILE.yaml`. (PRD-012 R5.2)
5. Gemini CLI sandboxed mode provides an additional approval gate on file writes. Do not bypass or disable sandboxed mode.

## Active-Turn Boundary Discipline (PRD-012 R2.2)

Note: this is the *active-turn* boundary check (mailbox-first). It is distinct from the *startup orientation* read order (Turnfile-first) defined below.

1. Read `working-session/MAILBOX.md` inbox snapshot first on every active turn.
2. Re-check `working-session/MAILBOX.md` before declaring turn complete.
3. Do not declare turn complete if Gemini unread count is non-zero.
4. If unread cannot be cleared in-turn, keep turn open and escalate to maintainer with explicit blocker context.
5. Close or explicitly defer Gemini-owned actionable threads before turn completion.
6. Verify open queue does not retain stale entries for threads Gemini just resolved.

## Startup Orientation Read Order (PRD-011 R3 + PRD-013 R5.1)

1. Read `working-session/boot-gemini.md` — orientation, directory layout, current state.
2. Read `working-session/TURNFILE.yaml` — coordination state: phase, tasks, locks, agent status, signals.
3. Read `working-session/WORKLOG.md` status block (lines 1-11).
4. Read `working-session/MAILBOX.md` inbox snapshot + unread messages addressed to Gemini.
5. Read `working-session/OPEN_QUESTIONS.md` — Active + Deferred sections only.
6. Read `working-session/chat-gemini.md` — session close snapshot from predecessor (bottom of file).
7. Read any files relevant to the current task (listed in snapshot "files to read on resume").

## State Freshness Hooks

After any milestone completion, task status change, or substantive protocol action, refresh coordination artifacts in the same turn:

1. `working-session/WORKLOG.md` status block — update "Now Working" and "Next Review Checkpoint" lines.
2. `working-session/TURNFILE.yaml` — update task metadata (`status`, `completed_rev`, `notes`) and post coordination signal.
3. `working-session/MAILBOX.md` — update message lifecycle status, inbox snapshot, and open queue when a thread changed.
4. After mailbox edits, regenerate `working-session/MAILBOX.json`.

---

## Module 0: Session Bootstrap (Cold Start)

**Trigger examples:**
1. "Start a new working session on this branch."
2. Agent reads `working-session/` and finds no TURNFILE.yaml.

**Inputs:** None (detects cold start automatically).

**Procedure:**

1. Check if `working-session/TURNFILE.yaml` exists.
   - If it exists -> skip to Module 1 (Session Start).
   - If it does not exist -> continue with cold-start bootstrap below.
2. Copy all template files from `templates/working-session/` into `working-session/`:
   - `TURNFILE.yaml`, `WORKLOG.md`, `MAILBOX.md`, `MAILBOX.json`, `MAILBOX_ARCHIVE.md`, `WORKLOG_ARCHIVE.md`, `OPEN_QUESTIONS.md`
3. Rename agent-generic files:
   - `boot-agent.md` -> `boot-gemini.md`
   - `chat-agent.md` -> `chat-gemini.md`
4. Fill `<PLACEHOLDER>` values in all template files:
   - `<PROJECT_NAME>` -> `Turnfile`
   - `<project-name>` -> `turnfile`
   - `<maintainer-id>` -> `snap`
   - `<AGENT_NAME>` -> `Gemini`
   - `<YYYY-MM-DD>` -> current date
5. Initialize TURNFILE.yaml agent section:
   - Add `gemini` under `agents` with `status: "proposed"`, `session_id: "gemini-session-<N>"`.
   - Set `coordination.revision: 1`.
   - Post initial signal: `SIG-001` from gemini, signal `ready`, detail describing the bootstrap.
6. Initialize WORKLOG.md:
   - Fill status block with Gemini active, onboarding in progress.
   - Add Session entry documenting the bootstrap.
7. Initialize MAILBOX.md:
   - Add agent rows to Inbox Snapshot (Claude, Codex, Gemini, Maintainer — all unread=0).
8. Run startup validation:
   - `node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json`
   - `node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md`
   - If any gate fails, escalate to maintainer before proceeding.
9. Report bootstrap complete to maintainer. Proceed to Module 1.

**Outputs:** Initialized `working-session/` with all runtime artifacts. Status report.

**Escalation:** If templates are missing or corrupt, escalate to maintainer immediately. Do not attempt to create files from memory — templates are the source of truth.

---

## Module 1: Session Start (PRD-011 R3 + PRD-013 R5.1)

**Trigger examples:**
1. "Start session."
2. "Resume from where we left off."

**Inputs:** None (reads from disk)

**Procedure:**

1. Execute Startup Orientation Read Order (see above).
   - If MAILBOX.json exists and is fresh, may use it for quick state check instead of full markdown parse.
2. After reads, update Turnfile:
   - Set `agents.gemini.status` to appropriate onboarding state (or `"active"` if onboarding complete).
   - Set `agents.gemini.session_id: "gemini-session-<N>"`
   - Set `agents.gemini.last_seen: "gemini-session-<N>"`
   - Check `turn_queue` for pending work assigned to Gemini.
   - Check `locks` for stale revision leases to clean up: `(coordination.revision - acquired_rev) > lease_revs`.
   - Increment `coordination.revision`.

**Outputs:** Status report to maintainer summarizing: current phase/step, unread messages, active tasks, onboarding state, any stale locks found.

**Escalation:** If boot file or Turnfile is missing/corrupt, escalate to maintainer immediately.

---

## Module 2: Mailbox Lifecycle (PRD-003 R1 + PRD-012 R2.2)

**Trigger examples:**
1. "Check mailbox and process unread messages."
2. "Handle MSG-20260211-042."

**Inputs:** Optional: specific MSG ID(s) to process.

**Procedure:**

1. Read `working-session/MAILBOX.md` (re-read immediately before any edit).
2. For each unread message addressed to Gemini:
   a. Read the full message body.
   b. Determine appropriate status transition per PRD-003 R1 state machine:
      - `unread -> acknowledged`: Gemini has read and understood.
      - `unread -> actioned`: Gemini reads and completes action in one step.
      - `acknowledged -> actioned`: Gemini completes the requested action.
      - `acknowledged -> blocked`: Gemini cannot act until dependency resolves.
   c. **Only receiver (Gemini) can ack/block/action.** Only sender or maintainer can close.
3. Update inbox snapshot counts atomically with the status change.
4. Update open queue: add newly posted messages, remove actioned/closed messages.
5. **Consistency self-check:** Before writing, verify that snapshot counts match the actual unread message states. Run `tools/validate-mailbox-invariants.mjs`.
6. Regenerate MAILBOX.json: `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json`

**SLA tiers (PRD-003 R2):**
- P0: respond within next session turn.
- P1: respond within next session.
- P2: best effort.
- SLA is measured in session boundaries, not wall-clock time.

**Stale message handling (PRD-003 R4):**
- If a message exceeds its SLA window without acknowledgment, escalate to maintainer per PRD-003 R4 steps 1-4 (detection -> WORKLOG escalation -> maintainer notification -> disposition).
- Messages in `blocked` status are exempt from stale detection while the blocker persists.
- Stale P0/P1 threads require immediate maintainer notification with blocker context.
- Gemini does not auto-close stale messages.

**Outputs:** Updated MAILBOX.md, updated MAILBOX.json, status report of messages processed.

**Escalation:** If a message requires a decision Gemini cannot make, post a `decision-required` message to the maintainer per PRD-004.

---

## Module 3: Maintainer Decision Request (PRD-004)

**Trigger examples:**
1. "Request decision from maintainer on task scope."
2. "Escalate this blocker to maintainer."

**Inputs:** The question or decision needed, relevant context, options if applicable.

**Procedure:**

1. Compose a mailbox message to maintainer with:
   - Type: `decision-required`
   - Priority: appropriate tier (P0/P1/P2)
   - Clear question with context
   - Options if applicable (with trade-offs)
2. Post to MAILBOX.md following compact format.
3. Record the decision request in WORKLOG with linkage to the MSG ID.
4. When maintainer responds:
   - Record the decision in WORKLOG decision index.
   - Relay format for maintainer decisions: `> Maintainer: "<exact text>"` blockquote.
   - Apply the decision to relevant artifacts.

**Outputs:** MSG in mailbox, WORKLOG entry.

**Escalation:** P0 decisions that block all work should be flagged clearly in both mailbox and Turnfile (agent status -> `blocked`).

---

## Module 4: Cross-Agent Review (PRD-008 + PRD-009)

**Trigger examples:**
1. "Review PRD-015 and post findings."
2. "Review Claude's work on the onboarding artifacts."

**Inputs:** File path or PRD ID to review, scope (full / critical-only).

**Procedure:**

1. Read the target document in full.
2. Conduct review. Categorize findings:
   - **Required [P1]:** Must fix before acceptance.
   - **Recommended [P2]:** Should fix, non-blocking.
   - **Note [informational]:** No action needed, flagged for awareness.
3. Compose mailbox message with payload-first content (PRD-008):
   - Include inline content (never path-only references).
   - Include revision token: `REV-YYYYMMDD-<topic>-<seq>-h<8hex>`.
   - Include review scope, ask (apply-or-counter), and file list.
4. Post to MAILBOX.md.
5. When response comes back:
   - If `apply`: verify changes were applied correctly.
   - If `counter`: assess counter-proposal, accept or re-counter.
   - Content-modifying responses require new superseding revision token with `Related` linkage (PRD-009 R2).

**Outputs:** MSG with review findings, updated MAILBOX.md, MAILBOX.json regenerated.

**Escalation:** If review finds a blocking contradiction between PRDs, escalate to maintainer with both PRD references and the specific conflict.

---

## Module 5: Shared-File Transaction (PRD-010 + PRD-013 R3.3)

**Trigger examples:**
1. "Apply shared-file-safe update to MAILBOX and WORKLOG."
2. "Acquire lock on WORKLOG.md for status block edit."

**Inputs:** File path(s) to lock, reason for edit.

**Procedure:**

**Lock acquisition:**
1. Read TURNFILE.yaml.
2. Check no conflicting lock exists in `locks` section for target files.
3. Write new lock entry:
   ```yaml
   <lock-id>:
     files: ["<file-path>"]
     holder: "gemini"
     acquired_rev: <post-write coordination.revision>
     lease_revs: 2
     reason: "<brief reason>"
   ```
4. Re-read TURNFILE.yaml and verify no overlapping competing lock has earlier `acquired_rev` (or same `acquired_rev` with lexicographically smaller `lock_id`).
5. If verification fails: remove lock entry, yield, retry.

**Editing under lock:**
6. Re-read the target file immediately before editing (it may have changed between reads).
7. Apply changes.
8. Run invariant checks if applicable.
9. If mailbox was mutated, regenerate MAILBOX.json in same transaction cycle.

**Lock release:**
10. Remove lock entry from TURNFILE.yaml.
11. Increment `coordination.revision`.

**Low-activity liveness (PRD-010 R2.10-11 + PRD-013 R3.3 steps 8-9):**
- If `coordination.revision` is unchanged across two consecutive lock-check attempts and Gemini remains blocked: post `blocked` signal in Turnfile and escalate via mailbox decision flow.
- No indefinite spin-wait. Maintainer adjudicates via override (PRD-013 R4).

**Deterministic mailbox ID allocation (PRD-010 R4.4-5):**
- `next_id = (max existing sequence for current date) + 1` from pre-write mailbox read.
- On pre-commit re-check, if collision detected: abort and retry with incremented ID.

**Outputs:** Updated TURNFILE.yaml (lock acquired/released), edited file(s).

**Escalation:** Lock contention that persists beyond two revision checks -> escalate with payload: `lock_id`, `holder`, `acquired_rev`, last-seen `coordination.revision`.

---

## Module 6: Session Close (PRD-011 R1 + PRD-013 R5.2 + PRD-014)

**Trigger examples:**
1. "Close session and prepare handoff."
2. "Wrap up — write snapshot and archive boot file."

**Inputs:** None (operates on current state).

**Procedure:**

1. **Check mailbox** — ensure Gemini unread = 0. If not, process remaining messages first.
2. **Update WORKLOG:**
   - Update status block (lines 1-11) with current state.
   - Add session entry with handoff block.
3. **Close open mailbox messages** that Gemini owns as closure owner.
4. **Update TURNFILE.yaml:**
   - Remove any locks Gemini holds.
   - Update completed tasks to `status: done`.
   - Remove Gemini entries from `turn_queue`.
   - Set `agents.gemini.status` to `"idle"` (or appropriate onboarding state), `current_task: null`.
   - Compact signal log per PRD-013 R5.3.
   - Increment `coordination.revision`.
5. **Write session state snapshot** to bottom of `working-session/chat-gemini.md`.
6. **Archive boot file** to `docs/archive/boot-gemini/boot-gemini_v<N>.md`.
7. **Write new boot file** with updated current state.
8. **Promote completed artifacts** — only when explicitly directed by maintainer.
9. **Commit tracked changes** — only when maintainer directs.
10. **Final mailbox check** — confirm Gemini unread = 0.

**Outputs:** Updated WORKLOG, MAILBOX, TURNFILE.yaml, chat-gemini.md snapshot, new boot file, archived boot file.

**Escalation:** If unable to reach unread = 0, do not close session. Escalate blocking messages to maintainer.

---

## Module 7: Turnfile Coordination (PRD-013 R3 + R6)

**Trigger examples:**
1. "Claim the next available task and signal readiness."
2. "Update task status and release lock in Turnfile."

**Inputs:** Task ID or signal details.

**Procedure:**

**Task self-assignment (PRD-013 R6.1):**
1. Read TURNFILE.yaml.
2. Find unassigned tasks where dependencies are all `status: done`.
3. Claim by writing: `owner: "gemini"`, `status: "claimed"`, `claim_rev: <current coordination.revision>`.
4. If two agents claim simultaneously: lower `claim_rev` wins; if tied, lexicographically smaller `owner` wins.

**Task status updates:**
- `pending -> claimed -> in_progress -> done` (or `blocked` if stuck).
- Set `completed_rev` when marking done.
- Update `notes` with outcome summary.

**Signal posting (PRD-013 R6.4):**
- Append to `messages` section. Signals are lightweight coordination only:
  - `yield`: done with turn, someone else can proceed.
  - `request_turn`: need to write to a shared resource.
  - `ready`: task complete, output available.
  - `blocked`: can't proceed until [detail] resolved.
  - `handoff`: passing work to target agent.
- Anything requiring rationale or content review -> use mailbox instead.

**Section ownership (PRD-013 R2.1):**
| Section | Gemini access |
|---------|--------------|
| `agents.gemini` | Read/write (self-report) |
| `agents.claude` | Read-only |
| `agents.codex` | Read-only |
| `maintainer` | Read-only |
| `coordination.tasks` | Create tasks; update owned tasks |
| `locks` | Acquire/release own locks |
| `turn_queue` | Append own entries |
| `messages` | Append signals |
| `coordination.active_phase/step` | Read-only (maintainer-only writes) |

**Outputs:** Updated TURNFILE.yaml.

**Escalation:** Task contention or lock conflicts -> use signal channel first, then mailbox if substantive discussion needed.

---

## Module 8: OQ Registry Management (PRD-009)

**Trigger examples:**
1. "Sync resolved OQs into the registry."
2. "Register a new OQ for PRD-015."

**Inputs:** OQ ID(s) or topic for new question.

**Procedure:**

1. Read `working-session/OPEN_QUESTIONS.md`.
2. To register new OQ:
   - Assign next sequential ID (`OQ-<NNN>`).
   - Add to Active section with: ID, PRD reference, question text, proposed owner.
3. To resolve OQ:
   - Move from Active/Deferred to Resolved section.
   - Record resolution text and who resolved.
   - Update the source PRD's OQ section with resolution.
4. To defer OQ:
   - Move from Active to Deferred section with reason.
5. Ensure WORKLOG records any OQ state changes.

**Outputs:** Updated OPEN_QUESTIONS.md, updated source PRD(s), WORKLOG entry.

**Escalation:** OQs that block PRD progression -> escalate to maintainer via Module 3.

---

## Fallback Rules

1. If helper tooling is unavailable (e.g., `export-mailbox-json.mjs` fails), run manual equivalent steps and log the fallback.
2. If schema or lint checks are unavailable, perform explicit structure checks and call out residual risk.
3. If concurrent edits occur, re-read the target file before applying any write.

## Output Format Requirements

After executing any module, report:

1. State which module was executed.
2. State whether run mode was propose-only or apply-authorized.
3. List changed files with exact paths.
4. List verification commands and outcomes.
5. List blockers and next owner.

---

## Environment-Specific Notes (Gemini CLI)

**Sandboxed mode:**
- Gemini CLI defaults to sandboxed mode for file writes. This adds a user-approval gate before writes execute.
- This aligns with Turnfile's propose-only default. When apply intent is granted, the Maintainer will also need to approve each write through the Gemini CLI approval flow.
- Do not attempt to bypass sandboxed mode or disable it.

**Context window:**
- Gemini CLI has a 1M token context window — significantly larger than Claude or Codex.
- Despite the larger context, follow the startup read order to front-load compact actionable state.
- Use MAILBOX.json for quick state checks instead of parsing full MAILBOX.md when possible.

**Tool-use patterns:**
- Read files using Gemini's built-in file read capabilities.
- Write files using Gemini's sandboxed write tool (requires user approval).
- Use shell execution for running scripts (e.g., `node tools/export-mailbox-json.mjs`).
- Use MCP tools for any configured external integrations.

**Instruction loading:**
- Gemini loads the project root `GEMINI.md` which imports this SKILL.md via `@skills/gemini-3/SKILL.md`.
- The shared metaskill is loaded via `@skills/skill-versioning/SKILL.md`.
- Subdirectory `GEMINI.md` files can provide scoped overrides.

**Audit visibility (PRD-012 R5.2):**
- All actions must be audit-visible in mailbox, worklog, or Turnfile.
- No hidden channels or private state.
- Log substantive governance actions in WORKLOG.

---

## Versioning

| Field | Value |
|-------|-------|
| Skill file version | 0.1.0 |
| Protocol baseline | PRD-003 through PRD-014 (all promoted) |
| Policy test suite | Not yet validated (onboarding candidate) |
| Last validated | Pending — first validation during onboarding run |
| Structural alignment | Aligned with Claude SKILL.md (v0.3.0) and Codex SKILL.md structure |
| v0.1.0 changes | Initial skill bundle for Gemini CLI onboarding. Adapted from Claude v0.3.0 with Gemini-specific environment notes. |

Changes to protocol semantics require maintainer approval (PRD-012 R7.2).
Environment-specific changes that don't alter protocol semantics are Gemini-owned but must be documented (PRD-012 R7.3).
