# Validation

Use `npm run validate` as the repo readiness gate before starting or resuming a Turnfile experiment.

## Commands

```bash
npm run validate
```

Runs the full local gate:
1. `npm run lint:turnfile`
2. `npm run lint:mailbox`
3. `npm run lint:prds`
4. `npm run validate:skills:ci`
5. `npm run evals`

```bash
npm run evals
```

Runs fixture-based regression evals for the validators and exporters. The evals create temporary files and assert CLI exit codes plus stable output snippets.

```bash
npm run validate:skills
```

Runs strict skills preflight, including global Codex skill install checks. Use this on a configured local workstation. CI uses `validate:skills:ci` because global installs are environment-specific.

## Eval taxonomy

Turnfile evals fall into three categories. They serve different purposes and run through different commands.

1. Repo readiness validators: the fixture-based regression evals run by `npm run validate` (step 5, `npm run evals`). These assert validator and exporter behavior and gate whether the repo is ready to start or resume an experiment.
2. PRD implementation evals: the per-PRD acceptance suites under `evals/*.evals.mjs`, run as an aggregate with `npm run evals:prd`. These enforce the eight-step implementation loop (PRD-006) by proving each promoted PRD against the evals its proposer authored.
3. Focused PRD evals: a single PRD suite run directly with Node, for example `node --test evals/prd-032.evals.mjs`. Use these when iterating on one PRD without running the full aggregate.

The aggregate runner is `tools/run-prd-evals.mjs` (the `npm run evals:prd` script). It resolves every file matching `evals/*.evals.mjs`, supports `--dry-run` introspection, and fails clearly when no PRD eval files are found. PRD suites whose registry `implementation.state` is not `done`, `eval-verified`, or `grandfathered` still run and are logged as `expected-pending`, but their result is excluded from the gate exit code. Implemented PRDs and non-PRD suites remain hard-gated.

## Before an Experiment

1. Run `npm ci` after dependency changes.
2. Run `npm run validate`.
3. Confirm `working-session/MAILBOX.md` has expected active messages and Open Queue state.
4. Regenerate `working-session/MAILBOX.json` after mailbox edits with `npm run export:mailbox`.
5. Decide whether `working-session/` is the active experiment workspace or whether the previous run should be archived under `examples/`.

## CI

GitHub Actions runs `npm ci` on pushes to `main` and on pull requests, then runs `npm run validate` and `npm run evals:prd` as separate steps. The repo readiness gate and the PRD implementation evals are kept as distinct CI steps so a PRD eval regression and a readiness-gate failure are attributed independently. Both steps are release gates; expected-pending PRD suites are visible in the log but do not fail the release gate until their registry state advances.
