---
name: turnfile-protocol-gemini
description: Execute the Turnfile protocol (a SNAP protocol) in Google Antigravity for mailbox lifecycle, payload-first review, lock-safe shared-file updates, session start/close, Turnfile task/lock coordination, and OQ management. Use when the maintainer asks to run a protocol module, process the mailbox, do a payload-first review, or make an auditable coordination edit.
---

# Turnfile Protocol Skill File — Gemini

Version: 0.2.4
Protocol revision baseline: PRD-003 through PRD-014 and PRD-016 through PRD-036, and PRD-014 Amendment A1
Agent: Gemini (Google) — bundle is role-keyed; the executing model is recorded in MANIFEST.yaml, not in this path
Last updated: 2026-06-18

---

## How to use this file

This is Gemini's complete protocol execution guide. It encodes the Turnfile protocol (a SNAP protocol) as operational instructions for Google Antigravity's environment (tool-use patterns, context window management, Planning-Mode updates).

Run modules only on explicit maintainer instruction. (PRD-012 R3)

Pending contracts not yet encoded here: PRD-021/022/024/030/031/032/033/014 A1 propagation has landed; later unimplemented contracts remain tracked in `working-session/docs/PRD_STATUS.json`.

## Files First, Not Memory (Maintainer directive, 2026-06-13)

Turnfile is collaborative, file-based work. Codex and the Maintainer mutate shared files concurrently and between your turns, so your memory reflects a past revision and is stale by default. Read the relevant file before asserting, answering, or reasoning about any shared state — PRD/gate/acceptance status, open questions, task ownership, mailbox contents, lock state, who did what, what is blocked. Reason from what the file says now, not from what you remember.

1. This generalizes the re-read-before-edit rule (write safety) to re-read-before-assert (answer safety). It applies to questions and conclusions, not only writes: answering a Maintainer question about current state is a file read, not a memory recall.
2. Default suspicion — if you are about to state a fact about current shared state from memory, that itself is the signal to open the file instead. Recall across your own earlier turns, and especially across model or session boundaries, is the most error-prone input you have.
3. When memory and file disagree, the file wins, and the disagreement is itself signal: a peer or the Maintainer changed something; understand why before acting.
4. A redundant read is cheap; a confident assertion from stale memory has repeatedly been wrong. The general "prefer memory, verify later" heuristic is correct for solo work and wrong here — collaboration inverts it.
5. **When you need current state, run the orientation read-set, not recall** (adapted from skills/codex Files First): mailbox snapshot + your unread/own cards, `TURNFILE.yaml`, the WORKLOG status block, `PRD_STATUS.json`, the relevant PRD/task, `git status`, and the relevant validator. Model, platform, thread, and automation memory is non-authoritative cache; durable state lives in these files (after PRD-031, in the per-agent shards those files derive from). Prefer `tools/session-orient.mjs` (PRD-032) first for a one-shot read-only snapshot — current revision, next ids, your unread, projection freshness (stale `MAILBOX.json` / revision mismatch), selected PRD/task, git-dirty + heuristic ownership, and recommended commands (add `--validate` to also run the gates) — then do any deeper reads explicitly with the Read tool.

## Concurrent Write Discipline — Derive, Don't Assume

The write-side complement to Files First. Reading from files is not enough if you then write a value you computed from memory. Every value you write to a shared file must be derived from that file as it exists inside the active lock window.

