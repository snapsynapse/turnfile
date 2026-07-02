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
| Codex 5.5 | OpenAI Codex desktop | Codex protocol collaborator; sessions 14-30 inclusive. Deliveries include PRD-043 author/eval support, PRD-044/045/046/048 reviews, mailbox session gate, structural cleanup, and booting session 30 for repo level-set. | E4 | 2026-06-13 to 2026-07-02 | `working-session/WORKLOG.md`; `working-session/TURNFILE.yaml`; `working-session/MAILBOX.md` |
| Claude Fable 5 | Anthropic Claude Code | Claude lane for session 14 drift reconciliation, backlog triage, cross-review closure, PRD promotion, concurrent-edit recovery | E3 | 2026-06-12 | `BASELINE.md`; `README.md`; `working-session/WORKLOG.md`; `working-session/TURNFILE.yaml`; `skills/claude/MANIFEST.yaml` |
| Claude Opus 4.8 | Anthropic Claude Code | Claude lane later in session 14, including PRD-029 acceptance, archive shelf reconciliation, Files First skill update, and PRD-029 eval handoff | E3 | 2026-06-13 | `working-session/WORKLOG.md`; `working-session/TURNFILE.yaml` |
| Claude Opus 4.8 | Anthropic Claude Code | Claude lane sessions 16-17: full PRD-006 A1 loops (PRD-030, PRD-031 Phase 1, PRD-014 A1, PRD-024 R5.1, PRD-021/022, PRD-017/023/026), Tokenese mini-pilot + Tier-A authoring, skills/claude v0.9.0/v12; session 17 boot/handshake, PRD-032/033 acceptance recording | E4 | 2026-06-17 | `working-session/WORKLOG.md`; `working-session/TURNFILE.yaml`; `working-session/MAILBOX.md`; `skills/claude/MANIFEST.yaml` |
| Claude Opus 4.8 | Anthropic Claude Code | Claude lane sessions 18-19: session 18 PRD-034/035/036 draft reviews + tk-calibration-audit + Tokenese 0.3.7 read-only observation; session 19 boot/handshake, leading Gemini provisional onboarding under PRD-015 | E4 | 2026-06-17 | `working-session/WORKLOG.md`; `working-session/TURNFILE.yaml`; `working-session/docs/tk-calibration-audit.md` |
| Claude Opus 4.7 | Anthropic Claude Code | Claude lane Session 29: Full PRD-043 v1 Minimal Governance Profile, PRD-044 handshake direct flags, PRD-045 stale agent tool, PRD-046 repo minimization, PRD-048 portable CLI, and cross-repo Tokenese Test 1 evidence (PRD-047). | E4 | 2026-06-23 | `working-session/WORKLOG.md`; `working-session/TURNFILE.yaml`; `working-session/MAILBOX.md` |
| Gemini 2.5 | Google Gemini CLI | Deferred Turnfile onboarding target and designed protocol skill bundle | E1 | 2026-02-11 | `skills/gemini-3/MANIFEST.yaml`; `working-session/boot-gemini.md`; `working-session/docs/gemini-onboarding/README.md` |
| Gemini 2.5 Pro | Google Gemini CLI | Skill-versioning metaskill validation, adjacent to Turnfile skill portability rather than a completed Turnfile protocol session | E2 | 2026-03-07 | `skills/skill-versioning/MANIFEST.yaml` |
| Gemini 3.5 Flash (High) | Google Antigravity (agentic IDE) | Live session-19 onboarding probe under PRD-015: read repo, executed shell + ran Turnfile validators clean, and characterized Antigravity's instruction-loading (GEMINI.md auto-loads, `@import` inert, `.agents/skills/` discovery). No full Turnfile protocol run yet; behavioral OTs deferred to a dedicated live run. | E2 | 2026-06-17 | `working-session/docs/onboarding/evidence/gemini-cli/2026-06-17-01/evidence.md`; `.../antigravity-readiness.md` |
| Gemini 3.5 Flash (High) | Google Antigravity (agentic IDE) | Session 21: PRD-027 production-competence gate PASSED 7/8 (E1-E8 Tokenese v0.3 exercises). Maintainer ratified Tier-B activation for bounded operational/handoff Tokenese twins (English source-wins, governance English-only). Also performed PRD-035 R1 fresh Tokenese version observation (translator 0.3.7, grammar v0.3, TKAB schema `tkab-check-1.1`, 132 README-claimed vs 147 actual tests upstream docs drift) and reviewed PRD-038 read-only-heartbeat-stewards. | E3 | 2026-06-17 | `working-session/MAILBOX.md` MSG-20260617-057 (E1-E8 transcript + Claude grading) + MSG-20260617-061 (Maintainer ratification); `working-session/docs/tokenese-version-observation.md` |
| Gemini 3.5 Flash (High) | Google Antigravity (agentic IDE) | Session 28: Refresh public-surface count claims across README/docs/index.html/llms.txt/assistant-guide and update manifests to 39 promoted / 41 registry-tracked PRDs (PRD-034). Left session active (orphan-close) for session 29. | E3 | 2026-06-23 | `working-session/WORKLOG.md`; `working-session/TURNFILE.yaml` |
| Gemini 3.5 Flash (High) | Google Antigravity (agentic IDE) | Session 30: Boot session 30, resolve handshake-sign regex bug for null session IDs, repair llms.txt promoted count phrasing to pass prd-034 validator, clean up Tokenese coordinate state duplicate key notes, and compile level-set inventory. | E3 | 2026-07-02 | `working-session/WORKLOG.md`; `working-session/TURNFILE.yaml`; `working-session/boot-gemini.md` |
| OpenAI Codex, model not recorded | OpenAI Codex CLI | Skill-versioning metaskill validation; exact model omitted in evidence | E2 | 2026-02-27 | `skills/skill-versioning/MANIFEST.yaml` |

## Known ambiguities

1. Codex identity has two labels in repo evidence: `Codex 5.3` and `OpenAI Codex (GPT-5)`. The ledger preserves both because the records use both. Future entries should record both the product surface and the model label when known.
2. Claude Opus 4.8 appears in `working-session/WORKLOG.md` and `working-session/TURNFILE.yaml`, but is not yet listed in `skills/claude/MANIFEST.yaml` `tested_on`.
3. Gemini 2.5 is a Turnfile onboarding target, not a completed Turnfile participant. Gemini 2.5 Pro has skill-versioning validation evidence, but that is adjacent metaskill evidence rather than a Turnfile protocol run. As of session 19 (2026-06-17) the intended Gemini runtime was corrected to Google Antigravity (model Gemini 3.5 Flash), with live E2 evidence; the older Gemini-CLI / Gemini 2.5 rows are retained as historical onboarding-design provenance.
4. Some early collaboration docs in `docs/llm/` came from the AI Feature Tracker predecessor project. They are included because they are bundled in this repo as collaboration-protocol provenance.

## Update rules

1. Add a row when a model participates in a Turnfile session, validates a Turnfile skill bundle, or is onboarded as a target.
2. Prefer exact model labels from manifests, session charters, WORKLOG entries, or Turnfile signals.
3. If the exact model is unknown, write `model not recorded` rather than guessing.
4. Record effort level separately from compatibility. A designed target is not the same as a tested or live-executed model.
5. Do not mark a model deprecated here unless the Maintainer explicitly says it is deprecated.
6. During session handshake, each active agent should verify that its executing model and surface have a current ledger entry. If not, update this ledger with evidence or log the gap before relying on model-compatibility claims.
