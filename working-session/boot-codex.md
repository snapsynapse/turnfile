# Boot File - Codex (v10)

Read this first on Codex session start. It is the Codex handoff from session 20 closeout.

## Project

Turnfile (SNAP, Structured Negotiation of Autonomous Peers) is a file-based collaboration protocol for heterogeneous LLM agents working as peers with a human Maintainer as arbiter.

Canonical repo: `github.com/snapsynapse/turnfile`

## Startup Read Order

Use `docs/BOOT_SEQUENCE.md` as the canonical boot command manifest. This Codex boot file holds Codex-specific carry-forward and orientation notes; the manifest holds the ordered shared boot contract.

1. `docs/BOOT_SEQUENCE.md`
2. `working-session/TURNFILE.yaml`
3. `working-session/WORKLOG.md` status block
4. `working-session/MAILBOX.md` inbox snapshot and any Codex-assigned unread cards
5. `working-session/docs/PRD_STATUS.json`
6. `docs/llm/MODEL_LEDGER.md` and `skills/codex/MANIFEST.yaml`
7. `BASELINE.md`
8. `working-session/OPEN_QUESTIONS.md`
9. `working-session/chat-codex.md` latest close snapshot
10. Scope-specific PRDs, evals, and protocol docs for the task at hand

Prefer `tools/session-orient.mjs` for a one-shot fresh-state read after the manual boot file read:

```bash
node tools/session-orient.mjs --agent codex --emit json
```

## Boot Checks

1. Check `working-session/MAILBOX.md` first and action any Codex unread message before asserting readiness.
2. Create or update only the own chat file `working-session/chat-codex.md` when the current session needs a chat snapshot.
3. A missing peer chat file is warning only. Do not create `working-session/chat-claude.md` or any other peer chat file from the Codex lane.
4. Run an out-of-band drift check before relying on stale session state. If the boot read finds an unrecorded governance state change, record a reconciliation note or raise a `decision-required` escalation before mutating shared files.
5. Confirm ownership guard state with `node tools/validate-ownership-guard.mjs --format json`; expected shared hook path is `tools/hooks`.

## Session 20 Close State

Session 20 closed from the Codex side on 2026-06-18 on `main`.

- Turnfile revision at Codex close: `255`.
- Codex status: `idle`; Claude status: `active`; Gemini status: `active`.
- Mailbox state at close: Codex unread `0`; Claude unread `0`; Gemini unread `0`; Maintainer unread `0`.
- Locks at close: none.
- Heartbeat state: no Codex heartbeat carried forward.
- Boot rollover: v9 archived to `docs/archive/boot-codex/boot-codex_v9.md`; active boot is v10.

Immediate rule: re-read live files before asserting shared state. Claude, Codex, and the Maintainer may have changed coordination files between sessions.

## Current Protocol Anchors

1. Promoted PRDs live in `docs/prds/`.
2. Draft, held, deferred, and registry artifacts live in `working-session/docs/`.
3. `working-session/docs/PRD_STATUS.json` is the PRD shelf/status source of truth.
4. Role-keyed skill bundles are canonical session defaults: `skills/codex/` and `skills/claude/`.
5. Model-specific skill paths are compatibility artifacts, not deprecated unless the Maintainer explicitly says so.
6. English governance artifacts remain authoritative. Tokenese work must remain paired, synchronized, and Maintainer-legible.
7. Peer agents may request, propose, accept, counter, acknowledge, block, or decline. They may not order each other or the Maintainer.
8. Agents may read peer-owned files but may write only their own files and shared governance artifacts under protocol.
9. Conflict rebuttal depth is configurable through `coordination.conflict.rebuttal_rounds`; finite exhaustion routes to Maintainer adjudication, and unbounded convergence uses fresh `NO-NEW-OBJECTION` markers.
10. PRD-018 carries the selective-unlock gradient: Band A is `unlockable` by default, Bands B/C are `gated`; `unlockable` is only eligibility until explicit Maintainer unlock.

## Completed In Session 20

1. Codex opened session 20 from files, signed the session-20 handshake row, and routed PRD-036 implementation as Claude-implements/Codex-reviews.
2. Codex reviewed PRD-036 implementation APPROVE after focused verification. `evals/prd-036.evals.mjs` passed 10/10, the aggregate runner dry-run resolved deterministic PRD eval files, and `tools/run-evals.mjs` passed 27/27.
3. Codex cross-reviewed Gemini/Antigravity OT-007 bundle port APPROVE. Semantic fidelity, ownership boundary, manifest versioning, Antigravity discovery path, and SHA-256 hashes were checked.
4. Codex implemented the handshake-extension tooling lane: `validate-boot-sequence` now handles registered-agent peer checks across Claude/Codex/Gemini, `validate-skills-preflight` accepts repeatable `--repo-skill-bundle`, and Gemini's Antigravity bundle is wired into skill validation.
5. Codex reviewed PRD-034 implementation APPROVE and filed PRD-034 `done` in PRD_STATUS.
6. Codex implemented the PRD-035 expected-pending gate scope in `tools/run-prd-evals.mjs` and documented the behavior in README and `docs/VALIDATION.md`.
7. Claude resolved the earlier PRD-021 `boot-claude.md` blocker at rev 251 and reported `npm run -s evals:prd` and `npm run -s validate` green. Codex recorded the report but did not rerun the full suite during the role-specialization response.
8. Codex actioned Claude's role-specialization proposal. Codex accepted fast implementation, tooling, validators, runner/eval work, RED eval authoring, bounded eval-backed review, and routine lifecycle mechanics within ownership/closure boundaries. Codex supported a short peer-convergence PRD for Maintainer ratification.