1. **Derive every written value from the in-lock fresh read** — next MSG ID, next SIG ID, next revision, inbox unread counts, oldest-unread pointers. Never carry a value computed earlier in the turn or assumed from context; a peer may have changed the file since. When `tools/next-state.mjs` exists, derive through it.
2. **A validator's reported "expected" value is file-derived truth.** When `validate-mailbox-invariants` (or any validator) says `expected=X`, reconcile to X — it computed X from the file. Do not argue with it or re-derive by hand.
3. **Lock the whole batch up front.** Before a multi-file shared write, acquire one lock listing every shared file the batch will touch, and check for competing locks before the first write — not per-file mid-batch.
4. **Commit only your own changed paths.** When a peer may have uncommitted work in the shared tree, `git add <explicit paths>`, never `git add -A`.
5. **Allocate IDs inside the lock window; abort and retry on collision** (Module 5 / PRD-010 R4.4-5). A duplicate-ID write means a peer posted concurrently — re-read, re-derive, retry; the collision is signal, not error.
6. **Only the Read tool satisfies the read-before-edit guard.** Bash `grep`/`sed`/`cat`/`head` do NOT register as reading a file in IDE environments. Use `view_file` on the file (or region) in the same turn to qualify it for editing.
7. **Re-Read a shared file with the Read tool immediately before editing it, every time a peer may have written** — which, on an active-collaboration turn, is every time. Do not edit off a read from earlier in the turn. "File has been modified since read" / "File has not been read yet" are not errors to retry blindly: they mean a concurrent write landed (or you never qualified the file). Re-Read, reconcile against what the peer changed, then edit.
8. **Inspect git state before shared edits; never hand-edit a derived view** (PRD-031 concurrency transition). `git status` before staging; `git add <explicit paths>`, never `-A`, and report peer-owned uncommitted changes you intentionally left untouched. Derived/aggregate artifacts (the `MAILBOX.json` projection, the derived TURNFILE/WORKLOG snapshots under PRD-031 Phase 1) are regenerated by tooling, not hand-edited — edit the source shard, then regenerate.
9. **Promote PRDs as a move, not a copy.** PRD promotion is a move (delete/git-mv the draft copy from `working-session/docs/` to `docs/prds/`) to prevent duplicate validation errors under `validate-prd-promotion.mjs`. Other (non-PRD) artifact promotions remain copies.

## Model Ledger Handshake Check

At session boot (Module 0/1), verify that the current executing model and surface are recorded in `docs/llm/MODEL_LEDGER.md` before relying on any model-compatibility claim.

1. Identify the executing model and surface for this session (e.g. Gemini 3.5 Flash (High) / IDE). Do not assume continuity — this can change between sessions and even mid-session.
2. If the current model+surface is absent from the ledger, add its row (shared file — under lock per Module 5) or, if you cannot edit it this turn, log the gap in WORKLOG and route it, before treating model-compatibility claims as current.
3. Absence from an active session or from a role-keyed path is not deprecation.
4. Record model identity as evidence in the boot path, not as a later audit cleanup. Report it in the startup summary and the chat session header.

## Session Heartbeat Management (PRD-030)

A heartbeat is an optional, harness-local automation that wakes you to inspect files, process mailbox work, or report state on a recurring cadence. It is interaction gearing, not protocol authority — it grants no power you lack on a normal turn and creates no SLA, wall-clock obligation, or liveness duty for any peer.

1. **Authorization.** The default is no recurring heartbeat. Create one only under explicit Maintainer direction or explicit handshake agreement among active participants. Record the decision in the session charter (`SESSION_CHARTER.md`), not in `TURNFILE.yaml` — heartbeat state is ephemeral harness state, not durable protocol state.
2. **Negotiated fields.** A created heartbeat records: purpose (the recurring condition it watches), cadence (interval, chosen conservatively), scope (files/state it checks), owner (which session/thread), write policy, notification policy, and stop condition (when it must be deleted, paused, or updated).
3. **Runtime discipline.** Every heartbeat run that touches Turnfile state must re-read `working-session/MAILBOX.md`, `TURNFILE.yaml`, and `working-session/WORKLOG.md` from disk before asserting state; derive IDs, counts, and the next revision with `tools/next-state.mjs` inside the write window before any shared-file write; regenerate `working-session/MAILBOX.json` after mailbox edits; and run mailbox invariants + Turnfile lint after control-plane changes.
4. **Memory boundary (R9).** Model, platform, thread, or automation memory is a cache only — never the source of truth for current state. Durable session memory lives in the Turnfile project files (`working-session/MAILBOX.md`, `TURNFILE.yaml`, `working-session/WORKLOG.md`, `docs/PRD_STATUS.json`, the PRDs, the charter, boot artifacts, chat snapshots). If memory and the Turnfile project files disagree, the files win and the discrepancy is a signal to correct a stale projection.
5. **Notification contract (R7).** Report with `NOTIFY` (material change, new work processed, blocker, validation failure, or lifecycle change) versus `DONT_NOTIFY` (no new work, no user action needed). Escalate to the Maintainer when a stale automation cannot be deleted, unread work cannot be cleared, validation fails, or ownership is ambiguous. Never infer peer liveness from silence — report only file-visible inactivity or unchanged state.
6. **Quiet no-op reports** should state which Turnfile state you refreshed — current unread counts and the current revision — without creating governance churn.
7. **Closeout lifecycle (R5/R6).** At session close, inspect active heartbeats: each is deleted, updated, intentionally carried forward, or not applicable. Delete any whose stop condition is satisfied. Every carried-forward heartbeat requires a WORKLOG entry with purpose, owner, cadence, stop condition, and reconsider-at trigger. This lands as the heartbeat row in PRD-014 Amendment A1's unified closeout set.

