# Open Questions Registry

Tracks open questions for the active local workspace.

Last updated: 2026-06-12

## Active Questions

*No active questions. All OQ-051 through OQ-061 resolved as of session 14 (2026-06-12).*

| ID | Source PRDs | Question | Status | Resolution |
|----|-------------|----------|--------|------------|
| OQ-058 | PRD-021 | What should the rebuttal loop bound count, where is it configured, and how does the unbounded mode terminate? | resolved | Fixed round counts; `rebuttal_rounds` in `TURNFILE.yaml` (charter may override); min `1`, max `"unbounded"`; unbounded terminates on `NO-NEW-OBJECTION` convergence signal or Maintainer circuit-breaker. (Maintainer, 2026-06-01) |
| OQ-059 | PRD-021 | When a finite rebuttal bound is exhausted without agreement, does the existing escalation ladder still fire? | resolved | Skip Level 3; escalate directly to Level 4 Maintainer adjudication. Level 3 available only by explicit Maintainer instruction. (Maintainer, 2026-06-01) |
| OQ-060 | PRD-021 | How is the selective-unlock gradient structured, what does it drive, and who assigns it? | resolved | Binary `gated` / `unlockable` flag extending the PRD-018 matrix; governs Maintainer-gate unlock eligibility only; proposing agent self-tags, Maintainer ratifies. (Maintainer, 2026-06-01) |
| OQ-061 | PRD-021 | Should Turnfile adopt an enumerate-only review lane (reviewer lists issues, does not propose the fix)? | resolved | No. Peer counter-recommendation stays as-is; peers are equals and proposing an alternative is intended. (Maintainer, 2026-06-01) |

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
