---
skill_bundle: skill-provenance
file_role: reference
version: 21
version_date: 2026-05-29
previous_version: 20
change_summary: >
  Documented pre-package source validation and clarified assistant-facing
  trust boundaries.
---

# Skill Provenance - README

## What this is

A metaskill that provides portable provenance, integrity, and drift control
for Agent Skills across local folders, registries, platform uploads, and
multi-agent sessions. It keeps version identity with the bundle, inside
files when practical and always in the manifest, tracks staleness across
related files, and maintains a manifest so any session can verify what it
has.

You need this if you've ever uploaded a skill file to a new session and
couldn't tell whether it was the latest version, discovered that the
SKILL.md was updated but the evals weren't, or lost track of what changed
between sessions.

## Why this matters now

As of March 7, 2026, skills are used across Claude settings, Claude Code,
the API, the Agent SDK, and multiple non-Claude clients. One skill bundle
often exists as several copies: a local directory, an uploaded `.skill` or
`.zip`, and one or more deployed surfaces. skill-provenance exists to keep
those copies traceable without replacing each platform's native versioning.

## Why this still exists

Most ecosystem tools track source, registry, install, or deployment state.
Skill Provenance tracks the actual multi-file bundle an agent is editing.
That matters when `SKILL.md`, evals, scripts, packages, and deployed
copies can drift independently.

It is an author-side layer that complements package managers, registries,
and platform APIs. Source pinning and registry versioning reduce risk, but
they do not replace bundle-local staleness detection, changelogs, hashes,
or cross-surface drift checks.

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
    ├── CHANGELOG.md           ← versioning: recent in-bundle history
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

If a loader only accepts `.zip` or `.md`, rename the archive from
`.skill` to `.zip` before uploading. This is the tested path for
Perplexity Computer. The contents stay identical.

**What doesn't fit in .skill:** Some skill projects include evals,
generation scripts, rendered outputs (.docx, .pdf), and optional handoff
notes.
The `.skill` format only carries the skill definition and its references.
These extra files travel separately (uploaded to conversations, stored
in working directories, or committed to git). The manifest tracks all
files regardless — it's the complete inventory, not just the packaged
subset.


## Quick start

### 1. Make the skill available to your agent

The skill-provenance SKILL.md needs to be accessible in whatever surface
you're working in. How you do that depends on the agent and surface:

For public installs, first verify the bundle with the GuideCheck assistant
guide at `https://skillprovenance.dev/.well-known/assistant-guide.txt`
or by manually cloning the repo and running `./skill-provenance/validate.sh`.
The assistant guide is a bounded pre-install integrity check. It does not
install the skill and does not prove the bundle is safe to run.

| Surface | How to load the skill |
|---|---|
| **Claude Chat** (no project) | Upload `SKILL.md` at the start of the conversation along with your bundle files. Reference it explicitly: "Use the skill-provenance skill to bootstrap this bundle." |
| **Claude Chat** (project) | Add `SKILL.md` to the project knowledge. It will be available in every conversation within that project. |
| **Claude Cowork** | Place the `skill-provenance/` folder in your Cowork skill directory. Claude will discover it automatically. |
| **Claude Code** | Place the `skill-provenance/` folder in your project's skill directory (typically alongside other skills). Reference it in your CLAUDE.md if needed. |
| **Codex** | Use a strict-platform copy in `~/.codex/skills/skill-provenance/` or a project skill directory. Generate one with `./package.sh strict`, or strip the SKILL.md `metadata` block manually. |
| **Gemini CLI** | Copy or symlink a strict-platform copy to `~/.gemini/skills/skill-provenance/` for user-wide availability, or `.gemini/skills/skill-provenance/` for a single project. `./package.sh strict` prepares the minimal-frontmatter variant. |
| **Perplexity Computer** | Upload a `.zip` or folder copy when supported. For strict loaders, start from `./package.sh strict`, then rename `.skill` to `.zip` if needed and keep the trigger-rich description. |
| **Generic agentskills clients** | Use the directory bundle directly. Some cross-client tooling also recognizes `.agents/skills/skill-provenance/` as a neutral install location. |

