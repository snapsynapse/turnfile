---
name: skill-versioning
description: >
  Version tracking for Agent Skills and their associated files across
  sessions, surfaces, and platforms. Embeds version identity inside files
  rather than filenames. Maintains a manifest and changelog that travel
  with the skill bundle. Use this skill whenever opening, saving, or
  handing off a skill project that spans multiple sessions. Compatible
  with the agentskills.io open standard.
---

# Skill Versioning

## The Problem This Solves

Skill projects move between sessions, surfaces (Chat, IDE, CLI, Cowork),
platforms (Claude, Codex, Copilot), and local storage (Obsidian, working
directories, git repos). Version identity gets lost when it lives only in
filenames. A file renamed from `SKILL_v4.md` to `SKILL_v5.md` with no
internal record of what changed creates ambiguity that costs real time to
resolve.

This skill establishes three conventions that prevent that:

1. Every versioned file carries a version header inside itself.
2. A changelog travels with the skill bundle.
3. A manifest lists all files in the bundle so any session can verify completeness.


## What Gets Versioned

A skill bundle is a SKILL.md plus all associated files. Typical contents:

- SKILL.md (the skill definition)
- evals.json (evaluation suite)
- Generation scripts (e.g., generate.js, generate.py)
- Output artifacts (.docx, .pdf) produced by evals or real use
- Handoff notes
- Source material provided by the user (tracked but not versioned)

The skill itself (SKILL.md) and evals are the primary versioned artifacts.
Scripts, outputs, and handoff notes are tracked by the manifest but version
with the bundle rather than independently.


## Version Header

Every versioned file begins with a YAML frontmatter block (or extends an
existing one) containing these fields:

```yaml
---
skill_bundle: my-skill            # bundle name, stable across versions
file_role: skill                  # skill | evals | script | output | handoff
version: 5                        # integer, monotonically increasing
version_date: 2026-02-10          # date of this version
previous_version: 4               # null for v1
change_summary: >
  Rewrote Phase 5 layout rules. Removed per-section page breaks.
  Added content flow check. Added validation checklist as standalone final page.
---
```

### Rules

**version** is an integer. No semver, no dot notation. Skills iterate fast
and the distinction between major/minor/patch adds overhead without value
at this scale.

**change_summary** is required for every version after v1. One to three
sentences. Must describe what changed, not just that something changed.
"Updated Phase 5" is insufficient. "Rewrote Phase 5 page layout rules:
removed per-section page breaks, added content flow check" is sufficient.

**previous_version** creates a chain. Any session can trace the lineage.

