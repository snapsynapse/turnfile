---
skill_bundle: skill-versioning
file_role: reference
version: 2
version_date: 2026-02-10
previous_version: 1
change_summary: >
  Added references section with official docs, blog posts, ecosystem links.
  Added spec relationship section. Simplified bootstrap prompt (Claude
  inventories files itself). Fixed macOS .skill extraction instructions.
  Added cross-platform interoperability notes.
---

# Skill Versioning — README

## What this is

A metaskill that prevents version confusion when skill projects move between
Claude sessions and surfaces (Chat, Cowork, Code). It embeds version identity
inside files rather than filenames, tracks staleness across related files, and
maintains a manifest so any session can verify what it has.

You need this if you've ever uploaded a skill file to a new session and
couldn't tell whether it was the latest version, or discovered that the
SKILL.md was updated but the evals weren't, or lost track of what changed
between sessions.


## The .skill format

Claude's settings UI exports and imports skills as `.skill` files. These
are standard ZIP archives containing a directory with the skill's files.
Claude's importer only looks for `SKILL.md` and the expected directory
structure — it ignores files it doesn't recognize. This means versioning
artifacts live safely inside the ZIP:

```
my-skill.skill (ZIP)
└── my-skill/
    ├── SKILL.md
    ├── MANIFEST.yaml          ← versioning: file inventory
    ├── CHANGELOG.md           ← versioning: change history
    ├── README.md              ← versioning: human instructions
    ├── assets/
    │   └── template.md
    └── references/
        ├── guidelines.md
        ├── examples.md
        └── checklist.md
```

When you download a `.skill` from Claude settings, the versioning
artifacts come with it. When you upload one, they're preserved. No
separate file management needed for the core skill bundle.

**What doesn't fit in .skill:** Some skill projects include evals,
generation scripts, rendered outputs (.docx, .pdf), and handoff notes.
The `.skill` format only carries the skill definition and its references.
These extra files travel separately (uploaded to conversations, stored
in working directories, or committed to git). The manifest tracks all
files regardless — it's the complete inventory, not just the packaged
subset.


## Quick start

### 1. Make the skill available to Claude

The skill-versioning SKILL.md needs to be accessible in whatever Claude
surface you're working in. How you do that depends on the surface:

| Surface | How to load the skill |
|---|---|
| **Claude Chat** (no project) | Upload `SKILL.md` at the start of the conversation along with your bundle files. Reference it explicitly: "Use the skill-versioning skill to bootstrap this bundle." |
| **Claude Chat** (project) | Add `SKILL.md` to the project knowledge. It will be available in every conversation within that project. |
| **Claude Cowork** | Place the `skill-versioning/` folder in your Cowork skill directory. Claude will discover it automatically. |
| **Claude Code** | Place the `skill-versioning/` folder in your project's skill directory (typically alongside other skills). Reference it in your CLAUDE.md if needed. |

### Where to find and manage skills in Claude settings

**To view installed skills:**
`claude.ai` → Profile icon (bottom-left) → `Settings` → `Skills`

**To download an existing skill:**
`Settings` → `Skills` → click the skill name → `Download` (downloads as `.skill` ZIP)

**To upload/install a skill:**
`Settings` → `Skills` → `Add Skill` → select the `.skill` file

**To view a skill within a project:**
Open the project → `Project Settings` (gear icon) → `Skills` section

### 2. Bootstrap an existing skill bundle

Upload all the files that belong to your skill bundle (SKILL.md, evals,
scripts, outputs, handoff notes — everything) and tell Claude:

> "Bootstrap this skill bundle with skill-versioning. Call it v[N]."

If you don't know the version number, just say "bootstrap this bundle"
and Claude will ask. Claude inventories the files itself — you don't
need to list them or count them.

Claude will:
- Inventory all files
- Add version headers to text files
- Create `MANIFEST.yaml` (file inventory with roles and hashes)
- Create `CHANGELOG.md` (with a single entry summarizing known history)
- Return the updated bundle

