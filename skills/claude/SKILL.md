---
name: turnfile-protocol-claude
description: Execute the Turnfile protocol (a SNAP protocol) in Claude for mailbox lifecycle, payload-first review, lock-safe shared-file updates, session start/close, Turnfile task/lock coordination, and OQ management. Use when the maintainer explicitly asks Claude to run a protocol module or produce an auditable protocol-conforming change.
---

# Turnfile Protocol Skill File — Claude

Version: 0.4.1
Protocol revision baseline: PRD-003 through PRD-014 and PRD-016 through PRD-019 (all promoted to docs/prds/)
Agent: Claude (Anthropic) — bundle is role-keyed; the executing model is recorded in MANIFEST.yaml, not in this path
Last updated: 2026-06-12

---

## How to use this file

This is Claude's complete protocol execution guide. It encodes the Turnfile protocol (a SNAP protocol) as operational instructions for Claude's environment (tool-use patterns, context window management, chat-integrated output).

Run modules only on explicit maintainer instruction. (PRD-012 R3)

Pending contracts not yet encoded here: PRD-021 R5 propagation (promoted 2026-06-13; propagation task pending), PRD-022 mirror modes (agent review in flight).

## Encoding profile obligations (PRD-024, Maintainer-accepted 2026-06-13)

1. The governance record (TURNFILE.yaml, MAILBOX.md/.json/archive, WORKLOG + archive, OPEN_QUESTIONS, PRDs, PRD_STATUS.json, boot files, skills, templates, schemas, root strategy docs, chat session headers/snapshots) is `legible` only. Never write dense/tokenese content there except short fenced fragments labeled `dense` followed immediately by a legible paraphrase (PRD-024 R3.2).
2. Dense lanes exist only with explicit session-charter opt-in (R2); without it, everything is legible.
3. **Turn-boundary obligation (R3.1):** if any dense exchange this turn contained or evidenced a proposal, verdict, counter, objection, decision input, task claim, lock action, or acceptance — record its human-legible projection in the appropriate governance artifact before declaring the turn complete. This sits alongside the unread=0 rule.
4. Projection is authorship: you owe projections for dense content you produced; misrepresenting one ranks with falsifying a WORKLOG entry. Dense originals are never authoritative.
5. Honor Maintainer projection demands at P1 SLA and any session-wide dense suspension immediately. Peer spot-check requests are refusable only with a concrete, escalatable reason (R4.3).

## Execution Contract

1. Start in propose-only mode.
2. Treat invocation as write permission only when maintainer explicitly includes apply intent (e.g., "run and apply").
3. Require explicit maintainer confirmation before any file write if apply intent is absent. (PRD-012 R5.1)
4. Keep all substantive actions audit-visible in `working-session/MAILBOX.md`, `working-session/WORKLOG.md`, or `working-session/TURNFILE.yaml`. (PRD-012 R5.2)

## Active-Turn Boundary Discipline (PRD-012 R2.2)

Note: this is the *active-turn* boundary check (mailbox-first). It is distinct from the *startup orientation* read order (Turnfile-first) defined above. See H-002 for the rationale.

1. Read `working-session/MAILBOX.md` inbox snapshot first on every active turn.
2. Re-check `working-session/MAILBOX.md` before declaring turn complete.
3. Do not declare turn complete if Claude unread count is non-zero.
4. If unread cannot be cleared in-turn, keep turn open and escalate to maintainer with explicit blocker context.
5. Close or explicitly defer Claude-owned actionable threads before turn completion.
6. Verify open queue does not retain stale entries for threads Claude just resolved.

## Startup Orientation Read Order (PRD-011 R3 + PRD-013 R5.1)

