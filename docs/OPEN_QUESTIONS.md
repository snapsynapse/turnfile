# Open Questions Registry

Tracks all open questions across inception PRDs. Agents should check this file at session start and update it when resolving questions.

Last updated: 2026-02-08 (PRD-012 added with OQ-037..OQ-040)

## Active Questions

| ID | Source PRDs | Question | Status | Resolution |
|----|------------|----------|--------|------------|
| OQ-037 | PRD-012 #1 | Where should canonical protocol skills live: repository-managed artifacts, per-agent home directories, or a hybrid model? | open | — |
| OQ-038 | PRD-012 #2 | Should Claude and Codex use one shared core file with thin wrappers, or separate full skills reconciled by policy tests? | open | — |
| OQ-039 | PRD-012 #3 | How strict should skill triggering be: explicit maintainer invocation only, or heuristic trigger suggestions? | open | — |
| OQ-040 | PRD-012 #4 | Should skills auto-apply low-risk formatting/state updates, or always require explicit maintainer confirmation before writes? | open | — |

## Deferred Questions

| ID | Source PRDs | Question | Status | Resolution |
|----|------------|----------|--------|------------|
| OQ-003 | PRD-001 #3 | Should maintainer replies require a minimum template snippet for consistency? | deferred | Maintainer deferred decision pending worked examples. PRD-004 R4 template exists but mandatory scope remains undecided. |
| OQ-026 | PRD-007 #2 | Which trust anomalies should block canonical promotion under PRD-006, if any? | deferred | Maintainer deferred decision pending worked examples ("need to examine this further with examples"). |

## Resolved Questions

