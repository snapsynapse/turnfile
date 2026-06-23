# Turnfile Development Archive (sessions 12 — current at minimization time)

This directory is **historical evidence**, not required reading.

A fresh Turnfile adopter does NOT need to read this archive to use v1. The stable v1 surface lives at the repo root and under `docs/`, `schemas/v1/`, `templates/v1-minimal/`, and `tools/`. See `README.md`, `SPEC.md`, `docs/MINIMUM_VIABLE_TURNFILE.md`, and `CONFORMANCE.md` for the v1 reading path. Use `node tools/turnfile.mjs --help` for the CLI surface.

## What this archive covers

This archive preserves Turnfile development history from **session 12 through current at minimization time** (i.e. the most recent committed session at the moment the archive was created). The cutoff is intentionally elastic — no fixed N — because Turnfile is the protocol that defined this archive's existence, and the minimization step itself is one of the last release-prep steps before v1.0.0 ratify.

`examples/inception/` separately preserves the **session 1 through 11** record. That earlier archive is the original "first contact" record for the protocol's invention. PRD-046 leaves `examples/inception/` semantically untouched.

## What's preserved (by pointer, not duplicated)

Per PRD-046 C2 (Claude counter, MSG-20260623-026): this archive prefers **git-revision pointers** over content duplication for material that git already preserves byte-for-byte. The repository is the archive; this README is the index.

### WORKLOG history (sessions 12 onward)

- Live file: `working-session/WORKLOG.md` (current session's running log) and `working-session/WORKLOG_ARCHIVE.md` (compacted prior sessions, sessions 12 onward)
- Recoverable from git at any commit since session 12 opened: `git log --oneline -- working-session/WORKLOG.md working-session/WORKLOG_ARCHIVE.md`
- Anchor commits: session 12 opens at `fd26f8a` (2026-06-12, "Session 12: skill-versioning metaskill, Claude SKILL.md v0.3.0, boot alignment, preflight tooling"); session 28 close at `767e07b` ("Session 28 close: PRD-031 Phase 3 done, PRD-042 promoted, PRD-018/019/039 done-flips"); session 29 close commit is the final pre-v1.0.0 anchor.

### MAILBOX history (sessions 12 onward)

- Live file: `working-session/MAILBOX.md` (current session active + closed-summary ledger) and `working-session/MAILBOX_ARCHIVE.md` (compacted history)
- Recoverable via `git log --oneline -- working-session/MAILBOX.md working-session/MAILBOX_ARCHIVE.md`
- The MAILBOX format was migrated to newest-first compact view on 2026-02-10; that migration is captured in the in-file header comment.

### Retired drafts and intermediate working-session docs

- `working-session/docs/` contains in-progress PRDs not yet promoted. Promoted PRDs live at `docs/prds/`.
- Retired drafts and intermediate plans (e.g. mechanics plans, advisory notes, calibration audits) accumulated under `working-session/docs/` across sessions 12-current. They are preserved in git history; specific retired-but-still-recoverable items include:
  - PRD-031 Phase 2/3 mechanics + self-audit + migration prep (Codex notes)
  - PRD-027 tk-calibration-audit + result-package generators
  - Tokenese pair fixtures under `working-session/tokenese-pairs/`
  - Onboarding evidence packets under `working-session/docs/onboarding/evidence/<runtime>/<date>/`

### Model ledger detail

- Public-surface summary: `docs/llm/MODEL_LEDGER.md` (compatibility table; what runtimes/models have driven Turnfile successfully)
- Per-session evidence detail: preserved in WORKLOG entries (closeout sections name model + surface) and in `working-session/NEXT_SESSION_HANDSHAKE.md` (signed handshake rows per session)
- This archive intentionally does NOT duplicate model-ledger detail; the live ledger plus git history is authoritative.

### PRD shelf evolution

- Authoritative current state: `working-session/docs/PRD_STATUS.json` (46 PRDs as of session-29 minimization)
- Per-PRD classification for v1: `docs/prds/PRD_SHELF_RECONCILIATION.json` (added by PRD-043 R3)
- Promoted PRDs at `docs/prds/`; archived/superseded under `docs/archive/prds/`; in-progress drafts at `working-session/docs/`

### Boot-file history

- Live boot files: `working-session/boot-{claude,codex,gemini}.md`
- Archived prior versions: `docs/archive/boot-{claude,codex,gemini}/`
- One archive directory per agent, version-suffixed

## Why this archive shape

Turnfile's principle is plain-file source-of-truth. Git is the natural archive for plain-file history. Duplicating WORKLOG_ARCHIVE.md / MAILBOX_ARCHIVE.md into this directory would add maintenance debt without providing recoverability that `git show <sha>:<path>` doesn't already provide.

The exception: if a future state of the repository **removes** the live `working-session/WORKLOG.md` etc. (e.g. as the very last release-prep step before v1.0.0 promotion), then a snapshot of the pre-removal state SHOULD be captured under `examples/turnfile-development/snapshots/<date>/` to preserve a directly-readable copy. Per OQ-046-1 (Maintainer-approved), that snapshot happens only at the final release-prep step, not during this session.

## How to use this archive

You probably don't need to. Skip this entire directory unless you are:

1. **Auditing protocol evolution** — read the WORKLOG sequence via `git log --reverse --oneline -- working-session/WORKLOG.md working-session/WORKLOG_ARCHIVE.md`.
2. **Researching a specific PRD's history** — look at the PRD body in `docs/prds/PRD-NNN-*.md` (promoted) or `working-session/docs/PRD-NNN-*.md` (draft); for the apply-or-counter trail look at `working-session/MAILBOX.md` Closed Summary + `git log`.
3. **Verifying onboarding evidence for a specific runtime** — read `working-session/docs/onboarding/evidence/<runtime>/<date>/evidence.md`.
4. **Reconstructing pre-archive repo state** — git checkout the anchor commit cited above.

For fresh adoption, return to the v1 surface at the repo root.

## Inception archive (sessions 1-11)

`examples/inception/` preserves the original 11-session protocol-development record, including the unedited mailbox messages between Claude 4.6 and Codex 5.3 as they invented the protocol. That archive is preserved verbatim and is referenced from the repo README as the "see it in action" entry point.

This `examples/turnfile-development/` archive complements but does not replace it: inception is the origin story (sessions 1-11); turnfile-development is the evolution under three agents (Claude, Codex, Gemini) plus Qwen provisional checker (sessions 12 through v1.0.0 release).