Treat the bundle as moving through three states:

1. **Canonical source bundle** — the checked-in `skill-provenance/`
   directory. It ships in `frontmatter_mode: metadata` and is the
   author-side source of truth.
2. **Strict-platform install copy** — a derived copy for Codex, Gemini
   CLI, Perplexity, or any loader that only accepts `name` and
   `description`. Generate it with `./package.sh strict`.
3. **Registry package** — a derived consumer package such as `.skill` or
   a ClawHub upload. Generate the ClawHub variant with `./package.sh
   clawhub`.

This keeps the canonical bundle stable while install and publish targets
stay explicit and reproducible.

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

Load or provide all the files that belong to your skill bundle (SKILL.md,
evals, scripts, outputs, and any existing handoff note) and tell the
agent:

> "Bootstrap this skill bundle with skill-provenance. Call it [MAJOR.MINOR.PATCH]."

If you don't know the version number, just say "bootstrap this bundle"
and the agent will ask. The agent inventories the files itself — you don't
need to list them or count them.

The agent will:
- Inventory all files
- Add internal version headers where safe and record manifest-only versions
  for strict-format files
- Create `MANIFEST.yaml` (file inventory with roles and hashes)
- Create `CHANGELOG.md` (with a single entry summarizing known history)
- Return the updated bundle

### 3. Use it in ongoing work

Once a bundle is versioned, the protocol is automatic at session boundaries:

**Opening a session:** Load the bundle files for the current surface.
Tell the agent to verify the bundle. It reads the manifest, checks for
missing or stale files, and flags issues before you start working.

**During a session:** Work normally. The versioning system stays out of
your way until you're ready to save.

**Closing a session:** Tell the agent you're done. It updates internal
headers where applicable, the manifest, and the changelog for everything
that changed, flags anything stale, and packages the deliverables.
If you need a commit message, ask for one; inline output is the default,
with a file only when you explicitly want one.


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

- `skill-provenance/SKILL.md` (the versioning skill itself)
- All files from the extracted skill directory

Then say:

> "Bootstrap this skill bundle with skill-provenance. Call it 1.0.0."

Claude will inventory the files itself — you don't need to list them
or count them. If Claude needs clarification (version number, bundle
name, which files are references vs. assets), it will ask.

### Step 4: What Claude produces

Claude will:
- Add internal headers to frontmatter-friendly files and track strict-format
  files (such as JSON, scripts, and binaries) via `MANIFEST.yaml`
- Create `MANIFEST.yaml` listing all files with roles, versions, and hashes
- Create `CHANGELOG.md` with a 1.0.0 bootstrap entry
- Return all updated files

### Step 5: Repack and reinstall

Put the updated files back into the directory structure:

```
weekly-newsletter/
├── SKILL.md              ← updated; may remain manifest-only in minimal mode
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
the internal headers (when present) and manifest travel with it. When you download
it again, the versioning artifacts come with it.


## Porting bundles between surfaces

Different surfaces handle files differently. The bundle travels through
you — typically as a `.skill` ZIP or as loose files in a working
directory.

### What to carry

At minimum, carry these files when moving between surfaces:
- `MANIFEST.yaml` (the source of truth)
- `CHANGELOG.md` (recent history)
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

1. **Close the old session.** Tell the agent to package the bundle. It
   updates versioning artifacts and tells you which files to save.
2. **Download all output files** from the conversation.
3. **Open a new conversation.** Upload all bundle files.
4. **Tell the agent to verify the bundle.** It reads the manifest and
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
3. **In Code**, the agent can verify the bundle by reading the manifest.
   Hashes can be verified or omitted since git handles integrity.
4. **Commit the bundle** as your initial versioned state. From here,
   git and the manifest work together: git tracks every change, the
   manifest tracks roles and staleness.

#### Code → Chat

1. **Ensure the bundle is clean** in your repo (no uncommitted changes
   that you care about).
2. **Copy the bundle files** out of your repo into a local directory.
3. **Upload to Chat.** Tell the agent to verify the bundle.
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
3. The manifest, changelog, and any internal headers are all plain
   markdown and YAML — they render natively in Obsidian.
4. When you return, upload from Obsidian to whichever surface you're
   using next.

#### Any surface → Git (publishing)

1. **Ensure bundle is clean and versioned** (all files have current
   internal headers when applicable, manifest is up to date, changelog
   has latest entry).
2. **Copy the bundle directory** into your git repo.
3. **Commit with a message** that references the bundle version:
   `my-skill 5.1.0: added validation phase, updated checklist`
4. **Optionally tag:** `git tag my-skill-5.1.0`
5. The manifest hashes can be omitted in git since git handles integrity,
   but version numbers and change summaries remain required.

#### Any surface → ClawHub (publishing)

[ClawHub](https://clawhub.ai) is a skill registry where skills can be
published and discovered. Publishing to ClawHub is a one-time packaging
step, not a persistent surface:

1. **Prepare a derived upload folder** with `./package.sh clawhub`.
   By default this writes to `build/clawhub/skill-provenance/` at the
   repo root.
2. **Upload the generated folder** at
   `https://clawhub.ai/upload?updateSlug=<slug>`. ClawHub accepts a folder
   drop and recognizes SKILL.md at the root.
