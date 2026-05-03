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

## Before an Experiment

1. Run `npm ci` after dependency changes.
2. Run `npm run validate`.
3. Confirm `working-session/MAILBOX.md` has expected active messages and Open Queue state.
4. Regenerate `working-session/MAILBOX.json` after mailbox edits with `npm run export:mailbox`.
5. Decide whether `working-session/` is the active experiment workspace or whether the previous run should be archived under `examples/`.

## CI

GitHub Actions runs `npm ci` and `npm run validate` on pushes to `main` and on pull requests.
