# Open Questions Registry

Tracks open questions for the active local workspace.

Last updated: 2026-06-13 (OQ-068 resolved)

## Active Questions

| ID | Source PRDs | Question | Status | Resolution |
|----|-------------|----------|--------|------------|
*No active questions in the local workspace.*

## Deferred Questions

*No deferred questions in the local workspace.*

Canonical deferred items remain tracked in `/Users/snap/Git/turnfile/docs/OPEN_QUESTIONS.md`.

## Resolved Questions

| ID | Source PRDs | Question | Status | Resolution |
|----|-------------|----------|--------|------------|
| OQ-051 | PRD-017 | Should boot sequence be codified as a single script or remain a documented command contract with optional helper scripts? | resolved | Documented command contract with optional helper scripts. No mandatory boot script. (Maintainer, 2026-06-12, session 14) |
| OQ-054 | PRD-019 | What default time-based interval (if any) balances responsiveness and overhead? | resolved | None. Coordination stays asynchronous and event-based; no time-based polling layer. (Maintainer, 2026-06-12, session 14) |
| OQ-055 | PRD-019 | Should time-based polling be manual checklist only, or supported by automation/tooling hooks? | resolved | Moot: time-based polling not adopted. (Maintainer, 2026-06-12, session 14) |
| OQ-056 | PRD-020→PRD-017 R7 | Should chat logs include fixed metadata fields (branch, rev, phase) for machine parsing? | resolved | Yes: branch, Turnfile revision, phase, session ID, date in session headers. (Maintainer, 2026-06-12, session 14) |
| OQ-057 | PRD-020→PRD-017 R7 | Should boot create timestamped session subsections automatically or leave structure manual? | resolved | Manual structure; boot does not auto-create subsections. (Maintainer, 2026-06-12, session 14) |
| OQ-052 | PRD-018 | Which concrete change types must be Maintainer-gated from day one? | resolved | All changes Maintainer-gated by default. Selective unlocks to follow. (Maintainer, 2026-02-11) |
| OQ-053 | PRD-018 | Should Maintainer gate be required for any cross-agent conflict, or only unresolved conflict after one counter cycle? | resolved | Subsumed by OQ-052: all changes Maintainer-gated. (2026-02-11) |
| OQ-058 | PRD-021 | What should the rebuttal loop bound count, where is it configured, and how does the unbounded mode terminate? | resolved | Fixed round counts; `rebuttal_rounds` in `TURNFILE.yaml` (charter may override); min `1`, max `"unbounded"`; unbounded terminates on `NO-NEW-OBJECTION` or Maintainer circuit-breaker. (Maintainer, 2026-06-01) |
| OQ-059 | PRD-021 | When a finite rebuttal bound is exhausted without agreement, does the existing escalation ladder still fire? | resolved | Skip Level 3; escalate directly to Level 4 Maintainer adjudication. (Maintainer, 2026-06-01) |
| OQ-060 | PRD-021 | How is the selective-unlock gradient structured, what does it drive, and who assigns it? | resolved | Binary `gated` / `unlockable` flag extending PRD-018 matrix; unlock eligibility only; agent self-tags, Maintainer ratifies. (Maintainer, 2026-06-01) |
| OQ-061 | PRD-021 | Should Turnfile adopt an enumerate-only review lane? | resolved | No. Peer counter-recommendation stays as-is. (Maintainer, 2026-06-01) |
| OQ-062 | PRD-024 | Should the dense-permitted scratchpad body require per-session charter opt-in? | resolved | Per-session opt-in required; default remains legible. (Codex amendment, MSG-20260612-024) |
| OQ-063 | PRD-024 | Should tokenese be a PRD-024 amendment or its own PRD? | resolved | Own PRD referencing PRD-024 unless profile assignments, projection rights, or validation obligations change. (Codex amendment, MSG-20260612-024) |
| OQ-064 | PRD-026 | Should review-cycle closure consistency be a standalone PRD-026 or an amendment to PRD-003, PRD-006, PRD-013, or PRD-019? | resolved | Standalone PRD-026, with explicit boundary against the PRD-014 closeout amendment path. (Claude counter accepted by Codex, MSG-20260612-027) |
| OQ-065 | PRD-022 | Should Maintainer-decision relays (PRD-004 blockquote) always be delivery-mirror, or may the relaying agent downgrade? | resolved | PRD-004 blockquote relays default to `delivery-mirror`; downgrade allowed only when the relay explicitly states no peer future work is bound and no non-deciding participant needs lifecycle awareness. (Codex amendment, MSG-20260613-028) |
| OQ-068 | PRD-029 | Should next-state derivation be wrapped into a single post-message helper (derive+write+validate), or stay derivation-only to preserve explicit agent writes? | resolved | First implementation stays derivation-only. A full write wrapper may be proposed later only after PRD-029 evidence shows repeated helper-bypass or wrapper-worthy friction, and it must preserve explicit reviewable file diffs. (Codex amendment, MSG-20260613-036) |
