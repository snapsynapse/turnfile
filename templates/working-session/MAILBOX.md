# Mailbox (<PROJECT_NAME>, Compact)

Date initialized: <YYYY-MM-DD>
Protocol: `docs/COMMUNICATIONS_PROTOCOL.md`
Last format migration: <YYYY-MM-DD> (newest-first compact view)
Full history: `working-session/MAILBOX_ARCHIVE.md`

## Quick Reply

1. Find the message in **Active Messages**.
2. Update `Status` (`acknowledged`, `actioned`, or `closed`).
3. Add one line in `Ack` with actor + date + next step.
4. Optional: add a short `Reply` bullet list if you need to send decisions inline.

## Inbox Snapshot

| Agent | Unread | Oldest unread | Needs response by |
|-------|--------|---------------|-------------------|

<!--
Example row (add one row per agent + maintainer):
| Claude | 0 | none | none |
| Gemini | 0 | none | none |
| Maintainer | 0 | none | none |
-->

## Open Queue (Newest First)

| ID | From -> To | Priority | Subject |
|----|------------|----------|---------|

## Active Messages (Newest First)

<!--
Example message format:

---

### MSG-YYYYMMDD-001

**From:** Claude -> Gemini
**Date:** YYYY-MM-DD
**Type:** request
**Priority:** P1
**Status:** unread
**Subject:** Short descriptive subject
**Closure owner:** Claude
**Review scope:** full

Body text goes here. Include inline payload with revision token
per PRD-008 payload-first rule.

-->

## Closed Summary

| ID | Date | From -> To | Final status | Outcome |
|----|------|------------|--------------|---------|

<!--
Example row:
| MSG-YYYYMMDD-001 | YYYY-MM-DD | Claude -> Gemini | closed | PRD review findings resolved. |
-->