### 3. Use it in ongoing work

Once a bundle is versioned, the protocol is automatic at session boundaries:

**Opening a session:** Upload the bundle files. Tell Claude to verify the
bundle. Claude reads the manifest, checks for missing or stale files,
and flags issues before you start working.

**During a session:** Work normally. The versioning system stays out of
your way until you're ready to save.

**Closing a session:** Tell Claude you're done. Claude updates version
headers, manifest, and changelog for everything that changed, flags
anything stale, and packages the deliverables.


## Applying to an existing skill (worked example)

Say you have a skill called `weekly-newsletter` installed in Claude.
Here's how to apply versioning to it.

### Step 1: Download the skill

`claude.ai` → Profile icon → `Settings` → `Skills` → click
`weekly-newsletter` → `Download`

This gives you `weekly-newsletter.skill`, which is a ZIP containing:

```
weekly-newsletter/
├── SKILL.md
├── assets/
│   └── template.md
└── references/
    ├── guidelines.md
    ├── examples.md
    └── checklist.md
```

### Step 2: Unpack locally

The `.skill` extension is not recognized by macOS Finder or Archive
Utility, so double-clicking won't work. Use Terminal:

```bash
# Extract to a specific directory (recommended)
unzip ~/Desktop/weekly-newsletter.skill -d ~/Desktop/

# Without -d, files extract to your current working directory (~ by default),
# which can be confusing — always use -d to control the destination.
```

On Windows, rename `.skill` to `.zip` first, then extract normally:

```powershell
# PowerShell
Copy-Item weekly-newsletter.skill weekly-newsletter.zip
Expand-Archive weekly-newsletter.zip -DestinationPath ./newsletter-bundle
```

You now have the raw files in a working directory.

### Step 3: Bootstrap versioning in Claude

Open a new Claude Chat conversation (or use the project where the skill
lives). Upload:

- `skill-versioning/SKILL.md` (the versioning skill itself)
- All files from the extracted skill directory

Then say:

> "Bootstrap this skill bundle with skill-versioning. Call it v1."

Claude will inventory the files itself — you don't need to list them
or count them. If Claude needs clarification (version number, bundle
name, which files are references vs. assets), it will ask.

### Step 4: What Claude produces

Claude will:
- Add version headers to the YAML frontmatter of each `.md` file
- Create `MANIFEST.yaml` listing all files with roles, versions, and hashes
- Create `CHANGELOG.md` with a v1 bootstrap entry
- Return all updated files

### Step 5: Repack and reinstall

Put the updated files back into the directory structure:

```
weekly-newsletter/
├── SKILL.md              ← updated with version header
├── MANIFEST.yaml         ← new (versioning)
├── CHANGELOG.md          ← new (versioning)
├── README.md             ← new (versioning, optional)
├── assets/
│   └── template.md       ← updated with version header
└── references/
    ├── guidelines.md     ← updated with version header
    ├── examples.md       ← updated with version header
    └── checklist.md      ← updated with version header
```

Re-ZIP:

```bash
# macOS / Linux — run from the directory containing the skill folder
cd ~/Desktop
zip -r weekly-newsletter.skill weekly-newsletter/

# Windows (PowerShell) — rename .zip to .skill after creating
Compress-Archive -Path weekly-newsletter -DestinationPath weekly-newsletter.zip
Rename-Item weekly-newsletter.zip weekly-newsletter.skill
```

Then reinstall: `Settings` → `Skills` → remove the old version →
`Add Skill` → select the new `.skill` file.

The versioning artifacts survive the round-trip through Claude's settings
because they're inside the ZIP alongside the files Claude already knows
about.

### Step 6: Ongoing use

From now on, when you iterate on the skill in any Claude conversation,
the version headers and manifest travel with it. When you download
it again, the versioning artifacts come with it.


## Porting bundles between surfaces

Each Claude surface handles files differently, and there's no shared
filesystem between them. The bundle travels through you — typically as
a `.skill` ZIP or as loose files in a working directory.

