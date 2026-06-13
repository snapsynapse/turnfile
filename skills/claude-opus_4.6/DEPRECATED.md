# Model-specific bundle: Claude Opus 4.6 (compatibility path — not deprecated)

Maintainer clarification (2026-06-13): no LLM, model, or model-specific skill path is deprecated unless the Maintainer explicitly declares it deprecated. The filename `DEPRECATED.md` is historical and does not itself constitute a deprecation declaration.

This bundle (v3, `turnfile-protocol-claude`) is the model-specific Claude skill path for Claude Opus 4.6, a model still in use outside this session. It remains a valid compatibility artifact.

In session 14 the active Claude lane moved to the role-keyed bundle at `skills/claude/` (model recorded in `skills/claude/MANIFEST.yaml`, not the directory path). Role-keyed bundles are the current session default; this model-specific bundle is retained for sessions that still target Opus 4.6.

- Not deprecated. Retained as a compatibility path.
- Removal would be a Band C (irreversible) change requiring explicit Maintainer approval — and is not currently sought.
- For the active session, prefer `skills/claude/`. Run this copy only when a session specifically targets Claude Opus 4.6.

See `skills/STRUCTURE.md` for the per-agent layout and BASELINE.md for the role-keyed migration record.
