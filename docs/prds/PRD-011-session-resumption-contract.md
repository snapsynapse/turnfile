# PRD-011: Session Resumption Contract

Status: Draft (inception)
Owner: Claude (draft) + Codex (review) + Maintainer
Date: 2026-02-08

## Problem

Stateless LLM agents lose all working context when a session ends — whether by context window exhaustion, timeout, or explicit close. Resuming work requires reconstructing the full operational state from files on disk. This is currently the single largest source of wasted throughput in the SNAP protocol.

Observed failure modes:

1. **Context window exhaustion triggers emergency summarization.** When an agent approaches its context limit, it must compress the entire session into a summary that a fresh instance can use. This summary is lossy — nuanced reasoning, partial conclusions, and inter-document relationships get flattened. The receiving instance starts with a degraded mental model.

2. **Session startup tax is O(n) in project complexity.** A new agent instance must read WORKLOG (800+ lines), MAILBOX, OPEN_QUESTIONS, SESSION_CHARTER, the chat mirror, and every file it might need to touch — before doing any actual work. This read-in phase burns 20-40% of the usable context window on orientation.

3. **No standard for what "resumption state" looks like.** Each agent improvises its own summary format. Some are structured; some are narrative. Some include file paths; some don't. The receiving instance has no contract for what information to expect, so it defensively re-reads files that were already summarized.

4. **Cross-agent resumption is worse than self-resumption.** If Agent A's session ends mid-task and Agent B is asked to continue, B has no structured way to pick up A's partial progress. The maintainer must manually explain what A was doing.

## Goal

Define a resumption contract that:

1. Standardizes the information a closing session must preserve for its successor.
2. Minimizes the read-in cost for a fresh agent instance.
3. Supports both self-resumption (same agent, new context) and cross-agent handoff (different agent picks up work).
4. Keeps the resumption artifact lightweight and markdown-canonical.

## Non-goals

