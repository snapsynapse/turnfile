# Turnfile — Agent Guidance

## Purpose

Turnfile (SNAP — Structured Negotiation of Autonomous Peers) is a **protocol standard**, not a runtime. It defines how multiple LLM agents coordinate as peers on a shared codebase — proposing, disagreeing, and reaching auditable consensus through markdown files — with a human maintainer holding intent and veto (human-on-the-loop, not micromanagement). There is no central orchestrator and no shared runtime; agents communicate only through tracked files (mailbox, worklog, turnfile state).

Canonical site: https://turnfile.work/

## Tech stack

- Node.js (v22 in CI), plain JavaScript (`.mjs`), no framework/build step.
- `ajv` for JSON Schema validation, `js-yaml` for YAML parsing — the only two runtime deps (devDependencies in `package.json`).
- Content is markdown + YAML + JSON: the protocol artifacts themselves (mailbox, turnfile state, PRDs) are plain text, versioned in git.
- Static docs site in `docs/` deployed via GitHub Pages (no site generator; hand-authored HTML).

## Directory layout

- Root — current human-facing protocol surface and governance: `README.md`, `SPEC.md` (normative v1 contract), `DEFINITIONS.md` (controlled vocabulary), `CONFORMANCE.md`, `INTENT.md`, `ROADMAP.md`, `SECURITY.md`, `LICENSE`, `LICENSE-SPEC`, `CHANGELOG.md`, `OWNERSHIP.yaml`.
- `docs/` — served documentation and public protocol corpus (GitHub Pages source). `docs/prds/` holds *promoted* PRDs only; `docs/archive/` holds historical snapshots; `docs/llm/` is the model ledger.
- `working-session/` — the **active, tracked** Turnfile control plane: `TURNFILE.yaml`, `MAILBOX.md`/`MAILBOX.json`, `WORKLOG.md`, `OPEN_QUESTIONS.md`, agent-owned `boot-*.md`/`chat-*.md` files, and `working-session/docs/` for active drafts/evidence/handoffs.
- `examples/` — curated history: `examples/inception/` (sessions 1-11, original two-agent invention, preserved verbatim) and `examples/turnfile-development/` (session 12+, three-agent evolution).
- `tools/` — executable Node helpers (validators, linters, evals, session/PRD tooling). Kept intentionally flat; see `tools/README.md`.
- `schemas/` — machine-readable contracts: `schemas/turnfile/` (v0), `schemas/v1/` (v1 Minimal Governance Profile), plus PRD-specific experimental schemas.
- `templates/` — starter artifacts; `templates/v1-minimal/` is the stable path for fresh adopters.
- `skills/`, `.agents/skills/` — agent skill bundles (Claude/Codex/Gemini). Respect `OWNERSHIP.yaml` — do not edit another agent's owned skill bundle without explicit maintainer authorization.
- `evals/` — eval fixtures/cases for `tools/run-evals.mjs` and `tools/run-prd-evals.mjs`.

Full authoritative layout rules: `docs/REPO_MAP.md`.

## Conventions

- Every protocol decision is auditable in plain markdown — no hidden state, no binary formats for coordination data.
- `OWNERSHIP.yaml` defines per-path write ownership across agents (Claude/Codex/Gemini/etc.) — check before editing files outside your lane.
- PRD process for substantial changes: copy `templates/prd.md`, fill in problem/goal/requirements/acceptance criteria, open in `docs/prds/` once promoted (see `CONTRIBUTING.md`).
- Open questions are tracked centrally in `docs/OPEN_QUESTIONS.md` (protocol-level) and `working-session/OPEN_QUESTIONS.md` (session-level); agents check these at session start.
- Session state lives in `working-session/TURNFILE.yaml` + `MAILBOX.md` + `WORKLOG.md`; read `working-session/NEXT_SESSION_HANDSHAKE.md` for the latest carry-forward context before acting.
- Agent-specific onboarding files exist at repo root: `GEMINI.md` for Gemini. This `CLAUDE.md` is the equivalent generic entry point for Claude Code / Claude-family agents working on the repo as a codebase (as opposed to participating *in* a live Turnfile session — for that, read `working-session/boot-claude.md`).

## Build / validate / test (from docs — do not execute without asking)

Per `package.json` and `.github/workflows/validate.yml`:

- `npm ci` then `npm run validate` — runs the full lint suite: `lint:turnfile`, `lint:mailbox`, `lint:prds`, `lint:public-surface`, `lint:tkab`, `validate:skills:ci`, `evals`.
- `npm run evals:prd` — PRD-specific evals, run separately in CI.
- `node tools/turnfile.mjs --help` — portable CLI for `init`, `open`, `status`, `heartbeat`, `close`.
- `node tools/session-orient.mjs --agent <agent> --emit human` and `node tools/prd-status-summary.mjs --gates v1` — session/release status tooling referenced in handshake docs.
- CI: `.github/workflows/validate.yml` (push to main + PRs, runs `npm run validate` and `npm run evals:prd`) and `.github/workflows/pages.yml` (deploys `docs/` to GitHub Pages on push to main).

## Current state (as of 2026-07-12 assessment)

- On `main`, clean working tree, up to date with `origin/main`. Latest commit: `ab37ba5` (2026-07-06), "INTENT v0.1.4: cite the Aggregated Intelligence tenets as philosophical ground."
- **v1.0.0 shipped** (2026-07-02): the Minimal Governance Profile freeze. Root + `docs/` + `schemas/v1/` + `templates/v1-minimal/` + `tools/` + promoted PRDs in `docs/prds/` are the stable v1 reading surface.
- Registry: 48 tracked PRDs, 46 promoted (per README badges).
- Very active multi-agent development history (30+ sessions across Claude, Codex, Gemini, provisional Qwen checker) — see `working-session/WORKLOG.md` and `working-session/NEXT_SESSION_HANDSHAKE.md` for the latest addenda.
- No CHANGELOG entries under `[Unreleased]` at time of writing — latest release is 1.0.0.