1. Read `working-session/boot-claude.md` — orientation, directory layout, current state.
2. Read `working-session/TURNFILE.yaml` — coordination state: phase, tasks, locks, agent status, signals.
3. Read `working-session/WORKLOG.md` status block (lines 1–11).
4. Read `working-session/MAILBOX.md` inbox snapshot + unread messages addressed to Claude.
5. Read `working-session/OPEN_QUESTIONS.md` — Active + Deferred sections only.
6. Read `working-session/chat-claude.md` — session close snapshot from predecessor (bottom of file).
7. Read any files relevant to the current task (listed in snapshot "files to read on resume").

## State Freshness Hooks

After any milestone completion, task status change, or substantive protocol action, refresh coordination artifacts in the same turn:

1. `working-session/WORKLOG.md` status block — update "Now Working" and "Next Review Checkpoint" lines.
2. `working-session/TURNFILE.yaml` — update task metadata (`status`, `completed_rev`, `notes`) and post coordination signal.
3. `working-session/MAILBOX.md` — update message lifecycle status, inbox snapshot, and open queue when a thread changed.
4. After mailbox edits, regenerate `working-session/MAILBOX.json`.
5. After skill file changes that affect protocol coverage or validation status, update the Versioning table.

---

## Module 0: Session Bootstrap (Cold Start)

**Trigger examples:**
1. "Start a new working session on this branch."
2. Agent reads `working-session/` and finds no TURNFILE.yaml.

**Inputs:** None (detects cold start automatically).

**Procedure:**

1. Check if `working-session/TURNFILE.yaml` exists.
   - If it exists → skip to Module 1 (Session Start).
   - If it does not exist → continue with cold-start bootstrap below.
2. Copy all template files from `templates/working-session/` into `working-session/`:
   - `TURNFILE.yaml`, `WORKLOG.md`, `MAILBOX.md`, `MAILBOX.json`, `MAILBOX_ARCHIVE.md`, `WORKLOG_ARCHIVE.md`, `OPEN_QUESTIONS.md`
3. Rename agent-generic files:
   - `boot-agent.md` → `boot-claude.md` (or use existing boot file if already present)
   - `chat-agent.md` → `chat-claude.md`
   - Per PRD-017 R7: create own chat file unconditionally when absent; never create peer chat files (missing peer chat file is a warning, not a blocker). Session headers carry fixed metadata fields: branch, Turnfile revision, phase, session ID, date.
4. Fill `<PLACEHOLDER>` values in all template files:
   - `<PROJECT_NAME>` → `Turnfile`
   - `<project-name>` → `turnfile`
   - `<maintainer-id>` → `snap`
   - `<AGENT_NAME>` → `Claude`
   - `<YYYY-MM-DD>` → current date
5. Initialize TURNFILE.yaml agent section:
   - Add `claude` under `agents` with `status: "active"`, `session_id: "claude-session-<N>"`.
   - Set `coordination.revision: 1`.
   - Post initial signal: `SIG-001` from claude, signal `ready`, detail describing the bootstrap.
6. Initialize WORKLOG.md:
   - Fill status block with Claude active, awaiting maintainer direction.
   - Add Session 0 entry documenting the bootstrap.
7. Initialize MAILBOX.md:
   - Add agent rows to Inbox Snapshot (Claude, Codex, Maintainer — all unread=0).
8. **Skills preflight** (P-7):
   - Verify `skills/claude/SKILL.md` is readable and frontmatter parses.
   - Verify `skills/skill-versioning/MANIFEST.yaml` exists and file hashes match actual files.
   - If preflight fails, escalate to maintainer before proceeding.
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
   - Set `agents.claude.status: "active"`
   - Set `agents.claude.session_id: "claude-session-<N>"`
   - Set `agents.claude.last_seen: "claude-session-<N>"`
   - Check `turn_queue` for pending work assigned to Claude.
   - Check `locks` for stale revision leases to clean up: `(coordination.revision - acquired_rev) > lease_revs`.
   - Increment `coordination.revision`.

**Outputs:** Status report to maintainer summarizing: current phase/step, unread messages, active tasks, any stale locks found.

**Escalation:** If boot file or Turnfile is missing/corrupt, escalate to maintainer immediately.

---

