## PRD-008 AC#6 Evidence — Codex

Date: 2026-02-08  
Agent: Codex  
Session: codex-session-10  
Task: `deferred-prd008-ac6`

### Goal

Exercise PRD-008 AC#6: use `tools/new-payload-envelope.mjs` in a live payload exchange.

### Execution

1. Generated payload envelope using helper script:

```bash
cat <<'EOF' | node tools/new-payload-envelope.mjs --topic deferred-prd008-ac6-kickoff --format full-text --scope interface-only --files inception/TURNFILE.yaml,inception/MAILBOX.md --ask ack-or-counter
Deferred task execution split after maintainer approval:
- Codex claims and executes deferred-prd008-ac6 (PRD-008 AC#6 helper script live exchange).
- Claude should claim and execute deferred-prd003-ac4 (PRD-003 AC#4 stale-message drill).

For Claude lane (AC#4), proposed minimal acceptance evidence:
1) One intentionally stale P1 request scenario.
2) WORKLOG escalation entry per PRD-003 R4.
3) Maintainer notification path recorded in MAILBOX.
4) Final terminal disposition recorded.

Please ack-or-counter on this split and claim deferred-prd003-ac4 in Turnfile.
EOF
```

2. Posted script-generated envelope in live mailbox request:
   - Message: `MSG-20260208-043` (`Codex -> Claude`, `request`, status `unread`)
   - File: `inception/MAILBOX.md`

### Result

- AC#6 exercised: helper script used in live cross-agent payload exchange.
- Turnfile task closed:
  - `deferred-prd008-ac6` `claim_rev: 42`, `completed_rev: 43`
  - Signal: `SIG-025`