3. **Check the MIT-0 license checkbox.** ClawHub requires MIT-0.
   Attribution embedded in SKILL.md frontmatter and the Origin section
   survives this license requirement.
4. **Set the version number** to match `bundle_version` in your
   MANIFEST.yaml.
5. **Only after publish succeeds**, update `deployments.clawhub` in your
   canonical MANIFEST.yaml.

## Deployment surfaces and drift

The same skill bundle can now exist in multiple places at once: a local
working directory, a `claude.ai` settings upload, an API workspace skill,
and one or more local skill directories. Treat those as separate copies
that can drift independently.

The manifest can optionally include a `deployments:` block to record
surface-specific state such as API upload versions, local install targets,
or upload package format. Keep `bundle_version` as the author-side source
of truth. Platform-native versions such as Anthropic's API timestamps stay
in their own fields and should not be replaced with semver.

When you deploy or reinstall a skill, update the manifest and changelog if
you want traceability across those copies. When you edit locally without
redeploying, the deployment metadata becomes a useful reminder that the
deployed surface may be stale.

### What if I forget to carry the manifest?

An agent can reconstruct one from the files you upload, but it will need
to ask you about version numbers and history. This is the bootstrap
flow — it works, but you lose hash verification and staleness tracking
for that transition. Better to carry the manifest.


## Gemini Gems workflow

Gemini Gems can be version-tracked by saving the Gem's system prompt as
a file in your bundle (e.g., `GEM_INSTRUCTIONS.md` with
`file_role: reference`). On session close, ask the skill for a "Gem
update summary" to see which files need re-uploading to the Gem's
knowledge base. Gem updates are manual — there is no API for
programmatic Gem management. See eval 10 for an example scenario.


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


## Local hash validation

LLMs can compute SHA-256 hashes when they have shell access (Claude Code,
Cowork), but hash computation in Chat sessions is slower and can be
unreliable on large files. For reliable pre-upload verification, use the
included `validate.sh` script.

If installed as a Claude Code plugin, `/skill-provenance:validate` runs
this narrow hash and inventory check without the broader session-opening
review, changelog summary, handoff, or version bump behavior.

### Verify mode (default)

```bash
# From inside the bundle directory
./validate.sh

# Or pass the bundle path
./validate.sh path/to/my-skill
```

Output:
```
OK       SKILL.md
OK       evals.json
MISMATCH README.md
  expected: abc123...
  actual:   def456...
MISSING  generate.js

Checked 4 files, skipped 0, errors 2
```

### Update mode

After editing files locally, recompute all hashes in MANIFEST.yaml:

```bash
./validate.sh --update
```

Output:
```
UPDATED  SKILL.md
OK       evals.json
UPDATED  README.md

Checked 3 files, skipped 0, updated 2
MANIFEST.yaml updated.
```

