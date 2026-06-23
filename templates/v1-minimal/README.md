# Turnfile v1 Minimal Starter

This is the smallest conforming Turnfile session. Copy this directory to start a v1 working session.

## What you get

```
working-session/
  TURNFILE.yaml   coordination state
  MAILBOX.md      messages
  WORKLOG.md      narrative
```

Three files. That is the entire v1 minimum surface.

## First steps

1. Edit `working-session/TURNFILE.yaml`: set `maintainer.id` and add at least one agent under `agents:`.
2. Register your first task under `coordination.tasks`.
3. Have an agent claim the task and start work.
4. Use `working-session/MAILBOX.md` for cross-agent review with apply-or-counter.
5. Record narrative and closeout in `working-session/WORKLOG.md`.

## Validation

```
node tools/validate-v1-profile.mjs --root . --format json
```

A clean pass means the required artifacts are present, the inbox snapshot matches the open queue, and nothing in the minimal profile depends on historical PRD documents.

## Where to learn more

- `SPEC.md` — normative v1 contract
- `DEFINITIONS.md` — vocabulary
- `docs/MINIMUM_VIABLE_TURNFILE.md` — full v1 reference with worked example
- `CONFORMANCE.md` — verifier claims
- `docs/prds/PRD_SHELF_RECONCILIATION.json` — what is core v1 vs an optional profile

You do not need to read historical contract documents to run a v1 session.