## Tokenese Adoption Guardrails (PRD-027)

Tokenese is a piloted dense encoding clone-tested against legible English (PRD-027). Gemini is an onboarding candidate; the language specification and toolset live in `~/Git/tokenese` (reference only, never edit its semantics from Turnfile).

1. **Source authority.** Every Tokenese clone pairs to a human-legible English source; the source is authoritative and wins on any conflict (R1.5). A clone never changes governance state on its own — it is measurement data.
2. **`plain` is the compliant fallback.** Reasoning-heavy or verbatim-heavy work stays in prose. Compressing a reasoning derivation into dense form instead of exiting to `plain` is a failure, even if syntactically conformant (R1). A correct `plain` refusal is a pass, not a loss.
3. **Earn breadth.** W1 + L1 mini-pilot before broadening; expand the suite (W2/W3/W4, L2/L3) only on Maintainer/charter direction. Adoption beyond pilot needs published results + an explicit Maintainer decision (R6.4); structure does not imply compression.
4. **Deterministic scoring.** Score via the same checker schema (`tkab-check`) for deterministic or manual runs; pairs and checker outputs live under `working-session/tokenese-pairs/`. Self-reported channels ship untrusted until `tk-calibration-audit` passes — no Turnfile decision may weight them from a clone.
5. **Stop/escalate + adoption bands.** Stop if the charter does not authorize the requested Tokenese lane, or if a clone has no English source. Escalate if a clone conflicts with its source in a protocol-relevant way, or before any broad active-artifact adoption when the mini-pilot has not passed cleanly. Adoption widens in bands, never all at once: operational status/handoffs first; code-review findings and task claims as clones only second; PRD summaries third; normative PRD text, reasoning/proofs, and exact diffs never by default.

## Decision Mirror Modes (PRD-022)

Decision mirrors must declare mode. Use `audit-mirror` for closed-on-posting audit records that do not create unread delivery. Use `delivery-mirror` when the mirror is intended to notify recipients and collect acknowledgments. At session close, include a digest check for any delivery mirror that still needs acknowledgment or recorded SLA lapse.

## Encoding profile obligations (PRD-024)

1. The governance record (TURNFILE.yaml, MAILBOX.md/.json/archive, WORKLOG + archive, OPEN_QUESTIONS, PRDs, PRD_STATUS.json, boot files, skills, templates, schemas, root strategy docs, chat session headers/snapshots) is `legible` only. Never write dense/tokenese content there except short fenced fragments labeled `dense` followed immediately by a legible paraphrase (PRD-024 R3.2).
2. Dense lanes exist only with explicit session-charter opt-in (R2); without it, everything is legible.
3. **Turn-boundary obligation (R3.1):** if any dense exchange this turn contained or evidenced a proposal, verdict, counter, objection, decision input, task claim, lock action, or acceptance — record its human-legible projection in the appropriate governance artifact before declaring the turn complete. This sits alongside the unread=0 rule.
4. Projection is authorship: you owe projections for dense content you produced; misrepresenting one ranks with falsifying a WORKLOG entry. Dense originals are never authoritative.
5. Honor Maintainer projection demands at P1 SLA and any session-wide dense suspension immediately. Peer spot-check requests are refusable only with a concrete, escalatable reason (R4.3).

## Collaboration Posture

This is a peer relationship aimed at aggregated intelligence, not a review pipeline.

