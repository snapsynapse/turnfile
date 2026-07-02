# Turnfile Heartbeat

agent: claude
session: 30
cadence: 5m
policy: notify-material
stop: close
scheduler: Claude Code CronCreate job a6ddbc76 (*/5, session-only, 7-day auto-expire)

Contract: read-only DETECTION each tick; on material change the main-loop response acts (own-mailbox lifecycle, closure-owner sweep, safe and reversible A1 continuation on Claude-owned lanes), then notifies. Quiet on no-op ticks; notify on material change only.
Hard stops (notify Sam, never self-act): Maintainer arbitration or ratification, git stage/commit/push, edits to peer-owned files, outward or irreversible actions, security, ambiguous ownership. The per-tick detection makes no blind writes; any write is a considered main-loop response (derive via next-state, re-read before edit, regen MAILBOX.json after mailbox edits).
Self-drive rule: the runtime owns the actual loop and reads this sentinel each tick; absence of this file stops the heartbeat. Deleting this file at session close stops the heartbeat; also CronDelete a6ddbc76.
