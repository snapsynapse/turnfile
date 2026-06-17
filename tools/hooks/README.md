# tools/hooks — Maintainer-Owned Ownership Guard (PRD-033)

MAINTAINER-OWNED, AGENT-LOCKED. Everything under `tools/hooks/` and the root
`OWNERSHIP.yaml` are locked: no agent (claude, codex, gemini, …) may edit or commit them.
The guard enforces this on itself. Only the Maintainer changes the enforcement layer.

## What this is

The shared Layer-2 ownership guard. One pre-commit hook for all agents that blocks a
commit which stages a file owned by a different agent, so a peer edit to a skill bundle
(or boot/chat/shard file) cannot be committed by anyone but its owner.

## Files

| File | Role |
|---|---|
| `../OWNERSHIP.yaml` (repo root) | Hand-authored ownership map (who owns what). |
| `pre-commit` | Git hook entry point; execs the brain. |
| `guard-check.mjs` | The brain: pure `classifyCommit()` (unit-tested) + CLI (identity + git + exit code). |
| `../validate-ownership-guard.mjs` | Read-only boot/closeout drift check (collaborative tool). |

## How identity works (Maintainer choices, 2026-06-17)

1. Identity = `TURNFILE_AGENT` env var, else a per-clone gitignored `.turnfile-agent`
   file, else **fail closed** (commit blocked with instructions).
2. `TURNFILE_AGENT=maintainer` **bypasses** every check (trusted identity).
3. `TURNFILE_GUARD_OVERRIDE="<reason>"` bypasses with a required reason; the reason is
   printed and appended to gitignored `.turnfile-guard-overrides.log`. You must also note
   the override in `working-session/WORKLOG.md` (PRD-033 R5.2).

## Activation (one time, Maintainer or Codex per Maintainer direction)

```sh
# 1. Point git at the shared hook (off any agent-owned dir):
git config core.hooksPath tools/hooks

# 2. Set this clone's identity (example for a Claude session):
echo claude > .turnfile-agent          # or: codex / gemini / maintainer

# 3. Verify:
node tools/validate-ownership-guard.mjs        # expect: guard active: true, findings none
```

To retire the interim Codex hook: it lives at `working-session/agents/codex/hooks/`
(Codex-owned) — Codex removes it and repoints `core.hooksPath` to `tools/hooks`.

## Test it (no real commit needed)

```sh
# Unit tests (hermetic):
node --test evals/prd-033.evals.mjs

# Live smoke (in a scratch checkout): stage a peer-owned file and confirm the block:
#   TURNFILE_AGENT=claude  + stage skills/codex/... -> commit blocked
#   TURNFILE_AGENT=claude  + stage skills/claude/... + shared -> commit allowed
#   TURNFILE_AGENT unset   -> commit blocked (fail closed)
#   TURNFILE_AGENT=maintainer -> any commit allowed
```

## Maintainer approval checklist

- [x] `OWNERSHIP.yaml` ownership map looks right (claude / codex / gemini + legacy + maintainer_owned).
- [x] `node --test evals/prd-033.evals.mjs` passes.
- [x] Activate: `git config core.hooksPath tools/hooks`.
- [x] Codex retires `working-session/agents/codex/hooks/` and confirms.
- [x] `node tools/validate-ownership-guard.mjs` reports `guard active: true`.
- [x] Commit `OWNERSHIP.yaml` + `tools/hooks/**` as the Maintainer (these are agent-locked,
      so they must be committed with `TURNFILE_AGENT=maintainer` or before activation).