This closes the local editing loop: edit files in your IDE or
Obsidian, run `./validate.sh --update`, then upload to Chat with
correct hashes already in place.

### Details

The script reads `MANIFEST.yaml`, computes actual SHA-256 hashes for
each file, and reports matches, mismatches, and missing files. Files
without hashes in the manifest are skipped. `MANIFEST.yaml` itself is not
self-listed, so the script treats it as the control file rather than a
hash target. Exit code 0 means all hashes verified (or updated); exit code 1
means missing files were found.

Zero dependencies beyond `bash`, `shasum` or `sha256sum`, and `awk`.

## Derived package helper

`package.sh` builds the two derived bundle states so you do not have to
hand-edit frontmatter or MANIFEST entries:

```bash
# Strict-platform install copy for Codex / Gemini CLI / Perplexity-style loaders
./package.sh strict

# ClawHub upload folder
./package.sh clawhub

# Build both under the repo's build directory
./package.sh all
```

What it does:
- Verifies the canonical bundle with `validate.sh` before building any
  derived package and stops if manifest drift or missing files are found.
- `strict`: copies the full tracked bundle, strips the SKILL.md
  `metadata` block, switches the derived manifest to
  `frontmatter_mode: minimal`, removes deployment records, and recomputes
  hashes in the copy.
- `clawhub`: keeps the metadata block, emits a consumer package with
  `SKILL.md`, `README.md`, `MANIFEST.yaml`, `evals.json`, and
  `evals-distribution.json`, removes development-only entries from the
  derived manifest, and recomputes hashes there.

The canonical bundle remains unchanged. Promote a derived copy back into
the canonical source only if you mean to change the source of truth.

Default output locations:
- `./package.sh strict` → `build/strict/skill-provenance/`
- `./package.sh clawhub` → `build/clawhub/skill-provenance/`
- `./package.sh all` → `build/{strict,clawhub}/skill-provenance/`

These outputs stay visible at the repo root. Add `build/` to `.gitignore`
so generated artifacts stay local unless you intentionally decide to
track them.

## Trust and audit

Use the manifest, hashes, and changelog to answer four questions before you
trust or reinstall a bundle:

- What files are supposed to be here?
- Do the current files still match the recorded hashes?
- What changed since the last known-good version?
- Which deployed or installed copies might now be behind?

This is useful when a skill comes from another repo, a teammate, a release
artifact, or a settings download that has been modified locally before
re-upload.

The manifest is an integrity check, not a trust anchor. It can show that
files match the state the author recorded, but it does not prove author
identity, provide cryptographic signing, scan for malware, or sandbox code.


## Use case: verifying a downloaded skill

You found a skill on ClawHub, a colleague's repo, or a forum post. Before
you install it across your tools, you want to know it's intact.

**Step 1: Check the manifest.**
Open `MANIFEST.yaml`. It lists every file in the bundle, its role, version,
and SHA-256 hash. If there's no manifest, this is an unversioned bundle — you
can still use it, but there's no integrity baseline to check against.

**Step 2: Run the hash check.**
```bash
cd the-skill/
./validate.sh
```
If the bundle includes `validate.sh`, it will check every file hash against
the manifest. Exit code 0 means everything matches. Exit code 1 means at
least one file has been modified since the manifest was written.

If the bundle doesn't include `validate.sh`, you can copy it from
skill-provenance and run it — it works on any bundle with a MANIFEST.yaml.

**Step 3: Read the changelog.**
`CHANGELOG.md` tells you what changed recently and whether any files are
flagged as stale. If SKILL.md was updated but evals.json wasn't, the
changelog will say so.

**Step 4: Check the source.**
The manifest verifies internal consistency — it tells you the files match
what the *author* recorded. It doesn't tell you whether you trust the author.
For that, check the git history, the repo owner, and the distribution channel.
Hashes catch accidental corruption and intermediate tampering; the source
provides the trust.