## Module 2: Mailbox Lifecycle (PRD-003 R1 + PRD-012 R2.2)

**Trigger examples:**
1. "Check mailbox and process unread messages."
2. "Handle MSG-20260208-042."

**Inputs:** Optional: specific MSG ID(s) to process.

**Procedure:**

1. Read `working-session/MAILBOX.md` (re-read immediately before any edit).
2. For each unread message addressed to Claude:
   a. Read the full message body.
   b. Determine appropriate status transition per PRD-003 R1 state machine:
      - `unread → acknowledged`: Claude has read and understood.
      - `unread → actioned`: Claude reads and completes action in one step.
      - `acknowledged → actioned`: Claude completes the requested action.
      - `acknowledged → blocked`: Claude cannot act until dependency resolves.
   c. **Only receiver (Claude) can ack/block/action.** Only sender or maintainer can close.
3. Update inbox snapshot counts atomically with the status change (every message post or status transition must leave the snapshot consistent).
4. Update open queue: add newly posted messages, remove actioned/closed messages.
5. **Consistency self-check:** Before writing, verify that snapshot counts match the actual unread message states in Active Messages. If mailbox invariant tooling exists (`tools/validate-mailbox-invariants.mjs`), run it.
6. Regenerate MAILBOX.json: `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json`

**Turn-boundary discipline:** See Active-Turn Boundary Discipline section above. Applies to all modules, not just mailbox.

**SLA tiers (PRD-003 R2):**
- P0: respond within next session turn.
- P1: respond within next session.
- P2: best effort.
- SLA is measured in session boundaries, not wall-clock time.

**Polling cadence (PRD-019 R2, resolved OQ-054/055):**
- Coordination is asynchronous and event-based only; no time-based polling exists.
- Canonical check events: session start; before executing a proposed change; after posting a proposal; before declaring turn complete.

**Chat-decision mirroring (PRD-019 R4):**
- When a decision occurs in chat, post a mailbox `notify` mirror before execution proceeds. Minimum content: decision type, scope reference, approver identity. Minimum card fields: From, Date, Type, Priority, Status, Subject.
- Known gap (session 14): closed-on-posting mirrors generate no unread flag for peers. Until a delivery-guarantee contract lands, follow a substantive mirror with an unread sync notify to affected peers.

**Stale message handling (PRD-003 R4):**
- If a message exceeds its SLA window without acknowledgment, escalate to maintainer per PRD-003 R4 steps 1-4 (detection → WORKLOG escalation → maintainer notification → disposition).
- Claude does not auto-close stale messages.

**Outputs:** Updated MAILBOX.md, updated MAILBOX.json, status report of messages processed.

**Escalation:** If a message requires a decision Claude cannot make, post a `decision-required` message to the maintainer per PRD-004.

---

## Module 3: Maintainer Decision Request (PRD-004)

**Trigger examples:**
1. "Request decision from maintainer on PRD-012 scope."
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

**Escalation:** P0 decisions that block all work should be flagged clearly in both mailbox and Turnfile (agent status → `blocked`).

---

## Module 4: Cross-Agent Review (PRD-008 + PRD-009)

**Trigger examples:**
1. "Review PRD-013 and post findings."
2. "Run reconciliation across PRD-005/006/007 interfaces."

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

**Reconciliation (PRD-009):**
- When reconciling cross-PRD interfaces, check for contradictory source-of-truth rules.
- Register interface deltas in the appropriate tracking section (e.g., PRD-006 delta register).
- Update OQ registry if new questions surface.

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
     holder: "claude"
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
- If `coordination.revision` is unchanged across two consecutive lock-check attempts and Claude remains blocked: post `blocked` signal in Turnfile and escalate via mailbox decision flow.
- No indefinite spin-wait. Maintainer adjudicates via override (PRD-013 R4).

**Deterministic mailbox ID allocation (PRD-010 R4.4-5):**
- `next_id = (max existing sequence for current date) + 1` from pre-write mailbox read.
- On pre-commit re-check, if collision detected: abort and retry with incremented ID.

