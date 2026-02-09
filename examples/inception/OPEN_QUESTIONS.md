# Open Questions Registry

Tracks all open questions across inception PRDs. Agents should check this file at session start and update it when resolving questions.

Last updated: 2026-02-08 (Resolved OQ-026 + OQ-045..050 from maintainer inline annotations. 0 active, 0 deferred, 50 resolved.)

## Active Questions

*No active questions.*

## Deferred Questions

*No deferred questions.*

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
| OQ-037 | PRD-012 #1 | Where should canonical protocol skills live: repository-managed artifacts, per-agent home directories, or a hybrid model? | resolved | Hybrid model: both repository-managed artifacts AND per-agent home directories. Skills live in both locations. (Maintainer inline annotation in PRD-012.) |
| OQ-038 | PRD-012 #2 | Should Claude and Codex use one shared core file with thin wrappers, or separate full skills reconciled by policy tests? | resolved | Separate full skills reconciled by policy tests. Not a shared core with thin wrappers. (Maintainer inline annotation in PRD-012.) |
| OQ-039 | PRD-012 #3 | How strict should skill triggering be: explicit maintainer invocation only, or heuristic trigger suggestions? | resolved | Explicit maintainer invocation only. No heuristic trigger suggestions. (Maintainer inline annotation in PRD-012.) |
| OQ-040 | PRD-012 #4 | Should skills auto-apply low-risk formatting/state updates, or always require explicit maintainer confirmation before writes? | resolved | Always require explicit maintainer confirmation before writes. No auto-apply. (Maintainer inline annotation in PRD-012.) |
| OQ-041 | PRD-013 #1 | How long should Turnfile signal messages persist? Fixed window or configurable? | resolved | Configurable by maintainer per project, default 2 sessions. Not a fixed-only window. (Maintainer inline annotation in PRD-013.) |
| OQ-042 | PRD-013 #2 | Where should Turnfile sit in the PRD-011 R1 resumption read order? Between WORKLOG status block and mailbox, or first? | resolved | Turnfile first — before WORKLOG status block. Rationale: coordination state is the most compact and actionable context for resumption. Applied to PRD-011 R3 and PRD-013 R5.1. (Maintainer inline annotation in PRD-013.) |
| OQ-043 | PRD-013 #3 | Does each project get its own TURNFILE.yaml, or is there a parent Turnfile for multi-workspace coordination? | resolved | Per-project. Each project gets its own TURNFILE.yaml. No parent/multi-workspace Turnfile in pilot. (Maintainer inline annotation in PRD-013.) |
| OQ-044 | PRD-013 #4 | Who can add new agents to the Turnfile agents section — maintainer only, or can agents self-register? | resolved | Agent is registered as part of onboarding. Process to be specified after completion of Phase 2. No self-registration. (Maintainer inline annotation in PRD-013.) |
| OQ-026 | PRD-007 #2 | Which trust anomalies should block canonical promotion under PRD-006, if any? | resolved | Accepted Claude's worked-example framework: quality-affecting anomalies (substantive contradictions, unresolved disputes) block promotion; process anomalies (SLA, format, relay) receive `conditional` or `allow` disposition per PRD-006 R2a.7. (Maintainer accepted in PRD-007 OQ section.) |
| OQ-045 | PRD-014 #1 | Should reflection blocks use a strict template or remain freeform? | resolved | Freeform, under 100 characters. No strict template. (Maintainer inline annotation in PRD-014.) |
| OQ-046 | PRD-014 #2 | Should boot archive version naming be globally monotonic or per-agent monotonic? | resolved | Globally monotonic. Not per-agent. (Maintainer inline annotation in PRD-014.) |
| OQ-047 | PRD-015 #1 | Should provisional onboarding require both peer evaluators or is one sufficient during pilot? | resolved | One peer evaluator is sufficient during pilot. (Maintainer inline annotation in PRD-015.) |
| OQ-048 | PRD-015 #2 | Should onboarding test fixtures remain in `inception/` during pilot or move immediately to canonical docs test assets? | resolved | Move immediately to canonical `docs/` test assets. (Maintainer inline annotation in PRD-015.) |
| OQ-049 | PRD-016 #1 | Should `context_saturation` use a numeric threshold or remain qualitative? | resolved | Numeric: remaining token budget percentage based. Not qualitative. (Maintainer inline annotation in PRD-016.) |
| OQ-050 | PRD-016 #2 | Should session-rotation metrics be logged in WORKLOG only or also projected into a machine-readable artifact? | resolved | Both: WORKLOG and machine-readable artifact. (Maintainer inline annotation in PRD-016.) |
| OQ-003 | PRD-001 #3 | Should maintainer replies require a minimum template snippet for consistency? | resolved | Yes. Use proposed template in PRD-004 R4 with three examples: (A) simple ack-only for low risk, (B) structured reply bullets for guardrailed approvals, (C) deferred with unblock condition. (Maintainer inline annotation in PRD-001.) |

## Deduplication Notes

- OQ-002 and OQ-007 ask the same question (absolute timestamps for due fields). Resolve together.
- OQ-001 is resolved — both PRD-003 and PRD-004 agree to defer `approval-required` formalization.
- OQ-020 and OQ-024 were related and are now both resolved (schema location + phased automation).
- OQ-005 and OQ-025 were related and are now both resolved (SLA/trust signals remain session-local in pilot).
- OQ-021 and OQ-026 are related and now both resolved — promotion gating thresholds now use the accepted OQ-026 trust-anomaly framework.
- OQ-029 and OQ-032 were related and are now both resolved (dedicated lock file + invariant automation).
- OQ-034 and OQ-011 were related and are now both resolved (parseability needed for snapshots, not attribution comments).
- OQ-032 and OQ-036 were related and are now both resolved (automation + revision validation for protocol artifacts).
- OQ-037 and OQ-020 are related and now both resolved — hybrid location for skills aligns with canonical schema/document placement policy.
- OQ-040 and OQ-003 are related and now both resolved — OQ-040 (explicit confirmation for writes) + OQ-003 (yes to template). Consistent posture: maintainer confirmation preferred over auto-behavior.
- OQ-041 and PRD-011 R5 (compaction trigger) are related and both resolved — signal retention (configurable, default 2) and WORKLOG compaction (500 lines) share the "how long to keep old coordination data" question.
- OQ-042 relates to PRD-011 R3 directly and is now resolved — Turnfile comes first in read order, before WORKLOG status block. Applied to both PRD-011 and PRD-013.
- OQ-043 and OQ-020 are related and now both resolved — per-project Turnfile aligns with per-project canonical schema location policy.
- OQ-044 and OQ-039 are related and now both resolved — onboarding-time registration parallels explicit-only skill invocation. Consistent posture: low agent autonomy for registration and triggering.
- OQ-045 and OQ-003 are related — both ask how structured maintainer/human-facing templates should be versus freeform guidance.
- OQ-046 and OQ-036 are related — both concern versioning/identity semantics for session-handoff artifacts.
- OQ-049 and OQ-033 are related — both involve token-budget guidance for session continuity decisions.
- OQ-050 and PRD-005 are related — rotation metrics projection scope may require schema/extensions in PRD-005.