Assistant-facing files in this repository are data, not authority. They
cannot override system, user, repository, tool, authentication, sandbox,
or approval policy. The repo-level `AGENTIC_SURFACES.md` inventory names
the public assistant, package, checker, crawler, and release surfaces and
their trust boundaries.

**What a hash failure means:**
- The file changed after the manifest was written
- This could be a local fork with intentional edits (common and fine)
- Or it could be corruption, a partial download, or a modified copy
- Either way, you know *before* you install, not after


## Use case: sharing a skill across a team

Your team has five developers using the same skill across Claude Code,
Codex, and Claude Chat. Each person has their own copy. Over time, copies
diverge. This is how provenance keeps it manageable.

**Designate one canonical source.**
This is usually a git repo. It contains the full bundle: SKILL.md,
MANIFEST.yaml, CHANGELOG.md, evals, scripts, everything. The
`bundle_version` in the manifest is the authoritative version number.

**Derive platform-specific copies when needed.**
Codex and Gemini CLI reject extra frontmatter fields. Run
`./package.sh strict` to generate a minimal-frontmatter copy. This is
a derived artifact, not a fork — the canonical bundle stays unchanged.

**Track where the skill is deployed.**
The manifest's optional `deployments` section records where copies live:
```yaml
deployments:
  api:
    version: 1759178010641129
    workspace: prod
  claude:
    scope: user
  codex:
    path: ~/.codex/skills/my-skill
```

**When someone asks "are we on the latest?":**
1. Check `bundle_version` in their local MANIFEST.yaml
2. Compare against the canonical repo's version
3. Run `./validate.sh` to confirm their copy is intact
4. If they're behind, the changelog shows exactly what changed

**When someone updates the skill:**
They edit in the canonical repo, bump versions, update hashes
(`./validate.sh --update`), and push. Everyone else pulls. Platform
copies get regenerated from the new canonical source.

The point is not to prevent copies from diverging — that's inevitable
in a multi-platform world. The point is to make divergence visible and
reconciliation straightforward.


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

**Claude doesn't recognize the skill-provenance skill.**
Make sure the SKILL.md is loaded — either uploaded in the conversation,
in project knowledge, or in the skills directory. If you renamed it,
that's fine — Claude identifies it by frontmatter, not filename.

**Version numbers disagree between a file and the manifest.**
This is a conflict. The agent will present both claims and ask you to
decide. Default: trust the more recent `version_date`.

**I have files that aren't in the manifest.**
New files created during a session won't appear in the manifest until
you close the session and Claude updates the manifest. If you're
uploading files that should be tracked, tell Claude to add them.

**The changelog is getting long.**
Trim the in-bundle changelog to recent history and move older entries to
a repo-level full changelog, such as `../CHANGELOG.md` when the bundle
lives inside a git repo. Keeping the last 5-15 entries in the active
bundle changelog is reasonable. Note the archive location inside the
bundle changelog itself.

**I want to version source material too.**
Source material (user-provided articles, images, data) is tracked in
the manifest for completeness but not versioned. If source material
changes, update the hash in the manifest and note it in the changelog.


## Complementary tools

Skill Provenance is not a package manager, registry, API deployment
system, or signing layer. Use it with those tools when a skill becomes a
maintained multi-file bundle.

- **GitHub `gh skill`:** use for GitHub-hosted source refs, tree SHAs,
  pinning, and upstream update checks. Use Skill Provenance to track
  local bundle integrity, per-file versions, staleness, and changelog
  state after the source is installed or edited.
- **ClawHub and registries:** use for discovery, publishing, install
  trust, registry versions, and consumer packages. Use Skill Provenance
  to keep the canonical authoring bundle auditable before and after
  packaging.
- **Claude Skills API and platform uploads:** use for deployed platform
  versions. Use Skill Provenance to keep author-side semver, package
  contents, and deployment metadata traceable without replacing
  platform-native version IDs.
- **Skillman and package managers:** use for consumer-side install,
  update, and lockfile workflows. Use Skill Provenance when the bundle
  itself has multiple files that can drift while being authored.

Source pinning and registry versioning reduce risk. They do not replace
bundle-local staleness detection, changelogs, hashes, or cross-surface
drift checks.