**file_role** values:
- `skill` — the SKILL.md itself
- `evals` — the evals.json file
- `script` — generation scripts, utility scripts
- `output` — rendered artifacts (.docx, .pdf)
- `handoff` — session handoff notes
- `source` — user-provided source material (tracked, not versioned)
- `reference` — documentation in references/ loaded on demand
- `asset` — templates, images, fonts in assets/ used in output
- `agents` — platform UI metadata (e.g., Codex's agents/openai.yaml)

For files that cannot carry YAML frontmatter (binary files like .docx, .pdf,
.png), the manifest tracks their version. They do not get internal headers.

**SKILL.md frontmatter constraint:** The Agent Skills open standard
(agentskills.io) requires `name` and `description`. Different platforms
enforce different rules about additional fields:

| Platform | Allowed SKILL.md frontmatter |
|---|---|
| **agentskills.io spec** | `name`, `description`, `license`, `metadata`, `compatibility`, `allowed-tools` |
| **Claude (settings importer)** | Same as spec. Extra fields rejected. |
| **Codex (OpenAI)** | `name` and `description` only. Extra fields rejected. |
| **GitHub Copilot** | Follows agentskills.io spec. |

For maximum portability, keep SKILL.md frontmatter to `name` and
`description` only. If you need version info in SKILL.md and are only
targeting Claude-compatible platforms, nest it under `metadata`:

```yaml
---
name: my-skill
description: What the skill does.
metadata:
  skill_bundle: my-skill
  file_role: skill
  version: 3
  version_date: 2026-02-10
  previous_version: 2
  change_summary: >
    Added Phase 6 validation step.
---
```

If targeting Codex or other strict platforms, omit `metadata` from
SKILL.md entirely. The manifest tracks SKILL.md's version regardless,
so no version information is lost.


## Manifest

The manifest is a YAML file named `MANIFEST.yaml` at the root of the skill
bundle directory — the same level as `SKILL.md`. When the bundle is
packaged as a `.skill` ZIP (Claude's settings export format), the manifest
lives inside the ZIP. It is the single source of truth for what the bundle
contains.

```yaml
bundle: my-skill
bundle_version: 5
bundle_date: 2026-02-10
description: >
  Skill for generating professional documents from source material
  and user briefs. Handles research, structuring, and formatting.

compatibility:
  designed_for:
    platform: Anthropic Claude
    model: Claude Opus 4.6
    surface: Chat, Code
  tested_on:
    - platform: Anthropic Claude
      model: Claude Opus 4.6
      surface: Chat
      status: pass
      date: 2026-02-10
    - platform: Anthropic Claude
      model: Claude Sonnet 4.5
      surface: Chat
      status: partial
      date: 2026-02-09
      notes: Misses staleness detection on complex bundles
  spec_version: agentskills.io/1.0
  frontmatter_mode: minimal
    # minimal = name + description only (max portability)
    # claude = includes metadata block (Claude-compatible)

files:
  - path: SKILL.md
    role: skill
    version: 5
    hash: sha256:abc123...
    note: Canonical skill definition

  - path: evals.json
    role: evals
    version: 3
    hash: sha256:def456...
    note: 7 evals including real-content synthesis

  - path: scripts/generate.js
    role: script
    version: 4
    hash: sha256:ghi789...
    note: Generation script for eval 3

  - path: outputs/eval3-output.pdf
    role: output
    version: 4
    hash: sha256:jkl012...
    note: Rendered eval 3 output, 10 pages, validated

  - path: handoff.md
    role: handoff
    version: 2
    hash: sha256:mno345...
    note: Session handoff notes

  - path: sources/article-1.md
    role: source
    version: null
    hash: sha256:pqr678...
    note: Source article 1 (published)
```

### Rules

**bundle_version** increments when any versioned file in the bundle changes.
It is always equal to the highest version number among the versioned files.

**hash** is sha256 of the file contents. This is how a new session verifies
that the file it received matches what the manifest claims. Compute on save,
verify on load.

**version: null** for source files. They are tracked for completeness but
not versioned by this system.

**Paths are relative** to the bundle root. No absolute paths.


## The .skill Package Format

Claude's settings UI exports and imports skills as `.skill` files. These
are standard ZIP archives containing a directory named after the skill.
The versioning artifacts (`MANIFEST.yaml`, `CHANGELOG.md`, `README.md`)
live inside this directory at the same level as `SKILL.md`:

```
skill-name.skill (ZIP)
└── skill-name/
    ├── SKILL.md
    ├── MANIFEST.yaml
    ├── CHANGELOG.md
    ├── README.md
    ├── assets/
    └── references/
```

Claude's settings importer only looks for `SKILL.md` and the directory
structure it expects (references, assets). It ignores files it doesn't
recognize. This means the versioning artifacts travel safely inside the
`.skill` ZIP without affecting import/export behavior.

When bootstrapping or updating a bundle, always include the versioning
artifacts in the `.skill` ZIP so they survive round-trips through
Claude's settings UI.

**Bundles with files that don't fit in .skill:** Some bundles include
evals, generation scripts, rendered outputs, and handoff notes. The
`.skill` format only carries the skill definition and its references.
For bundles with additional tracked files, those files travel separately
(uploaded to conversations, stored in working directories, or committed
to git). The manifest tracks all files regardless of whether they fit
in the `.skill` ZIP — it is the complete inventory, not just the
packaged subset.


## Changelog

The changelog is a file named `CHANGELOG.md` at the root of the skill
bundle directory, alongside `SKILL.md` and `MANIFEST.yaml`. It is
append-only. New entries go at the top.

```markdown
# Changelog

## v5 — 2026-02-10
- SKILL.md: Rewrote Phase 5 layout rules. Removed per-section page breaks.
  Added content flow check. Added validation checklist as standalone final page.
- evals.json: Not yet updated (stale, needs v5 alignment).

## v4 — 2026-02-09
- SKILL.md: Removed minimum section density from Phase 3. Rewrote body section
  flow rules. Added optional appendix section.
- evals.json: Eval 3 expectations updated for content flow.
- generate.js: Body sections flow without page breaks. All 11 expectations pass.

## v3 — 2026-02-08
- SKILL.md: Added Phase 5 density verification.
- generate.js: First working generation script for eval 3.
```

### Rules

**Each entry names every file that changed** and what changed in it.

**Files that are stale get called out.** If SKILL.md changes but evals.json
was not updated to match, the changelog says so. This prevents the silent
drift that caused the v4/v5 confusion.

**Entries are human-written prose**, not auto-generated diffs. The point is
to communicate intent, not enumerate line changes. Git diffs are available
when the bundle is in git.


## Session Protocol

### Opening a session

When a skill bundle is loaded into a new session:

1. Read `MANIFEST.yaml` first.
2. Verify all listed files are present. Report any missing files.
3. For files with hashes, verify hashes match. Flag mismatches.
4. Read `CHANGELOG.md` to understand recent changes.
5. Check for staleness: if any file's version is lower than the bundle
   version, flag it as potentially stale and ask the user whether it
   needs updating.
6. If `MANIFEST.yaml` is missing, treat the bundle as unversioned. Offer
   to create one by inventorying the files and asking the user for version
   context.

### Saving / closing a session

When work is complete and files are being delivered:

1. Update version headers in all files that changed.
2. Update `MANIFEST.yaml` with new versions and hashes.
3. Append to `CHANGELOG.md`.
4. If any versioned file was changed but another dependent file was not
   updated (e.g., SKILL.md changed but evals.json was not updated), note
   the staleness explicitly in the changelog entry.
5. Deliver the full bundle to the user, or at minimum the changed files
   plus the updated MANIFEST.yaml and CHANGELOG.md.

### Handoff between sessions

A handoff note is a snapshot of project state for the next session. It
should include:

- Current bundle version
- What was accomplished this session
- What is stale and needs attention
- What the next session should do first
- Any decisions made that are not yet reflected in the files

The handoff note gets a version header and is tracked in the manifest.
It replaces (not appends to) the previous handoff note — there is only
one active handoff at a time. Previous handoffs are preserved in the
changelog history.

### Conflict resolution

When a session finds version conflicts (e.g., a file claims v5 but the
manifest says v4, or two files claim different bundle versions):

1. Present the conflict to the user with the specific discrepancy.
2. Show what each version claims via its change_summary.
3. Default recommendation: trust the most recent version_date.
4. Always ask the user for explicit confirmation before proceeding.

Never silently resolve a version conflict. The whole point of this system
is to make conflicts visible.


## Cross-Surface and Cross-Platform Considerations

### Claude Chat
No persistent filesystem. Files are uploaded/downloaded per session.
The manifest and changelog must travel with the uploaded files.
On session open, verify the bundle. On session close, deliver updated
bundle files to the user.

### Claude Cowork
Persistent filesystem within a project. The bundle can live as a
directory. The manifest and changelog persist between sessions.
Same protocol applies but files don't need to be re-uploaded.

### Claude Code
Git-native. The manifest and changelog complement git's own versioning.
The manifest adds role and staleness tracking that git doesn't provide.
The changelog adds intent that commit messages often lack.
Hashes in the manifest can be omitted when the bundle is in a git repo
since git handles integrity. Version numbers and change summaries
remain required.

### Codex (OpenAI)
Filesystem-based. Skills live in `~/.codex/skills/` or project
directories. Codex rejects SKILL.md frontmatter fields beyond `name`
and `description` — use `frontmatter_mode: minimal` in the manifest
and omit the `metadata` block from SKILL.md. Codex's `agents/openai.yaml`
can be tracked in the manifest with `role: agents`.

### GitHub Copilot / VS Code
Skills in `.github/skills/` or `.claude/skills/`. Follows the
agentskills.io spec. Manifest and changelog are ignored by Copilot
(treated as unknown files in the skill directory).

### General principle
The manifest and changelog are inert files. No platform currently
reads them. They exist for the human and for agents that have the
skill-versioning skill loaded. This means they never break
compatibility — they're invisible to platforms that don't know
about them.


## File Naming

Versioned files use stable names without version numbers:

- `SKILL.md` (not `SKILL_v5.md`)
- `evals.json` (not `evals_v3.json`)
- `generate.js` (not `generate-v4.js`)

The version lives inside the file (via the header) and in the manifest,
not in the filename. Version-numbered filenames are how we got into
trouble in the first place.

Exception: when a user's local storage requires version-in-filename for
their own workflow (e.g., keeping multiple versions visible in Obsidian),
the manifest is the tiebreaker for which version is canonical. The
internal version header must still match.


## Bootstrap

To version an existing unversioned skill bundle:

1. Inventory all files present — read the directory structure or uploaded
   file list. Do not ask the user to list files; determine this yourself.
2. Ask the user what version number to assign. If there's a handoff note
   or other context, propose a number based on the history.
3. Add version headers to all text files.
4. Generate `MANIFEST.yaml` with hashes.
5. Create `CHANGELOG.md` with a single entry summarizing known history.
6. Deliver the versioned bundle.

This is a one-time operation per skill bundle.