### What to carry

At minimum, carry these files when moving between surfaces:
- `MANIFEST.yaml` (the source of truth)
- `CHANGELOG.md` (the history)
- Every file listed in the manifest

The manifest tells the receiving session what it should have. If you
forget a file, the opening protocol will catch it.

### The .skill ZIP as transport container

For moves involving Claude Chat or settings, the `.skill` ZIP is the
natural transport format. The versioning artifacts (`MANIFEST.yaml`,
`CHANGELOG.md`) live inside the ZIP alongside the other skill files.

For moves involving Claude Code or local git repos, loose files in a
directory are more natural. The ZIP is just a container — the versioning
system works identically either way.

### Surface → Surface workflows

#### Chat → Chat (new conversation, same or different project)

1. **Close the old session.** Tell Claude to package the bundle. Claude
   updates versioning artifacts and tells you which files to save.
2. **Download all output files** from the conversation.
3. **Open a new conversation.** Upload all bundle files.
4. **Tell Claude to verify the bundle.** Claude reads the manifest and
   confirms everything arrived intact.

If you're working with installed skills (visible in Settings → Skills),
download the `.skill` ZIP, unpack, update, repack, and reinstall.

#### Chat → Code

1. **Close the Chat session** and download all bundle files (or download
   the `.skill` ZIP and unpack it).
2. **Place files in your Code project** in a directory structure:
   ```
   skills/
     my-skill/
       SKILL.md
       MANIFEST.yaml
       CHANGELOG.md
       evals.json
       scripts/
       outputs/
   ```
3. **In Code**, Claude can verify the bundle by reading the manifest.
   Hashes can be verified or omitted since git handles integrity.
4. **Commit the bundle** as your initial versioned state. From here,
   git and the manifest work together: git tracks every change, the
   manifest tracks roles and staleness.

#### Code → Chat

1. **Ensure the bundle is clean** in your repo (no uncommitted changes
   that you care about).
2. **Copy the bundle files** out of your repo into a local directory.
3. **Upload to Chat.** Tell Claude to verify the bundle.
4. **Or repack as .skill:** ZIP the directory, rename to `.skill`,
   and install via Settings → Skills → Add Skill.

Note: Chat doesn't see your git history. The changelog and manifest are
what preserve context across this boundary.

#### Chat → Cowork / Cowork → Chat

Same pattern as Chat → Code, but files go into Cowork's filesystem
instead of a git repo. Cowork has filesystem persistence within a
project, so the bundle stays put between sessions.

#### Any surface → Obsidian (offline storage)

1. **Close the session** and download updated bundle files.
2. **Copy the bundle directory** into your Obsidian vault.
3. The manifest, changelog, and version headers are all plain markdown
   and YAML — they render natively in Obsidian.
4. When you return, upload from Obsidian to whichever surface you're
   using next.

#### Any surface → Git (publishing)

1. **Ensure bundle is clean and versioned** (all files have current
   version headers, manifest is up to date, changelog has latest entry).
2. **Copy the bundle directory** into your git repo.
3. **Commit with a message** that references the bundle version:
   `my-skill v5: added validation phase, updated checklist`
4. **Optionally tag:** `git tag my-skill-v5`
5. The manifest hashes can be omitted in git since git handles integrity,
   but version numbers and change summaries remain required.

### What if I forget to carry the manifest?

Claude can reconstruct one from the files you upload, but it will need
to ask you about version numbers and history. This is the bootstrap
flow — it works, but you lose hash verification and staleness tracking
for that transition. Better to carry the manifest.


## File naming

The versioning system uses stable filenames:

| Do this | Not this |
|---|---|
| `SKILL.md` | `SKILL_v5.md` |
| `evals.json` | `evals_v3.json` |
| `generate.js` | `generate-v4.js` |

The version lives inside the file and in the manifest. If your local
workflow requires version-numbered filenames (e.g., to keep multiple
versions visible in a directory), the manifest's version field is the
tiebreaker for which is canonical.