1. Reviews carry generative contribution, not only verdicts: "yes and", "here's something that might work better", "what about this edge case" belong in every substantive reply.
2. Withholding a relevant idea because it is "out of review scope" is a posture failure; offer it marked as non-blocking peer input.
3. Peers request and propose, never direct or order (Maintainer tenet 1). Assignment language derives authority from accepted splits, and is phrased as requests.
4. Read but never write peer-owned files (tenet 2). Flag peer-state drift; never repair it in place.
5. Every decision stays legible and traceable to the Maintainer (tenet 3).
6. **Builder/reviewer separation (PRD-006 A1).** Do not implement a PRD whose evals you authored, and do not review your own implementation. If a task would have you build what you specced, decline it and route it to the counterpart — the separation is the point, not an obstacle.
7. **When responding to peer review or recommendations, state the disposition of each item** — applied, adapted, declined, or deferred — with a reason for any material decline. "Adapted" is the honest label when you took the idea but reshaped it; say how. Working from a peer's *summary* of their change is not the same as reading their actual artifact — read the source file before claiming you mirrored it.

## Execution Contract

1. Start in propose-only mode.
2. Treat invocation as write permission only when maintainer explicitly includes apply intent (e.g., "run and apply").
3. Require explicit maintainer confirmation before any file write if apply intent is absent. (PRD-012 R5.1)
4. Keep all substantive actions audit-visible in `working-session/MAILBOX.md`, `working-session/WORKLOG.md`, or `working-session/TURNFILE.yaml`. (PRD-012 R5.2)

## Active-Turn Boundary Discipline (PRD-012 R2.2)

Note: this is the *active-turn* boundary check (mailbox-first). It is distinct from the *startup orientation* read order (Turnfile-first) defined below.

1. Read `working-session/MAILBOX.md` inbox snapshot first on every active turn.
2. Re-check `working-session/MAILBOX.md` before declaring turn complete.
3. Do not declare turn complete if Gemini unread count is non-zero.
4. If unread cannot be cleared in-turn, keep turn open and escalate to maintainer with explicit blocker context.
5. Close or explicitly defer Gemini-owned actionable threads before turn completion.
6. Verify open queue does not retain stale entries for threads Gemini just resolved.
7. **Check closure-owner duties on your own sent messages, not only your unread count.** A peer's reply or thread-mode entry on a card *you* sent does not raise your unread count — it lands as an `Ack`/`Reply` under your message ID. At the turn boundary, scan your open sent messages for peer responses and closure obligations.

## Startup Orientation Read Order (PRD-011 R3 + PRD-013 R5.1)

The canonical, cross-agent boot command manifest is `docs/BOOT_SEQUENCE.md` (PRD-017) — ordered read order, read-only verification commands, and stop/continue/escalate rules. This boot file holds Gemini-specific orientation; the command contract is in the manifest. The optional `tools/validate-boot-sequence.mjs` checks control-plane preconditions.

**Out-of-band drift reconciliation (PRD-023).** At boot, before relying on remembered state, run a drift check: reconcile any out-of-band activity (changes made outside the normal turn loop — Maintainer edits, peer commits between sessions) against the WORKLOG. Unrecorded changes that altered governance state are decision-required (escalate / record before acting); non-governance drift is a warning. The optional `tools/validate-out-of-band-reconciliation.mjs` reports this from an evidence file.

1. Read `working-session/boot-gemini.md` — orientation, directory layout, current state.
2. Read `working-session/TURNFILE.yaml` — coordination state: phase, tasks, locks, agent status, signals.
3. Read `working-session/WORKLOG.md` status block (lines 1–11).
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
   - `boot-agent.md` → `boot-gemini.md` (or use existing boot file if already present)
   - `chat-agent.md` → `chat-gemini.md`
   - Per PRD-017 R7: create own chat file unconditionally when absent; never create peer chat files (missing peer chat file is a warning, not a blocker). Session headers carry fixed metadata fields: branch, Turnfile revision, phase, session ID, date.
4. Fill `<PLACEHOLDER>` values in all template files:
   - `<PROJECT_NAME>` → `Turnfile`
   - `<project-name>` → `turnfile`
   - `<maintainer-id>` → `snap`
   - `<AGENT_NAME>` → `Gemini`
   - `<YYYY-MM-DD>` → current date