## Relationship to the Agent Skills specification

The Agent Skills format (agentskills.io, now adopted by 30+ agent tools)
defines a `metadata` field in SKILL.md frontmatter that supports arbitrary
key-value pairs, including a `version` key. This is now a spec-standard
feature, not a Claude-only extension. Bundles can use that field for
SKILL.md version headers when they choose `frontmatter_mode: metadata` (see
the frontmatter constraint in the SKILL.md spec).

However, the spec's `metadata.version` is a static label — it doesn't
address cross-session staleness tracking, changelogs, manifests, or bundle
integrity verification. This skill fills that gap. It is complementary to
the spec, not a replacement.

This bundle ships in `frontmatter_mode: metadata` as the canonical source
bundle, using the spec's `metadata` field to embed author and source
attribution. Strict-platform copies can be derived when needed; SKILL.md
version identity still lives in `MANIFEST.yaml`.

The API's skill versioning system (epoch timestamps via `/v1/skills`)
handles version management for skills deployed through the API. Custom
skills uploaded to one surface do not sync to others — a skill uploaded
to the API is not available in claude.ai or Claude Code, and vice versa.
This skill handles version management for skills in development, moving
between sessions and surfaces, and stored locally — the workflow that
precedes API deployment and persists across it.


## References

### Official documentation

- [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — architecture, progressive disclosure, cross-surface availability
- [Agent Skills best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) — authoring guidance for SKILL.md
- [Agent Skills specification](https://agentskills.io/specification) — the open standard format definition
- [Agent Skills integration guide](https://agentskills.io/client-implementation/adding-skills-support) — client install paths, trust checks, collision handling
- [Skills cookbook](https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction) — API usage tutorial with Excel, PowerPoint, PDF examples
- [Using Skills with the API](https://platform.claude.com/docs/en/build-with-claude/skills-guide) — `/v1/skills` endpoints, custom skill uploads

### Blog posts and announcements

- [Introducing Agent Skills](https://claude.com/blog/skills) — launch announcement (October 2025)
- [Organization Skills and Directory](https://claude.com/blog/organization-skills-and-directory) — org-wide management, partner directory (December 2025)
- [Improving skill-creator: Test, measure, and refine Agent Skills](https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills) — evals, benchmarks, and trigger tuning (March 2026)

### Ecosystem

- [Agent Skills open standard](https://agentskills.io/home) — cross-platform spec, adopted by Claude, GitHub Copilot, Cursor, Codex, and others
- [Agent Skills GitHub](https://github.com/agentskills/agentskills) — specification source, reference library, validation tools (`skills-ref` for frontmatter validation)
- [GuideCheck](https://guidecheck.org/) — Human-Verifiable Assistant Guide standard used by Skill Provenance's public pre-install verification guide
- [Anthropic example skills](https://github.com/anthropics/skills) — official skill examples and templates
- [GitHub Copilot skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) — GitHub's Agent Skills implementation
- [OpenAI skills](https://github.com/openai/skills) — official skill catalog for Codex
- [Connectors directory](https://claude.com/connectors) — partner-built skills and MCP connectors
- [Gemini CLI creating skills](https://geminicli.com/docs/cli/creating-skills/) — Gemini CLI skill authoring guide
- [Gemini Gems](https://support.google.com/gemini/answer/16504957) — creating and sharing Gemini Gems
- [Skillman](https://github.com/pi0/skillman) — JS/TS skill manager for installing, updating, and organizing agent skills from npm and GitHub
- [Skillman (Python)](https://github.com/chrisvoncsefalvay/skillman) — Python CLI for installing and locking agent skills from GitHub repos

### Research

- [Agent Skills for Large Language Models](https://arxiv.org/abs/2602.12430) — survey of skill architecture, acquisition, security, and governance (Xu & Yan, 2026)

### Support articles

- [What are Skills?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Using Skills in Claude](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [How to create custom Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Teach Claude your way of working using Skills](https://support.claude.com/en/articles/12580051-teach-claude-your-way-of-working-using-skills)
