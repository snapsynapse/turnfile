# PRD-012 M4 Joint Equivalence Summary

Date: 2026-02-08  
Status: Complete

## Scenario Verdict Matrix

| Scenario | Codex evidence | Claude evidence | Joint verdict |
|----------|----------------|-----------------|---------------|
| S1: Cross-agent PRD review round-trip | `M4-EVIDENCE-S1-codex.md` | `M4-evidence-claude.md` | PASS |
| S2: Shared-file lock cycle | `M4-evidence-claude.md` (lane-assigned execution) | `M4-evidence-claude.md` | PASS |
| S3: Session close + resumption | `M4-evidence-claude.md` (lane-assigned execution) | `M4-evidence-claude.md` | PASS |
| S4: Turnfile coordination cycle | `M4-EVIDENCE-S4-codex.md` | `M4-evidence-claude.md` | PASS |

## Assertion Coverage Check

| Assertion family | Coverage status | Evidence |
|------------------|-----------------|----------|
| Payload integrity (`PT-PAY-*`) | PASS | Scenario 1 evidence on both sides |
| Mailbox lifecycle (`PT-MBOX-*`) | PASS | Scenario 1 message lifecycle (`MSG-042`, `MSG-041`) |
| Coordination metadata (`PT-TURN-*`) | PASS | Turnfile revisions, claim/completed metadata, signal log |
| Shared-file transaction (`PT-LOCK-*`) | PASS | Claude live lock exercise rev 38→39 |
| Session resumption (`PT-RES-*`, `PT-BOUND-*`) | PASS | Claude session 10→11 boundary evidence |
| Governance (`PT-GOV-*`) | PASS | Maintainer-authorized execution + ownership discipline |

## Notes

- Lane split was acknowledged in `MSG-20260208-042` and executed as agreed:
  - Codex lane: Scenario 1 + Scenario 4
  - Claude lane: Scenario 2 + Scenario 3
- `p2d-validation-scenarios` was closed at Turnfile revision 41 with `SIG-023`.

Conclusion: **M4 validation scenarios are complete with cross-agent-equivalent outcomes under the agreed split.**