1. Solving the context window limit itself (that's a model constraint, not a protocol problem).
2. Requiring agents to checkpoint mid-session at fixed intervals.
3. Introducing a persistent memory or database layer.
4. Replacing the WORKLOG as the canonical session record.

## Users

1. **Resuming agent instance:** needs a compact, structured artifact that lets it start productive work immediately instead of re-reading everything.
2. **Maintainer:** needs confidence that session transitions don't lose decisions, partial work, or commitments to the other agent.
3. **Peer agent:** needs to know whether the other agent's work was left complete or mid-stream, and what commitments carry over.

## Requirements

### R1. Session state snapshot format

When a session is approaching its end (or when the agent completes a natural stopping point), the agent should produce a **session state snapshot** in a standardized format. This snapshot is the primary resumption artifact.

The snapshot uses **YAML front matter** for structured metadata (identity block, revision token, mailbox state summary) and **markdown body** for narrative sections. This enables tooling to parse snapshot state programmatically while keeping the human-readable parts in markdown.

Required sections:

1. **Identity block** (YAML front matter) — session ID, agent name, timestamp, reason for close (completed | context-exhausted | timeout | maintainer-directed), and a **revision token** for cross-agent validation (format: `REV-YYYYMMDD-snapshot-<agent>-<seq>-h<8hex>`; checksum semantics follow PRD-008 R4 normalization rules).
2. **Active task** — what was in progress at close, its status (complete | partial | blocked), and the specific next action needed.
3. **Mailbox state** — unread messages for this agent, any pending acks, any messages this agent posted that haven't been responded to.
4. **Open commitments** — promises made to the other agent or maintainer that haven't been fulfilled (e.g., "will review PRD-008 next session").
5. **Files modified this session** — list with one-line description of each change.
6. **Files to read on resume** — ordered list of files the successor instance should read, prioritized by relevance to the active task. Each entry should include an **approximate token budget** (e.g., `~200 lines / ~4K tokens`) so the resuming agent can make informed skip/scan/read decisions based on remaining context window. This replaces the "read everything" approach.
7. **Decision context** — any decisions made this session that affect future work, with enough context to understand *why* (not just *what*).
8. **Open questions touched** — OQ IDs resolved or created this session.

### R2. Snapshot placement

Session state snapshots should be written to:

1. **Primary:** the agent's chat mirror file (`chat-claude.md` or `chat-codex.md`), as the last entry of the session.
2. **Secondary:** referenced in the WORKLOG session entry with a pointer to the chat mirror.

The snapshot does NOT go in the WORKLOG body (which is already too long). The WORKLOG entry includes a one-line summary and a pointer: "Full resumption snapshot: `inception/chat-claude.md` § Session N closing state."

### R3. Resumption read order

A fresh agent instance should read files in this order:

1. Session state snapshot from predecessor (in chat mirror).
2. TURNFILE.yaml — coordination state (phase, tasks, locks, agent status, signals). Compact and actionable; provides the most immediate context for what to do next. (Added per OQ-042 resolution and PRD-013 R5.1.)
3. WORKLOG status block only (top ~10 lines, not the full history).
4. MAILBOX inbox snapshot + any unread messages for this agent.
5. Files listed in the snapshot's "files to read on resume" section.
6. OPEN_QUESTIONS registry (scan, not deep read).

This replaces the current ad-hoc "read everything and hope you find what matters" approach. The Turnfile is positioned before the WORKLOG because it is the most token-efficient source of current coordination state; the WORKLOG expands context and detail.

Scope note: this is startup-orientation read order. Active-turn boundary checks remain governed by PRD-012 R2.2 (`MAILBOX.md` checked first and last before turn completion).

### R4. Cross-agent resumption

When Agent A's work is picked up by Agent B:

1. Agent A's closing snapshot must be self-contained enough for a different agent to use.
2. The maintainer posts a handoff message in the mailbox referencing Agent A's snapshot.
3. Agent B reads the snapshot, the handoff message, and the "files to read" list — nothing else is required.

### R5. WORKLOG compaction trigger

To address WORKLOG growth:

1. When the WORKLOG exceeds 500 lines (excluding the status block and decision index), the agent performing the next WORKLOG update should propose a compaction.
2. Compaction moves completed entries to a WORKLOG_ARCHIVE.md file. Partial compaction is allowed — individual completed entries may be archived even if other entries in the same session remain active, as long as the archived entry has no open references from active entries.
3. The decision index and status block remain in the primary WORKLOG.
4. Compaction requires maintainer approval (it's a destructive transformation of the primary coordination artifact).

### R6. Snapshot validation

A session state snapshot is valid if:

1. The active task section matches the WORKLOG status block for that agent.
2. The mailbox state section matches the actual MAILBOX inbox snapshot.
3. Every file listed in "files modified" actually exists on disk.
4. Every OQ referenced in "open questions touched" exists in the registry.

Validation is manual during pilot. A helper script may be added later (see OQ-036).

## Interaction with existing protocol

| Document | Impact |
|----------|--------|
| `inception/chat-claude.md` / `inception/chat-codex.md` | Becomes the canonical location for session state snapshots (R2) |
| `inception/TURNFILE.yaml` | First artifact in R3 read order (before WORKLOG). Provides coordination state (phase, tasks, locks, agent status). Per OQ-042 + PRD-013 R5.1. |
| `inception/WORKLOG.md` | Status block remains primary context expander; body growth addressed by compaction trigger (R5) |
| `inception/MAILBOX.md` | No format change; snapshot references mailbox state |
| PRD-003 (message lifecycle) | No change; mailbox state in snapshot uses existing status semantics |
| PRD-006 (session promotion) | Snapshots are inception-only artifacts; not promoted to canonical |
| PRD-008 (cross-sandbox handoff) | Cross-agent resumption (R4) uses existing payload-first delivery for the handoff message |
| PRD-010 (shared-file locking) | WORKLOG compaction (R5) is a shared-file mutation and follows PRD-010 Turnfile lease-lock protocol |
| PRD-013 (Turnfile coordination) | Turnfile integrated into R3 read order. Agent session status self-reported in Turnfile per PRD-013 R5.1/R5.2. |
| PRD-012 (skills) | R3 startup order and PRD-012 R2.2 turn-boundary mailbox checks are complementary, not conflicting. |

## Acceptance criteria

1. At least one session close produces a valid R1 snapshot in the chat mirror.
2. The successor instance starts productive work within 4 file reads (snapshot + Turnfile + WORKLOG status + unread mailbox).
3. At least one cross-agent resumption uses the R4 handoff path without the maintainer needing to explain context verbally.
4. WORKLOG compaction is proposed when the file exceeds 500 lines.

## Risks

1. **Snapshots add end-of-session overhead.** Mitigation: snapshots are lightweight (structured, not narrative) and replace the unstructured summaries agents already produce. Net overhead should be near zero.
2. **Snapshot accuracy depends on agent discipline.** If the closing agent writes a sloppy snapshot, the resuming agent starts with bad state. Mitigation: R6 validation checks.
3. **WORKLOG compaction loses navigability.** Maintainer may want the full history in one file. Mitigation: compaction is opt-in (requires maintainer approval) and archived entries remain in WORKLOG_ARCHIVE.md.

## Dependencies

1. PRD-003 message lifecycle contract (mailbox state semantics).
2. PRD-010 shared-file locking (Turnfile lease-lock protocol for WORKLOG compaction).
3. PRD-013 Turnfile coordination format (Turnfile integrated into R3 read order per OQ-042).
4. Chat mirror convention (already established).

## Milestones

1. M0: Draft PRD-011. ✓
2. M1: Pilot R1 snapshot format at the end of this session. ✓ (Session 7 closing snapshot in chat-claude.md.)
3. M2: Validate R3 read order in next session resumption. ✓ (Session 10 used Turnfile-first read order per OQ-042.)
4. M3: Test cross-agent resumption (R4) at least once. *(Pending — not yet tested.)*
5. M4: WORKLOG compaction pilot (R5). ✓ (Two compactions completed: sessions 0-4 in session 8, sessions 5-8 in session 10.)
6. M5: Decide canonical adoption path.

## Open questions

1. ~~Should session state snapshots include a token budget estimate for the "files to read on resume" list, so the resuming agent can decide what to skip?~~ **Resolved: Yes.** Each entry in the "files to read on resume" list should include an approximate token budget (e.g., `~200 lines / ~4K tokens`) so the resuming agent can make informed decisions about what to read in full vs. scan vs. skip based on remaining context window. Applied to R1.6.
2. ~~Should the snapshot format be machine-parseable (YAML/JSON front matter) or purely markdown?~~ **Resolved: YAML front matter.** Snapshots should use YAML front matter for the identity block and structured metadata, with markdown body for the narrative sections. This enables tooling to parse snapshot state programmatically while keeping the human-readable body in markdown. Applied to R1.
3. ~~Should WORKLOG compaction preserve session boundaries (move whole sessions) or allow partial compaction (move individual entries)?~~ **Resolved: Partial compaction allowed.** Compaction may move individual completed entries even if other entries in the same session remain active. This allows more aggressive compaction and prevents old sessions from blocking archive just because one entry has an open reference. Applied to R5.2.
4. ~~Should snapshots be versioned with a revision token for cross-agent validation?~~ **Resolved: Yes.** Snapshots should include a revision token in the YAML front matter for cross-agent validation. This enables the receiving agent (or maintainer) to confirm they are reading the correct snapshot version and detect stale/superseded snapshots. Applied to R1.1.
