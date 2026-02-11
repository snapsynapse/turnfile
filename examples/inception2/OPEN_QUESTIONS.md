# Open Questions Registry

Tracks open questions for the active local workspace.

Last updated: 2026-02-11

## Active Questions

| ID | Source PRDs | Question | Status | Resolution |
|----|-------------|----------|--------|------------|
| OQ-051 | PRD-017 | Should boot sequence be codified as a single script or remain a documented command contract with optional helper scripts? | open | pending |
| OQ-052 | PRD-018 | Which concrete change types must be Maintainer-gated from day one? | resolved | **All changes are Maintainer-gated by default.** Maintainer will selectively unlock specific change classes for agent-only approval over time. (Maintainer decision 2026-02-11.) |
| OQ-053 | PRD-018 | Should Maintainer gate be required for any cross-agent conflict, or only unresolved conflict after one counter cycle? | resolved | Subsumed by OQ-052: all changes require Maintainer approval. Cross-agent conflicts are therefore always Maintainer-gated. (2026-02-11) |
| OQ-054 | PRD-019 | What default time-based interval (if any) balances responsiveness and overhead? | open | pending |
| OQ-055 | PRD-019 | Should time-based polling be manual checklist only, or supported by automation/tooling hooks? | open | pending |
| OQ-056 | PRD-020 | Should chat logs include fixed metadata fields (branch, rev, phase) for machine parsing? | open | pending |
| OQ-057 | PRD-020 | Should boot create timestamped session subsections automatically or leave structure manual? | open | pending |

## Deferred Questions

*No deferred questions in the local workspace.*

Canonical deferred items remain tracked in `/Users/snap/Git/turnfile/docs/OPEN_QUESTIONS.md`.

## Resolved Questions

| ID | Source PRDs | Question | Status | Resolution |
|----|-------------|----------|--------|------------|
| OQ-052 | PRD-018 | Which concrete change types must be Maintainer-gated from day one? | resolved | All changes Maintainer-gated by default. Selective unlocks to follow. (Maintainer, 2026-02-11) |
| OQ-053 | PRD-018 | Should Maintainer gate be required for any cross-agent conflict, or only unresolved conflict after one counter cycle? | resolved | Subsumed by OQ-052: all changes Maintainer-gated. (2026-02-11) |