## Carry Forward

1. At next boot, confirm mailbox state, run `tools/session-orient.mjs`, run ownership/closeout validators, and sign or update the next-session handshake before writes.
2. Gemini actioned `MSG-20260617-048` and accepted the role-specialization split. All agent inboxes are zero at Codex close.
3. Closeout validation is green from Codex current local evidence: `npm run -s validate` exits 0, and `npm run -s evals:prd` exits 0 with PRD-035 logged as expected-pending because its implementation state is still `evals-authored`.
4. The next structural governance item is the short peer-convergence PRD: routine implement/review pairs can converge eligible technical decisions without Maintainer or Claude brokering, while ownership, governance, irreversible, cross-scope, normative PRD acceptance, security-sensitive policy, and peer-owned files still escalate.
5. Machine-speed Tokenese remains the near-term Maintainer target for 2026-06-18 if possible, no later than 2026-06-19. Current path: PRD-035 Tokenese upstream/result sync, CLI-level three-model twin lane, and mandatory English projection into mailbox/worklog/docs.
6. PRD-031 shards remain the structural fix for routine lifecycle mechanics. Until that is fully active, shared aggregate files remain collision-prone.
7. Dirty worktree remains uncommitted and includes Claude/Gemini/Maintainer-owned changes. Do not stage or commit peer-owned files from the Codex lane without Maintainer direction.

## Tokenese Guardrails

1. English is authoritative for governance, lifecycle, locks, task claims, acceptance, normative PRD text, exact diffs, and public commitments.
2. Tokenese twins may be considered only for bounded operational status and handoff summaries after Maintainer approval.
3. `ev:obs` is useful only when paired with verifiable backing in the same source context. It is not standalone authority.
4. `^N` is not calibrated and must not be weighted in decisions.
5. Chat dense scratchpads remain OFF unless the Maintainer explicitly unlocks them.
6. Language-level changes stay in `/Users/snap/Git/tokenese` under that repo's process.

## Next Session Handshake

Before substantive work, establish:

1. Turnfile version: `SPEC.md` v0.1.0-reset and `TURNFILE.yaml` protocol version 0.1 unless the Maintainer changes the target.
2. Tokenese version: grammar v0.3, toolchain observed at v0.3.7 during session 18, and TKAB schema `tkab-check-1.1`; tag checker/toolchain per data point.
3. Onboarding and skill state: load the role-keyed Codex skill, verify model ledger coverage, follow `docs/BOOT_SEQUENCE.md`, self-validate with mailbox/Turnfile/PRD checks, and mutually confirm Claude/Codex context before write work.
4. Session completion criteria and scope: pick one bounded primary lane before implementation. Current recommendation is either the peer-convergence PRD, full validation and commit/push prep, or PRD-035 Tokenese sync.
5. Outstanding issues/questions: peer-convergence PRD authorship/review split, Maintainer commit/push decision, machine-speed Tokenese lane sequencing, and dirty-worktree commit strategy.

## Validation Commands

Run these after any closeout or shared-file mutation:

```bash
node tools/session-orient.mjs --agent codex --emit json
node tools/validate-mailbox-invariants.mjs --mailbox working-session/MAILBOX.md
node tools/turnfile-lint.mjs --turnfile working-session/TURNFILE.yaml --schema schemas/turnfile/turnfile-v0.schema.json
node tools/validate-prd-promotion.mjs --registry working-session/docs/PRD_STATUS.json
node tools/validate-closeout.mjs --turnfile working-session/TURNFILE.yaml --mailbox working-session/MAILBOX.md
node tools/validate-ownership-guard.mjs
npm run -s validate:skills
git diff --check
```

Run focused evals before relying on current implementation state:

```bash
node --test evals/prd-034.evals.mjs evals/prd-035.evals.mjs evals/prd-036.evals.mjs
```

## Closeout Lesson

Routine coordination can move faster, but only inside explicit ownership and closure boundaries. PRD-031 shards and a peer-convergence PRD should turn that working norm into a safer machine-speed path.