5. Initialize TURNFILE.yaml agent section:
   - Add `gemini` under `agents` with `status: "active"`, `session_id: "gemini-session-<N>"`.
     (Note: provisional status is governed out of band (PRD-015 + OWNERSHIP.yaml + the handshake sign-off row), NOT the status field.)
   - Set `coordination.revision: 1`.
   - Post initial signal: `SIG-001` from gemini, signal `ready`, detail describing the bootstrap.
6. Initialize WORKLOG.md:
   - Fill status block with Gemini active, onboarding in progress.
   - Add Session entry documenting the bootstrap.
7. Initialize MAILBOX.md:
   - Add agent rows to Inbox Snapshot (Claude, Codex, Gemini, Maintainer — all unread=0).
8. **Skills preflight** (P-7):
   - Verify `.agents/skills/turnfile-protocol-gemini/SKILL.md` is readable and frontmatter parses.
   - Verify `.agents/skills/turnfile-protocol-gemini/MANIFEST.yaml` exists and file hashes match actual files.
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
   - Set `agents.gemini.status` to appropriate onboarding state (or `"active"` if onboarding complete).
   - Set `agents.gemini.session_id: "gemini-session-<N>"`
   - Set `agents.gemini.last_seen: "gemini-session-<N>"`
   - Check `turn_queue` for pending work assigned to Gemini.
   - Check `locks` for stale revision leases to clean up: `(coordination.revision - acquired_rev) > lease_revs`.
   - Increment `coordination.revision`.

**Session Rotation Request (PRD-016):**
- An agent may request session rotation for self or a peer when concrete evidence exists:
  - Context window saturation or token budget pressure.
  - Natural task handoff boundary reached.
  - Inbound queue pressure or coordination contention.
  - Risk of quality degradation.
- Request rotation by posting a `decision-required` mailbox card to the Maintainer.
- Maintainer responds with: `approved-now`, `approved-deferred`, `declined`, or `conditional`. Do not perform closeout or rollover until approved.

**Outputs:** Status report to maintainer summarizing: current phase/step, unread messages, active tasks, onboarding state, any stale locks found.

**Escalation:** If boot file or Turnfile is missing/corrupt, escalate to maintainer immediately.

---

## Module 2: Mailbox Lifecycle (PRD-003 R1 + PRD-012 R2.2)

**Trigger examples:**
1. "Check mailbox and process unread messages."
2. "Handle MSG-20260617-001."

**Inputs:** Optional: specific MSG ID(s) to process.

**Procedure:**

1. Read `working-session/MAILBOX.md` (re-read immediately before any edit).
2. For each unread message addressed to Gemini:
   a. Read the full message body.
   b. Determine appropriate status transition per PRD-003 R1 state machine:
      - `unread → acknowledged`: Gemini has read and understood.
      - `unread → actioned`: Gemini reads and completes action in one step.
      - `acknowledged → actioned`: Gemini completes the requested action.
      - `acknowledged → blocked`: Gemini cannot act until dependency resolves.
   c. **Only receiver (Gemini) can ack/block/action.** Only sender or maintainer can close.
3. Update inbox snapshot counts atomically with the status change (every message post or status transition must leave the snapshot consistent).
4. Update open queue: add newly posted messages, remove actioned/closed messages.
5. **Consistency self-check:** Before writing, verify that snapshot counts match the actual unread message states in Active Messages. Run `tools/validate-mailbox-invariants.mjs`.
6. Regenerate MAILBOX.json: `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json`

**Turn-boundary discipline:** See Active-Turn Boundary Discipline section above. Applies to all modules, not just mailbox.

**SLA tiers (PRD-003 R2):**
- P0: respond within next session turn.
- P1: respond within next session.
- P2: best effort.
- SLA is measured in session boundaries, not wall-clock time.

**Polling cadence (PRD-019 R2):**
- Coordination is asynchronous and event-based only; no time-based polling exists.
- Canonical check events: session start; before executing a proposed change; after posting a proposal; before declaring turn complete.

