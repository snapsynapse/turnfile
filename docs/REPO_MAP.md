# Repo Map
This file describes where Turnfile artifacts belong. If two locations seem plausible, use the smallest scope that owns the artifact and keep active work separate from public, historical, and generated surfaces.
## Root
The root contains the current human-facing protocol surface and project governance:
- `README.md` — public entry point.
- `SPEC.md` — normative protocol contract.
- `DEFINITIONS.md` — canonical vocabulary.
- `CONFORMANCE.md` — validator and conformance expectations.
- `INTENT.md` — repo-scoped strategy.
- `ROADMAP.md` — non-normative planning.
- `SECURITY.md`, `LICENSE`, `LICENSE-SPEC`, `CHANGELOG.md` — release and governance metadata.
## docs/
`docs/` is the served documentation and public protocol corpus. Current public pages and machine-readable surfaces live here.
- `docs/index.html`, `docs/llms.txt`, `docs/sitemap.xml`, `docs/robots.txt`, `docs/.well-known/` — public website and agent surfaces.
- `docs/prds/` — promoted PRDs only.
- `docs/archive/` — historical snapshots, archived PRDs, and old boot files.
- `docs/llm/` — model ledger and historical LLM collaboration notes.
## working-session/
`working-session/` is the active Turnfile control plane. It is tracked by design.
- `TURNFILE.yaml`, `MAILBOX.md`, `MAILBOX.json`, `WORKLOG.md`, and `OPEN_QUESTIONS.md` are active coordination files.
- `boot-*.md` and `chat-*.md` are agent-owned session artifacts.
- `working-session/docs/PRD_STATUS.json` is the PRD lifecycle source of truth.
- `working-session/docs/` should hold only active drafts, release evidence, handoffs, spikes, and onboarding evidence. Completed PRDs should not remain here.
## examples/
`examples/` contains curated examples and historical evidence.
- `examples/turnfile-development/` is the current curated index for session-12-onward Turnfile development history.
- `examples/inception/` is preserved verbatim as the original sessions 1-11 invention archive.
- Other example directories are historical references and should be indexed by `examples/README.md` rather than used as the first adoption path.
## tools/
`tools/` contains executable helpers. Keep tools flat until v1.0.0 unless a move is covered by an eval update.
Use `tools/README.md` for grouping instead of moving scripts prematurely.
## schemas/
`schemas/` contains machine-readable contracts.
- `schemas/turnfile/` — current v0 coordination schema.
- `schemas/v1/` — v1 Minimal Governance Profile schema.
- PRD-specific experimental schemas remain in `schemas/prd-*`.
## templates/
`templates/` contains starter artifacts and authoring templates.
- `templates/v1-minimal/` is the stable starter path for fresh adopters.
- `templates/working-session/` is the historical working-session template family.
## skills/
`skills/`, `.agents/skills/`, and `.claude/skills/` contain agent skill bundles and local skill surfaces. Respect `OWNERSHIP.yaml`; do not edit another agent's owned skill bundle without explicit Maintainer authorization.
## imgs/
`imgs/` and `docs/imgs/` contain public image assets. Portfolio convention is `/imgs/og.png`; keep root and served docs assets synchronized when public surface validation requires it.
