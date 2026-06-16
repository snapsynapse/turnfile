# Model Usage Ledger

This ledger records model and agent-surface usage evidenced in this repository and its bundled precursor collaboration records. It exists because model identity was previously distributed across manifests, session charters, WORKLOG entries, Turnfile signals, and retrospectives.

## Scope and effort levels

| Effort | Meaning |
|--------|---------|
| E4 | Sustained multi-session protocol execution |
| E3 | Live project or protocol session execution |
| E2 | Validation, test, or skill-loading evidence only |
| E1 | Designed, onboarded, or proposed target with no completed Turnfile run |
| E0 | Mention only, no operational evidence |

## Canonical model ledger

| Model label as recorded | Provider or surface | Role in project | Effort | Date or span | Evidence |
|-------------------------|---------------------|-----------------|--------|--------------|----------|
| Claude Opus 4.6 | Anthropic Claude Code | Claude protocol collaborator; inception and early Turnfile protocol execution | E4 | 2026-02-07 to 2026-02-11 | `docs/llm/COLLAB_PROTOCOL.md` v3 and v5; `examples/inception/SESSION_CHARTER.md`; `skills/claude-opus_4.6/MANIFEST.yaml`; `skills/claude/MANIFEST.yaml`; `working-session/WORKLOG.md` |
| Codex 5.3 | OpenAI Codex CLI | Codex protocol collaborator; precursor protocol author/reviewer; policy-test validated skill path | E4 | 2026-02-07 to 2026-02-11 | `docs/llm/COLLAB_PROTOCOL.md` v1, v2, v4, v5; `README.md`; `skills/codex_5.3/MANIFEST.yaml`; `skills/codex/MANIFEST.yaml` |
| OpenAI Codex (GPT-5) | OpenAI Codex | Codex protocol collaborator in inception charter and current role-keyed Codex bundle | E3 | 2026-02-08, 2026-06-12 to 2026-06-13 | `examples/inception/SESSION_CHARTER.md`; `working-session/boot-gemini.md`; `skills/codex/MANIFEST.yaml`; `working-session/WORKLOG.md` |
| Codex 5.5 | OpenAI Codex desktop | Codex protocol collaborator; session 14 close and session 15 PRD-027 initiation | E3 | 2026-06-13 to 2026-06-15 | `working-session/WORKLOG.md`; `working-session/TURNFILE.yaml`; `working-session/MAILBOX.md` |
| Claude Fable 5 | Anthropic Claude Code | Claude lane for session 14 drift reconciliation, backlog triage, cross-review closure, PRD promotion, concurrent-edit recovery | E3 | 2026-06-12 | `BASELINE.md`; `README.md`; `working-session/WORKLOG.md`; `working-session/TURNFILE.yaml`; `skills/claude/MANIFEST.yaml` |
| Claude Opus 4.8 | Anthropic Claude Code | Claude lane later in session 14, including PRD-029 acceptance, archive shelf reconciliation, Files First skill update, and PRD-029 eval handoff | E3 | 2026-06-13 | `working-session/WORKLOG.md`; `working-session/TURNFILE.yaml` |
| Gemini 2.5 | Google Gemini CLI | Deferred Turnfile onboarding target and designed protocol skill bundle | E1 | 2026-02-11 | `skills/gemini-3/MANIFEST.yaml`; `working-session/boot-gemini.md`; `working-session/docs/gemini-onboarding/README.md` |
| Gemini 2.5 Pro | Google Gemini CLI | Skill-versioning metaskill validation, adjacent to Turnfile skill portability rather than a completed Turnfile protocol session | E2 | 2026-03-07 | `skills/skill-versioning/MANIFEST.yaml` |
| OpenAI Codex, model not recorded | OpenAI Codex CLI | Skill-versioning metaskill validation; exact model omitted in evidence | E2 | 2026-02-27 | `skills/skill-versioning/MANIFEST.yaml` |

## Known ambiguities

1. Codex identity has two labels in repo evidence: `Codex 5.3` and `OpenAI Codex (GPT-5)`. The ledger preserves both because the records use both. Future entries should record both the product surface and the model label when known.
2. Claude Opus 4.8 appears in `working-session/WORKLOG.md` and `working-session/TURNFILE.yaml`, but is not yet listed in `skills/claude/MANIFEST.yaml` `tested_on`.
3. Gemini 2.5 is a Turnfile onboarding target, not a completed Turnfile participant. Gemini 2.5 Pro has skill-versioning validation evidence, but that is adjacent metaskill evidence rather than a Turnfile protocol run.
4. Some early collaboration docs in `docs/llm/` came from the AI Feature Tracker predecessor project. They are included because they are bundled in this repo as collaboration-protocol provenance.

## Update rules

1. Add a row when a model participates in a Turnfile session, validates a Turnfile skill bundle, or is onboarded as a target.
2. Prefer exact model labels from manifests, session charters, WORKLOG entries, or Turnfile signals.
3. If the exact model is unknown, write `model not recorded` rather than guessing.
4. Record effort level separately from compatibility. A designed target is not the same as a tested or live-executed model.
5. Do not mark a model deprecated here unless the Maintainer explicitly says it is deprecated.
6. During session handshake, each active agent should verify that its executing model and surface have a current ledger entry. If not, update this ledger with evidence or log the gap before relying on model-compatibility claims.