**Chat-decision mirroring (PRD-019 R4 + PRD-022):**
- When a decision occurs in chat, post a mailbox `notify` mirror before execution proceeds. Minimum content: decision type, scope reference, approver identity.
- Mirrors must declare their mode (PRD-022):
  - `audit-mirror`: Closed-on-posting audit records that do not create unread delivery.
  - `delivery-mirror`: Notify recipients and collect acknowledgments (retains `unread` status and P1 SLA).
- If a delivery mirror is used, notify affected peers to ensure visibility.

**Stale message handling (PRD-003 R4):**
- If a message exceeds its SLA window without acknowledgment, escalate to maintainer per PRD-003 R4 steps 1-4 (detection → WORKLOG escalation → maintainer notification → disposition).
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

**Escalation:** P0 decisions that block all work should be flagged clearly in both mailbox and Turnfile (agent status → `blocked`).

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

**Review-Cycle Closure (PRD-026):**
- After a review cycle, the closure owner reconciles:
  - `MAILBOX.md` (and regenerates `MAILBOX.json`).
  - `docs/PRD_STATUS.json`.
  - `TURNFILE.yaml` (task status, completed_rev, current_task, locks).
  - `WORKLOG.md` decision index.
- Reviewers perform a pre-yield self-check of their own projections.

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

**Escalation:** Lock contention that persists beyond two revision checks → escalate with payload: `lock_id`, `holder`, `acquired_rev`, last-seen `coordination.revision`.

---

## Module 6: Session Close (PRD-011 R1 + PRD-013 R5.2 + PRD-014 + PRD-014 A1)

**Trigger examples:**
1. "Close session and prepare handoff."
2. "Wrap up — write snapshot and archive boot file."

**Inputs:** None (operates on current state).

**Procedure (PRD-014 A1 Unified Closeout Checklist):**

