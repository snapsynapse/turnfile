# Public Surface Contract
This file records the current public and agent-facing surfaces so agents do not update one copy and forget the others.
## Current surfaces
- `README.md` — repository front door.
- `docs/index.html` — GitHub Pages landing page.
- `docs/llms.txt` — served LLM summary.
- `assistant-guide.txt` — root assistant guide.
- `assistant-guide-manifest.txt` — root guide manifest.
- `docs/.well-known/assistant-guide.txt` — served assistant guide copy.
- `docs/.well-known/assistant-guide-manifest.txt` — served manifest copy.
## Source of truth
There is not yet a generator for these surfaces. Until one exists, treat them as manually synchronized public artifacts.
The live consistency check is:
```bash
node tools/validate-public-surface-snapshot.mjs --format json
```
That validator derives the promoted PRD count from `working-session/docs/PRD_STATUS.json` and checks current public surfaces for stale promoted-count claims.
## Update rule
When PRD shelf counts, v1 release status, public claims, or assistant-facing guidance changes:
1. Update all affected public surfaces in the same change.
2. Refresh assistant-guide root and served copies together.
3. Run `node tools/validate-public-surface-snapshot.mjs`.
4. If a public-surface generator is added later, this file should name the generator command and the generated targets.
## Non-sources
Do not use archived boot files, old examples, mailbox archives, or historical PRDs as current public-surface sources. They are evidence, not live claims.