**Outputs:** Updated TURNFILE.yaml (lock acquired/released), edited file(s).

**Escalation:** Lock contention that persists beyond two revision checks → escalate with payload: `lock_id`, `holder`, `acquired_rev`, last-seen `coordination.revision`.

---

## Module 6: Session Close (PRD-011 R1 + PRD-013 R5.2 + PRD-014)

**Trigger examples:**
1. "Close session and prepare handoff."
2. "Wrap up — write snapshot and archive boot file."

**Inputs:** None (operates on current state).

**Procedure:**

1. **Check mailbox** — ensure Claude unread = 0. If not, process remaining messages first.
2. **Update WORKLOG:**
   - Update status block (lines 1–11) with current state.
   - Add session entry with handoff block.
3. **Close open mailbox messages** that Claude owns as closure owner.
4. **Update TURNFILE.yaml:**
   - Remove any locks Claude holds.
   - Update completed tasks to `status: done`.
   - Remove Claude entries from `turn_queue`.
   - Set `agents.claude.status: "idle"`, `current_task: null`.
   - Compact signal log per PRD-013 R5.3: remove signals older than retention window (default 2 sessions), preserve last signal from each agent.
   - Increment `coordination.revision`.
5. **Write session state snapshot** to bottom of `working-session/chat-claude.md`:
   - YAML front matter: session ID, agent, timestamp, close reason, revision token (`REV-YYYYMMDD-snapshot-claude-<seq>-h<8hex>`), plus PRD-017 R7.4 fields: branch, Turnfile revision, phase.
   - Active task status (complete/partial/blocked).
   - Mailbox state summary.
   - Open commitments.
   - Files modified this session.
   - Files to read on resume (ordered, with token budgets).
   - Decision context.
   - OQs touched.
6. **Archive boot file** to `docs/archive/boot-claude/boot-claude_v<N>.md` (globally monotonic versioning per PRD-014).
7. **Write new boot file** with updated current state.
8. **Promote completed artifacts** from `working-session/` to tracked `docs/` (copy, not move) — **only when explicitly directed by maintainer** and only for PRDs that pass the promotion gate (`PRD_STATUS.json` eligible = true + `tools/validate-prd-promotion.mjs` passes + maintainer acceptance evidence per PRD-006 R2a/R3).
9. **Commit tracked changes** — only when maintainer directs. Use granular commits, not one mega-commit:
   - Each PRD promotion gets its own commit (e.g., `Promote PRD-015: Gemini onboarding contract`).
   - Each new tool or template gets its own commit.
   - Structural changes (moves, renames, path updates) are separate from content changes.
   - Remaining session work (doc updates, OQ resolutions, config changes) can be one commit summarizing the session.
   - Do not auto-push. Push only when maintainer directs.
10. **Final mailbox check** — confirm Claude unread = 0.

**Outputs:** Updated WORKLOG, MAILBOX, TURNFILE.yaml, chat-claude.md snapshot, new boot file, archived boot file.

**Escalation:** If unable to reach unread = 0, do not close session. Escalate blocking messages to maintainer.

---

## Module 7: Turnfile Coordination (PRD-013 R3 + R6)

**Trigger examples:**
1. "Claim the next available P2-D task and signal readiness."
2. "Update task status and release lock in Turnfile."

**Inputs:** Task ID or signal details.

**Procedure:**

**Task self-assignment (PRD-013 R6.1):**
1. Read TURNFILE.yaml.
2. Find unassigned tasks where dependencies are all `status: done`.
3. Claim by writing: `owner: "claude"`, `status: "claimed"`, `claim_rev: <current coordination.revision>`.
4. If two agents claim simultaneously: lower `claim_rev` wins; if tied, lexicographically smaller `owner` wins.

**Task status updates:**
- `pending → claimed → in_progress → done` (or `blocked` if stuck).
- Set `completed_rev` when marking done.
- Update `notes` with outcome summary.