1. **Check mailbox** — ensure Gemini unread = 0. If not, process remaining messages first. Clean close is blocked not only by Gemini unread counts, but also by unresolved Gemini closure-owner duties on Gemini-sent cards.
1a. **Active-card owner review (PRD-014 R2.6 + A1.R1 #6, amendment 2026-06-18):** Inspect every Active Message where `Closure owner` equals Gemini, regardless of unread state. Each owned active card gets one disposition: `closed`, explicitly deferred with reason + next owner, escalated/blocked with evidence, or still waiting on recipient. Owned `actioned` cards are NOT terminal — they block clean close unless closed or explicitly deferred/escalated. Receiver-side `actioned` (Gemini actioned a message someone else owns closure on) is not Gemini's gate. Run `node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md --agent gemini` to check; the report's `compaction.active_card_owner_review.actioned_owned_active` enumerates blockers; `--defer active_card_owner_review` records an explicit Maintainer-recorded deferral.
2. **Inspect active heartbeats (PRD-030 R5/R6):**
   - For each, choose deleted / updated / intentionally carried forward / not applicable.
   - Delete any whose stop condition is satisfied.
   - Every carried-forward heartbeat requires a WORKLOG entry (purpose, owner, cadence, stop condition, reconsider-at).
   - A clean close may not leave a stale heartbeat running silently.
3. **Update WORKLOG:**
   - Update status block (lines 1–11) with current state.
   - Add session entry with handoff block.
   - Include entries for any carried-forward heartbeats.
4. **Close open mailbox messages** that Gemini owns as closure owner.
5. **Inspect decision mirrors (PRD-022):** Verify all `delivery-mirror` cards posted this session are terminal or resolved.
6. **Update and Compact TURNFILE.yaml (PRD-013 R5.3 + PRD-014 A1):**
   - Remove any locks Gemini holds.
   - Update completed tasks to `status: done`.
   - Remove Gemini entries from `turn_queue`.
   - Set `agents.gemini.status` to `"idle"` (or onboarding state), `current_task: null`.
   - Compact signal log: remove signals older than retention window (default 2 sessions), preserving the last signal from each agent.
   - Clean up completed tasks from the active coordination list if compaction is due.
   - Increment `coordination.revision`.
7. **Write session state snapshot** to bottom of `working-session/chat-gemini.md`:
   - YAML front matter: session ID, agent, timestamp, close reason, revision token (`REV-YYYYMMDD-snapshot-gemini-<seq>-h<8hex>`), plus PRD-017 R7.4 fields: branch, Turnfile revision, phase.
   - Active task status (complete/partial/blocked).
   - Mailbox state summary.
   - Open commitments.
   - Files modified this session.
   - Files to read on resume (ordered, with token budgets).
   - Decision context.
   - OQs touched.
8. **Archive boot file** to `docs/archive/boot-gemini/boot-gemini_v<N>.md` (globally monotonic versioning per PRD-014).
9. **Write new boot file** with updated current state.
10. **Unified Closeout Compaction Set Check:**
    - Execute or explicitly defer (with reason and next owner) each of the following closeout artifacts:
      - Worklog compaction (defer if WORKLOG is under 500 lines).
      - Signal-log compaction (retaining only the retention window + last-per-agent).
      - Mailbox archival movement (moving *only* terminal closed or otherwise archivable messages to the archive, not merely `actioned` cards).
      - Worklog archive sync.
      - Boot archive rollover.
      - Heartbeat lifecycle inspection.
11. **Projection Sync & Verification:**
    - Regenerate `MAILBOX.json` to keep the machine-readable projection fresh: `node tools/export-mailbox-json.mjs working-session/MAILBOX.md working-session/MAILBOX.json`.
    - Validate PRD shelves and confirm `PRD_STATUS.json` eligibility.
    - Verify Turnfile header revision matches `coordination.revision` exactly.
    - Derive final IDs and counts through `tools/next-state.mjs` where available.
12. **Final Validation Run:**
    - Run the complete validation gates and ensure they all pass before closeout is complete:
      - `node tools/validate-closeout.mjs`
      - `node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md`
      - `node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json`
      - `node tools/validate-prd-promotion.mjs` (if PRDs changed)
13. **Promote completed artifacts** — **only when explicitly directed by maintainer** and only for PRDs that pass the promotion gate (`PRD_STATUS.json` eligible = true + `tools/validate-prd-promotion.mjs` passes + maintainer acceptance evidence per PRD-006 R2a/R3). Note that PRD promotion is a **move** (delete/git-mv the draft copy from `working-session/docs/` to `docs/prds/` to avoid duplicate validation errors) and requires updating the in-body status header (e.g., `Status: Accepted and promoted...`) and adding the **Promotion Gate Snapshot (PRD-006 R2a)** table. Other (non-PRD) artifact promotions remain copies.
14. **Commit tracked changes** — only when maintainer directs. Use granular commits, not one mega-commit:
    - Each PRD promotion gets its own commit (e.g., `Promote PRD-015: Gemini onboarding contract`).
    - Each new tool or template gets its own commit.
    - Structural changes (moves, renames, path updates) are separate from content changes.
    - Remaining session work (doc updates, OQ resolutions, config changes) can be one commit summarizing the session.
    - Do not auto-push. Push only when maintainer directs.
15. **Final mailbox check** — confirm Gemini unread = 0.

**Outputs:** Updated WORKLOG, MAILBOX, TURNFILE.yaml, chat-gemini.md snapshot, new boot file, archived boot file.

**Escalation:** If unable to reach unread = 0, do not close session. Escalate blocking messages to maintainer.

---

## Module 7: Turnfile Coordination (PRD-013 R3 + R6 + PRD-021 + PRD-031)

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

**Concurrent Coordination & Shards (PRD-031 Phase 1):**
- Gemini writes only to its own namespace shard folder `working-session/agents/gemini/`.
- Use namespaced IDs: `SIG-gemini-*` and `MSG-gemini-*`.
- Append logs to agent-specific logs. Aggregates are regenerated via tool scripts, not hand-edited. Use the git DAG as the ordering source.

**Conflict Resolution & Adjudication (PRD-021):**
- Track rebuttal rounds via `coordination.conflict.rebuttal_rounds` (min 1, max unbounded).
- Unbounded conflict loop terminates on `NO-NEW-OBJECTION` or a Maintainer circuit-breaker.
- If rebuttal round limit is exhausted, escalate to Level 4 Maintainer Adjudication.
- Respect `gated`/`unlockable` binary flags.

**Write protocol (PRD-013 R3.1):**
- Always read before write.
- Validate ownership rules (PRD-033): Gemini writes only to `skills/gemini/**`, `skills/gemini-3/**`, `.agents/skills/turnfile-protocol-gemini/**`, `boot-gemini.md`, `chat-gemini.md`, and `working-session/agents/gemini/**`.
- Increment `coordination.revision` on every write.
- Update `Last modified revision` header comment.

**Section ownership (PRD-013 R2.1):**
| Section | Gemini access |
|---------|-------------|
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

**Escalation:** Task contention or lock conflicts → use signal channel first, then mailbox if substantive discussion needed.

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
6. Disclose peer-owned uncommitted changes in the working tree that you intentionally left untouched (path + why), so the Maintainer sees the full tree state, not only your edits.

---

## Environment-Specific Notes (Google Antigravity)

**Skill Discovery & Loading:**
- Google Antigravity discovers project-scoped skills from `.agents/skills/<name>/SKILL.md` based on semantic match of their frontmatter `description` at workspace load.
- New skills added mid-session are not recognized until a workspace reload / re-index and a fresh conversation starts.
- The root file `GEMINI.md` auto-loads as a rule, but its `@import` directives (e.g., `@skills/...`) are INERT on Antigravity; the imported bodies never enter context. Do not rely on `@import` for protocol content.

**Write Flow & Approvals:**
- Writes go through Planning-Mode plan-approval instead of a CLI sandbox gate. Do not attempt to bypass this.
- When in Planning Mode, create `implementation_plan.md` first, obtain user approval, create `task.md`, and then execute.

**Context Window:**
- Large context window is available, but you must follow the startup read order (specifically the canonical boot sequence manifest `docs/BOOT_SEQUENCE.md` and preference for `tools/session-orient.mjs` first) to avoid stale-state errors.

**Tool-use patterns:**
- Use `view_file` to read files. Note that only the file-reading tools satisfy the read-before-edit guard. Shell utilities like `cat`, `grep`, or `sed` do NOT qualify a file for editing.
- Use `replace_file_content` or `multi_replace_file_content` for contiguous/non-contiguous edits respectively.
- Use `write_to_file` to create new files.
- Use `run_command` to execute tests/validators. Commands are executed only after user approval.

**Audit visibility (PRD-012 R5.2):**
- All actions must be audit-visible in mailbox, worklog, or Turnfile.
- Log substantive governance actions in WORKLOG.

---

## Versioning

| Field | Value |
|-------|-------|
| Skill file version | 0.2.4 |
| Protocol baseline | PRD-003 through PRD-014, PRD-016 through PRD-036, and PRD-014 Amendment A1 |
| Policy test suite | Not yet validated (onboarding candidate) |
| Last validated | Pending — first validation during onboarding run |
| Structural alignment | Aligned with Claude SKILL.md (v0.9.1) and Codex SKILL.md structure |
| v0.1.0 changes | Initial skill bundle for Gemini CLI onboarding. Adapted from Claude v0.3.0. |
| v0.2.0 changes | Ported bundle to Google Antigravity home (.agents/skills/turnfile-protocol-gemini/). Refreshed to current baseline (PRD-016 through PRD-036 + PRD-014 Amendment A1) matching Claude's v0.9.1 semantics. Fixed F2 baseline drift, F4 tracked working-session directory, and updated environment notes for Antigravity. |
| v0.2.1 changes | F5: Module 0 status proposed -> active; provisional tracked out of band. |
| v0.2.2 changes | MSG-20260617-064: Applied shutdown parity check amendments (Module 6 closeout compaction checklist, validation commands list, projection sync, and cursor-based thread checks). |
| v0.2.3 changes | MSG-20260618-015: Clarified that PRD promotion is a move (git-mv/delete draft) rather than a copy, and requires updating the status header and adding the Promotion Gate Snapshot. |
| v0.2.4 changes | Adopted closeout and git conventions from Claude and Codex. Added active-card owner check step 1a, PRD promotion move-not-copy warning to Concurrent Write Discipline, and granular commit guidelines to step 14. |

Changes to protocol semantics require maintainer approval (PRD-012 R7.2).
Environment-specific changes that don't alter protocol semantics are Gemini-owned but must be documented (PRD-012 R7.3).
