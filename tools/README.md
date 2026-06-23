# Tools
Turnfile keeps tool files flat before v1.0.0 so existing PRD evals and docs do not break on path moves. Use this index for orientation.
## Session and control-plane tools
- `session-orient.mjs` — one-shot current-state orientation.
- `next-state.mjs` — derive next message, signal, and revision IDs.
- `handshake-sign.mjs` — session handshake writer.
- `turnfile.mjs` — portable CLI wrapper for init/open/status/heartbeat/close.
- `export-mailbox-json.mjs` — regenerate `working-session/MAILBOX.json`.
## Validators
- `turnfile-lint.mjs`
- `validate-mailbox-invariants.mjs`
- `validate-mailbox-session-gate.mjs`
- `validate-closeout.mjs`
- `validate-prd-promotion.mjs`
- `validate-v1-profile.mjs`
- `validate-v1-release.mjs`
- `validate-public-surface-snapshot.mjs`
- `validate-skills-preflight.mjs`
- `validate-ownership-guard.mjs`
- `validate-out-of-band-reconciliation.mjs`
- `validate-review-cycle-closure.mjs`
- `validate-heartbeat-loop.mjs`
## PRD and eval helpers
- `run-evals.mjs`
- `run-prd-evals.mjs`
- `prd-status-summary.mjs`
## Optional-profile and experimental helpers
- `aggregate-coordination.mjs`
- `compare-turnfile-tasks.mjs`
- `validate-task-aggregate.mjs`
- `validate-tokenese-pairs.mjs`
- `validate-tkab-results.mjs`
- `validate-onboarding-evidence.mjs`
- `reconcile-stale-agent.mjs`
## Future organization
After v1.0.0, consider grouping these into `tools/session/`, `tools/validators/`, `tools/prd/`, and `tools/optional-profiles/`. Do not move them before updating evals, docs, and CI scripts.