| ID | Source PRDs | Question | Status | Resolution |
|----|------------|----------|--------|------------|
| OQ-001 | PRD-001 #1, PRD-004 #1 | Should `approval-required` be a first-class message type or a constrained form of `decision-required`? | resolved | Deferred until pilot evidence. Use `decision-required` for now (PRD-003 R3, PRD-004 R2). |
| OQ-002 | PRD-001 #2 | Do we enforce absolute timestamps (ISO-8601) for all due fields in pilot? | resolved | No. Session-relative values are valid. ISO-8601 accepted but not mandated. (Maintainer decision, PRD-004 R3.) |
| OQ-004 | PRD-003 #1 | Should the state machine support a `blocked` status for dependency-blocked messages? | resolved | Yes. Added to PRD-003 R1 state machine. Entered from `acknowledged`, exempt from stale detection. (Maintainer decision.) |
| OQ-005 | PRD-003 #2 | Should SLA violations be tracked as a metric for PRD-007 (trust + provenance)? | resolved | Yes. PRD-007 R3 will consume `sla_missed` events as trust signals. Added to PRD-003 interaction table. (Maintainer decision.) |
| OQ-006 | PRD-003 #3 | Should `closed` messages be auto-moved from Active Messages to Closed Summary, or remain manual? | resolved | Auto-move. Closing actor moves to Closed Summary in same session. Added as PRD-003 R6. (Maintainer decision.) |
| OQ-007 | PRD-004 #2 | Do we require absolute timestamp format for `Response needed by` in all maintainer decisions? | resolved | No. Resolved with OQ-002. Session-relative values are valid. (Maintainer decision, PRD-004 R3.) |
| OQ-008 | PRD-004 #3 | Should malformed decision requests be auto-rejected or accepted with a required-fix warning? | resolved | Accept with required-fix warning. Not auto-rejected. Applied to PRD-004 R2. (Maintainer decision.) |
| OQ-009 | PRD-004 #4 | Should relay messages require an explicit maintainer quote block for legal/audit contexts? | resolved | Yes. Relay messages must include maintainer's exact words in blockquote. Applied to PRD-004 R7. (Maintainer decision.) |
| OQ-010 | PRD-009 #1 | Should the open question registry live in inception/ (local) or be promoted to a tracked file? | resolved | Promote to tracked file for cross-session persistence. Lives in `inception/` during pilot; moves to tracked path at canonical promotion. (Maintainer decision.) |
| OQ-011 | PRD-009 #2 | Should R4 attribution comments use a standardized parseable format or freeform HTML comment? | resolved | Freeform HTML comment is sufficient. No parseable format required. (Maintainer decision.) |
| OQ-012 | PRD-009 #3 | Should resolved open questions be archived or kept inline with resolved status? | resolved | Archive. Move resolved questions to separate section/file to keep active registry compact. (Maintainer decision.) |
| OQ-013 | PRD-008 #1 | Should we enforce a maximum payload size per message before mandatory chunking? | resolved | Yes. Enforce cap of 16 KiB or 300 lines per payload block; chunk above cap. (Maintainer decision; PRD-008 R3.) |
| OQ-014 | PRD-008 #2 | Should revision tokens include a checksum segment for stronger integrity guarantees? | resolved | Yes. Use checksum-bearing revision format `REV-...-h<8hex>`. (Maintainer decision; PRD-008 R4.) |
| OQ-015 | PRD-008 #3 | Should malformed payloads auto-escalate after one resend failure? | resolved | Yes. Auto-escalate to WORKLOG + Maintainer after second malformed attempt on same revision root. (Maintainer decision; PRD-008 R5.) |
| OQ-016 | PRD-008 #4 | Should we add a helper script/template generator for payload envelopes? | resolved | Yes. Add helper tooling requirement and milestone for envelope generator. (Maintainer decision; PRD-008 R9, M4.) |
| OQ-017 | PRD-005 #1 | Should schema versioning be strictly semver, or include date-stamped compatibility labels? | resolved | Include date-stamped compatibility labels (not semver-only). (Maintainer annotation in PRD-005.) |
| OQ-018 | PRD-005 #2 | Should mailbox payload blocks be fully represented in projection JSON or summarized? | resolved | Fully represented in projection JSON (not summarized). (Maintainer annotation in PRD-005.) |
| OQ-019 | PRD-005 #3 | Should `WORKLOG.json` entry IDs be deterministic hashes or sequential IDs? | resolved | Sequential IDs (not deterministic hashes). (Maintainer annotation in PRD-005.) |
| OQ-020 | PRD-005 #4 | Where should canonical schema files live once promoted (`docs/schemas/`, `schemas/`, or both)? | resolved | Canonical location is `docs/schemas/` (not root `schemas/`; no dual canonical locations). (Maintainer annotation in PRD-005.) |
| OQ-021 | PRD-006 #1 | Should there be a "staging" tier between inception and canonical (e.g., `docs/drafts/`) for partially validated documents? | resolved | No staging tier. Keep two-path promotion model (canonical vs archival). (Maintainer annotation in PRD-006.) |
| OQ-022 | PRD-006 #2 | Should archival promotion include the full mailbox archive or only the compact operational view? | resolved | Compact operational view only (not full archive). (Maintainer annotation in PRD-006.) |
| OQ-023 | PRD-006 #3 | Should promoted canonical docs retain a link back to their inception origin for audit trail? | resolved | Yes. Retain an inception-origin backlink for audit traceability. (Maintainer annotation in PRD-006.) |
| OQ-024 | PRD-006 #4 | Should R4a transformation rules be automated with a script, or is manual transformation sufficient at current scale? | resolved | Manual is sufficient now; automation is desired later (phased approach). (Maintainer annotation in PRD-006.) |
| OQ-025 | PRD-007 #1 | Should trust signals be session-local only, or persisted across sessions for trend analysis? | resolved | Session-local only (no cross-session persistence in pilot). (Maintainer annotation in PRD-007.) |
| OQ-027 | PRD-007 #3 | Should relay ambiguity be treated as a hard error or a soft warning in pilot? | resolved | Soft warning in pilot. (Maintainer annotation in PRD-007.) |
| OQ-028 | PRD-007 #4 | Should trust snapshots be generated on fixed cadence or event-triggered only? | resolved | Event-triggered only (no fixed cadence in pilot). (Maintainer annotation in PRD-007.) |
| OQ-029 | PRD-010 #1 | Should lock declarations live in mailbox cards or a dedicated `LOCKS.md` file? | resolved | Dedicated `LOCKS.md` file. Keeps lock state separate from message content. (Maintainer decision.) |
| OQ-030 | PRD-010 #2 | Should lock expiry be fixed (2 min) or file-type specific? | resolved | Fixed 2-minute expiry for all file types. Short enough to avoid stale locks. (Maintainer decision.) |
| OQ-031 | PRD-010 #3 | Should `docs/README.md` remain in shared-lock scope or move to PRD-owner-only scope? | resolved | Stays in shared-lock scope. Both agents update it when adding PRDs. (Maintainer decision.) |
| OQ-032 | PRD-010 #4 | Should invariant checks be automated in a helper script? | resolved | Yes. Automate mailbox invariant validation (unread counts, status agreement, monotonic IDs). (Maintainer decision.) |
| OQ-033 | PRD-011 #1 | Should session state snapshots include a token budget estimate for the "files to read" list? | resolved | Yes. Include approximate token budget per file entry for informed skip/scan/read decisions. (Maintainer decision.) |
| OQ-034 | PRD-011 #2 | Should the snapshot format be machine-parseable (YAML/JSON front matter) or purely markdown? | resolved | YAML front matter for structured metadata; markdown body for narrative sections. (Maintainer decision.) |
| OQ-035 | PRD-011 #3 | Should WORKLOG compaction preserve session boundaries or allow partial compaction? | resolved | Partial compaction allowed. Individual completed entries may be archived even if session has other active entries. (Maintainer decision.) |
| OQ-036 | PRD-011 #4 | Should snapshots be versioned with a revision token for cross-agent validation? | resolved | Yes. Include revision token in YAML front matter for snapshot version validation. (Maintainer decision.) |

## Deduplication Notes

- OQ-002 and OQ-007 ask the same question (absolute timestamps for due fields). Resolve together.
- OQ-001 is resolved — both PRD-003 and PRD-004 agree to defer `approval-required` formalization.
- OQ-020 and OQ-024 were related and are now both resolved (schema location + phased automation).
- OQ-005 and OQ-025 were related and are now both resolved (SLA/trust signals remain session-local in pilot).
- OQ-021 and OQ-026 are related — promotion gating thresholds still depend on deferred OQ-026 trust-anomaly policy.
- OQ-029 and OQ-032 were related and are now both resolved (dedicated lock file + invariant automation).
- OQ-034 and OQ-011 were related and are now both resolved (parseability needed for snapshots, not attribution comments).
- OQ-032 and OQ-036 were related and are now both resolved (automation + revision validation for protocol artifacts).
- OQ-037 and OQ-020 are related — canonical location policy for skills should align with canonical schema/document placement policy.
- OQ-040 and OQ-003 are related — mandatory template/approval scope and auto-apply behavior should be decided together.