## Troubleshooting

**I can't open a .skill file on macOS.**
macOS Finder and Archive Utility do not recognize the `.skill` extension.
They won't offer to open it, even via `Open With`. Use Terminal:
`unzip my-skill.skill -d ~/Desktop/`. Always use `-d` to specify a
destination — without it, files extract to your current working directory
(usually `~`), which makes them hard to find.

**I ran unzip but can't find the extracted files.**
Unlike Finder's Archive Utility (which extracts next to the ZIP file),
Terminal's `unzip` command extracts to your current working directory,
not the directory where the `.skill` file lives. If you ran
`unzip ~/Desktop/my-skill.skill` from `~`, the files are in
`~/my-skill/`, not on your Desktop. Always use `-d` to control the
destination: `unzip ~/Desktop/my-skill.skill -d ~/Desktop/`.

**Claude doesn't recognize the skill-versioning skill.**
Make sure the SKILL.md is loaded — either uploaded in the conversation,
in project knowledge, or in the skills directory. If you renamed it,
that's fine — Claude identifies it by frontmatter, not filename.

**Version numbers disagree between a file and the manifest.**
This is a conflict. Claude will present both claims and ask you to
decide. Default: trust the more recent `version_date`.

**I have files that aren't in the manifest.**
New files created during a session won't appear in the manifest until
you close the session and Claude updates the manifest. If you're
uploading files that should be tracked, tell Claude to add them.

**The changelog is getting long.**
That's fine. It's append-only by design. For very mature skills, you
can archive older entries into a `CHANGELOG-archive.md` and keep only
the last 10-15 entries in the active changelog. Note this in the
changelog itself.

**I want to version source material too.**
Source material (user-provided articles, images, data) is tracked in
the manifest for completeness but not versioned. If source material
changes, update the hash in the manifest and note it in the changelog.


## Relationship to the Agent Skills specification

The Agent Skills format (agentskills.io) defines a `metadata` field in
SKILL.md frontmatter that supports arbitrary key-value pairs, including
a `version` key. This skill uses that field for SKILL.md version headers
(see the frontmatter constraint above).

However, the official spec's `version` field is a static label — it
doesn't address cross-session staleness tracking, changelogs, manifests,
or bundle integrity verification. This skill fills that gap. It is
complementary to the spec, not a replacement.

The API's skill versioning system (epoch timestamps via `/v1/skills`)
handles version management for skills deployed through the API. This
skill handles version management for skills in development, moving
between sessions, and stored locally — the workflow that precedes
API deployment.


## References

### Official documentation

- [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — architecture, progressive disclosure, cross-surface availability
- [Agent Skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) — authoring guidance for SKILL.md
- [Agent Skills specification](https://agentskills.io/specification) — the open standard format definition
- [Skills cookbook](https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction) — API usage tutorial with Excel, PowerPoint, PDF examples
- [Using Skills with the API](https://platform.claude.com/docs/en/build-with-claude/skills-guide) — `/v1/skills` endpoints, custom skill uploads

### Blog posts and announcements

- [Introducing Agent Skills](https://claude.com/blog/skills) — launch announcement (October 2025)
- [Organization Skills and Directory](https://claude.com/blog/organization-skills-and-directory) — org-wide management, partner directory (December 2025)

### Ecosystem

- [Agent Skills open standard](https://agentskills.io/home) — cross-platform spec, adopted by Claude, GitHub Copilot, Cursor, Codex, and others
- [Agent Skills GitHub](https://github.com/agentskills/agentskills) — specification source, reference library, validation tools
- [Anthropic example skills](https://github.com/anthropics/skills) — official skill examples and templates
- [Connectors directory](https://claude.com/connectors) — partner-built skills and MCP connectors

### Support articles

- [What are Skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [How to create custom Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Teach Claude your way of working using Skills](https://support.claude.com/en/articles/12580051-teach-claude-your-way-of-working-using-skills)
