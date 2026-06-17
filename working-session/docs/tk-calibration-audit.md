# tk-calibration-audit — Self-Reported Channel Calibration

Status: complete (session 18, 2026-06-17)
Owner: Claude (Opus 4.8), within the ratified PRD-027 pilot
Task: PRD-027 HANDOFF task 4 / R5.5; referenced by PRD-035 R4

## Version tags

- Tokenese grammar: v0.3 (unchanged across the increment; `GRAMMAR-v0.3.md` zero-diff v0.3.2..origin/main)
- Translator/toolchain: 0.3.7 (pulled this session from 0.3.2; re-score reproduced all anthropic ratios byte-identical)
- TKAB checker schema: `tkab-check-1.1` (unchanged)
- Evidence env: anthropic counts reproduced locally (cached_costs+heuristic); o200k from Codex verified env (tiktoken). Grammar+schema unchanged means recorded scores stand.

## Question (the gate)

Two self-reported channels ship untrusted-by-default. No Turnfile decision may weight them from a clone until this audit shows they correlate with verifiable accuracy:

1. `ev:obs` — evidential marker asserting harness-verifiable observation (tool output / source in context), as distinct from `ev:guess` / `ev:mem` / elided (inferred).
2. `^N` — ordinal confidence/severity rank.

The audit must distinguish: harness-observed claims from inferred rankings; correct abstention via `plain`; whether `^N` correlates with accuracy; whether `ev:obs` correlates with verifiable context.

## Evidence base

Six v0.3 A/B pairs (`working-session/tokenese-pairs/`), the E1 teach exercise (`MAILBOX_ARCHIVE.md`), and the v0.2 W1/L1 mini-pilot (`tk-ab-run-results.md`).

## Channel 1: ev:obs

| Instance | Context | ev:obs claims | Verdict |
|----------|---------|---------------|---------|
| E1 (teach) | inferred cause-ranking `schema-drift^6\|oom^3` tagged `ev:obs` | 1 | MISS — inference laundered as observation (K6 confabulated provenance). Caught by external grading; repaired. |
| W1 (v0.2) | deploy-status; observed timestamp `ev:obs`, inferred top-2 cause `ev:guess` | mixed | VALID — observation and inference correctly separated. |
| W2 | service-health snapshot; 8 facts all present in the observed source report | 8 | VALID — every `ev:obs` grounded in source context (verbose, which cost tokens; authoring, not calibration). |
| W3 | task-handoff typed holes | 1 | VALID. |
| W4 | code-review finding: `missing-default-paths` + `cmd exits:missing-required-file` | 2 | VALID — both genuinely observed (file read + command output); both independently confirmed real in the session-17 PRD-032 work. |
| W5 | session-status canary; observed facts `ev:obs`, predicted next-action `ev:guess` | 7 + 1 guess | VALID — textbook discipline: observation vs inference separated. |

Finding: one `ev:obs` miss, in the teach phase, on an inferred ranking. Across all six scored A/B pairs (post-repair) `ev:obs` was reserved for facts verifiable in context, and W1/W5 correctly downgraded inferred items to `ev:guess`. The discipline is learnable and held.

But the E1 miss is the load-bearing result: `ev:obs` is a discipline claim, not a self-validating guarantee. An agent can label inference as observation, and only external verification caught it. The channel correlates with verifiable context when the agent is disciplined; it does not make the claim self-proving.

## Channel 2: ^N (ordinal rank)

Instances: W4 `sev:^4`, W5 `^8` (gate-pass), E1 distribution `^6`/`^3`. Three pairs, no shared defined scale, no ground-truth severity/confidence labels to score against. The W4 `sev:^4` finding was a genuine bug; the W5 `^8` gate-pass was a true high-confidence pass. But N=3 with an undefined scale cannot establish that rank predicts accuracy.

Finding: INSUFFICIENT EVIDENCE. `^N` cannot pass on this data.

## Channel 3: abstention via plain (positive control)

L2 (open-ended design) and L3 (verbatim code review) correctly emitted `plain` (`plain_mode_present: true`) rather than forcing dense, matching R1 (no dense for reasoning) and the verbatim non-goal. Both negative controls passed.

Finding: PASS. The abstention discipline is reliable — clones correctly decline dense when the task is reasoning-heavy or verbatim-sensitive.

## Verdict

| Channel | Result | Trust decision |
|---------|--------|----------------|
| `ev:obs` | conditional / partial pass | Keep untrusted-by-default. May be read as a useful signal ONLY when the underlying observation is itself in-context and independently verifiable; never as standalone authority. Source-wins (R1.5) and the verify reflex stay. |
| `^N` | insufficient evidence | Remain untrusted. Do not weight `^N` in any Turnfile decision. Re-audit only after defining an explicit ordinal scale and collecting more points. |
| `plain` abstention | pass | Reliable; clones correctly abstain. |

The gate does NOT unlock trust in self-reported confidence. It shows evidential discipline is learnable and held in practice, while proving the channel is externally falsifiable (E1) and quantitatively thin (`^N`).

## Maintainer decision recommendation

1. Do not authorize any Turnfile decision that weights `^N` or treats `ev:obs` as standalone authority. The untrusted-by-default rule stands.
2. A bounded Tier-B operational/handoff twin lane is defensible IF it relies on observed, source-paired facts (the W2/W5 status-snapshot shape) where every clone is twinned to a legible English source that wins on conflict, and `ev:obs` is backed by in-context observation. This lane does not depend on trusting `^N` or unverified `ev:obs`, so the calibration result does not block it.
3. Governance state (lifecycle, locks, task claims, acceptance, normative PRD text, reasoning/proofs, exact diffs) stays English-only regardless.
4. For `^N`: either define an explicit ordinal scale and re-collect, or keep `^N` as informal annotation only.

## Limitations

Small sample (8 pairs, 2 model families: Claude/Anthropic, Codex/OpenAI). o200k verified in Codex's env, not independently re-run locally (tiktoken absent) — grammar+schema unchanged makes this low-risk, but full independent o200k re-scoring would strengthen future audits. `^N` is too sparse for a statistical claim.