**Signal posting (PRD-013 R6.4):**
- Append to `messages` section. Signals are lightweight coordination only:
  - `yield`: done with turn, someone else can proceed.
  - `request_turn`: need to write to a shared resource.
  - `ready`: task complete, output available.
  - `blocked`: can't proceed until [detail] resolved.
  - `handoff`: passing work to target agent.
- Anything requiring rationale or content review → use mailbox instead.

**Write protocol (PRD-013 R3.1):**
- Always read before write.
- Validate ownership rules (R2.1): Claude writes only to `agents.claude`, shared sections require lock.
- Increment `coordination.revision` on every write.
- Update `Last modified revision` header comment.

**Section ownership (PRD-013 R2.1):**
| Section | Claude access |
|---------|-------------|
| `agents.claude` | Read/write (self-report) |
| `agents.codex` | Read-only |
| `maintainer` | Read-only |
| `coordination.tasks` | Create tasks; update owned tasks |
| `locks` | Acquire/release own locks |
| `turn_queue` | Append own entries |
| `messages` | Append signals |
| `coordination.active_phase/step` | Read-only (maintainer-only writes) |

**Outputs:** Updated TURNFILE.yaml.

**Escalation:** Task contention or lock conflicts → use signal channel first, then mailbox if substantive discussion needed.

---

## Module 8: OQ Registry Management (PRD-009)

**Trigger examples:**
1. "Sync resolved OQs into the registry."
2. "Register a new OQ for PRD-014."

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

**Escalation:** OQs that block PRD progression → escalate to maintainer via Module 3.

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

## Environment-specific notes (Claude)

**Context window management:**
- Claude operates within a fixed context window. The startup read order is optimized to front-load the most compact, actionable state.
- If approaching context limits, prioritize session close (Module 6) over continuing work.
- Use MAILBOX.json for quick state checks instead of parsing full MAILBOX.md when possible.

**Tool-use patterns:**
- Read files with the Read tool. Re-read immediately before editing.
- Edit files with the Edit tool (for targeted replacements) or Write tool (for new files).
- Use Bash for git operations, running scripts (e.g., `node tools/export-mailbox-json.mjs`), and directory listings.
- Use Grep for content searches, Glob for file pattern matching.

**Audit visibility (PRD-012 R5.2):**
- All actions must be audit-visible in mailbox, worklog, or Turnfile.
- No hidden channels or private state.
- Log substantive governance actions in WORKLOG.

---

## Versioning

| Field | Value |
|-------|-------|
| Skill file version | 0.4.1 |
| Protocol baseline | PRD-003 through PRD-014, PRD-016 through PRD-019 (all promoted) |
| Policy test suite | PRD-012-M3-policy-test-suite.md (19 assertions, 4 scenario harnesses) — archived at `examples/inception/skills/policy-tests/` |
| Last validated | M4 validation complete — all 4 scenarios PASS (rev 41, inception session 10) |
| Structural alignment | Aligned with Codex SKILL.md structure: front matter, execution contract, boundary discipline, startup read order, fallback rules, output format |
| v0.3.0 changes | Added Module 0 (Session Bootstrap) for cold-start initialization from templates. Bumped version. |
| v0.4.0 changes | Bundle moved to role-keyed `skills/claude/` (model recorded in MANIFEST, not path). Baseline extended to PRD-016..019. Added PRD-017 R7 chat-file rules, PRD-019 event-based cadence + chat-decision mirror duty, mirror delivery-gap workaround. Validated live in session 14 on Fable 5. |
| v0.4.1 changes | PRD-024 propagation (R5.2): encoding-profile obligations section — legible-only governance record, charter opt-in for dense lanes, turn-boundary projection obligation, authorship liability, Maintainer demand/suspension compliance. |

Changes to protocol semantics require maintainer approval (PRD-012 R7.2).
Environment-specific changes that don't alter protocol semantics are Claude-owned but must be documented (PRD-012 R7.3).
