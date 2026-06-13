# PROJECT_CONTEXT.md — canonical-spec-page for Turnfile

Config for the `canonical-spec-page` skill (v8+). All `ASK` fields have been answered from the first real build session (2026-04-09 / 2026-04-10). Re-runs of the skill should load this file in Phase 0 and skip the questionnaire entirely.

```yaml
# Identity
project_name: Turnfile
canonical_url: https://turnfile.work/
repo_slug: snapsynapse/turnfile

# Hero
tagline: "Negotiation, not transaction. Collaboration, not control."
hero_h1: "Making adversarial agents play nice."
hero_subtitle: >
  An open protocol for LLM agents that disagree, negotiate, and build
  consensus — without an orchestrator telling them what to do.
hero_hook: >
  Most multi-agent frameworks assume a boss. One model plans, others
  execute, and failure cascades before anyone catches it. Turnfile inverts
  that: peer agents own their lanes, counter-recommendations are
  first-class, and a human arbitrates — without copy-paste relay duty.

# Hero visual identity element (v8 menu in content-structure.md)
hero_visual_pattern: syntax-coloured-code-snippet
hero_visual_details: >
  Compact turnfile.yaml excerpt in a .turnfile-snippet div with span-wrapped
  tokens (.tk-key for keys, .tk-str for strings, .tk-cm for comments, .tk-arr
  for the turn arrow). Shows agents/lanes/arbiter/turn. Wrapped as
  role="img" tabindex="0" with aria-label describing the example. Turnfile is
  the precedent for this hero-visual pattern.

# SEO
keywords:
  - turnfile
  - SNAP
  - structured negotiation of autonomous peers
  - multi-agent protocol
  - LLM collaboration
  - peer agents
  - counter-recommendation
  - human-in-the-loop
  - mailbox protocol
  - markdown coordination
  - auditable AI

# Authorship
author_name: Sam Rogers
author_url: https://paice.work/     # confirmed in session; HG25 uses LinkedIn, Turnfile uses PAICE.work PBC
publisher_name: PAICE.work PBC
publisher_url: https://paice.work/
twitter_handle: "@snapsynapse"
twitter_site: "@paicework"            # v6 addition — the project/org account (ASK to confirm correct handle if different)

# Dates
date_published: "2026-02-08"          # VISION.md v1 creation date — the public origin of the protocol as a documented artifact
date_modified: "2026-04-09"           # update on each regeneration
# Rationale for date_published: git log --reverse gives 2026-04-06 (first commit of current repo state),
# but the inception sessions referenced in VISION.md started in early February 2026. User confirmed
# 2026-02-08 as the correct "first publication" date in the 2026-04-09 session.

# Versioning
version: "v0.1.0-draft"               # CHANGELOG is still [Unreleased]; pre-release draft pill
canonical_file: VISION.md             # user-confirmed choice over PROTOCOL_CORE.md — VISION is the maintainer-intent source
canonical_file_repo_path: VISION.md   # at repo root, not under docs/ — commits URL is /commits/main/VISION.md

# Theme
theme_accent: "#6c8cff"               # reuses HG25 dark-indigo. NOTE: this PROJECT_CONTEXT.md originally
                                      # warned "avoid reusing HG25 indigo (#6c8cff)" — the first build
                                      # session reused it anyway and the user did not object. Flagged for
                                      # the next maintainer review: should Turnfile get a distinct accent?
dark_mode_default: true
publish_root: "docs/"
mode: enhance-retroactive             # as of 2026-04-10 — see v8 Phase 1 detection. The page was hand-derived
                                      # from the handoff file (now archived) and is missing Tier-2 companion
                                      # files. Next skill run should detect and offer to upgrade.

# JSON-LD: DefinedTerm
defined_term_name: Turnfile
defined_term_alternate_names:
  - turnfile
  - SNAP
  - Structured Negotiation of Autonomous Peers
defined_term_description: >
  A file-based protocol for peer-based multi-LLM collaboration. A Turnfile
  is the runtime coordination artifact that captures turn-taking, ownership,
  lock state, and next-action state in a structured, human-legible format.
  There is no orchestrator; agents propose within owned lanes and a human
  maintainer arbitrates.

# JSON-LD: TechArticle citations (sibling specs in PAICE.work Open Patterns)
citations:
  - { name: "Graceful Boundaries", url: "https://gracefulboundaries.dev/" }
  - { name: "HardGuard25",         url: "https://hardguard25.com/" }
  - { name: "Knowledge as Code",   url: "https://knowledge-as-code.com/" }
  - { name: "Skill Provenance",    url: "https://skillprovenance.dev/" }

# DefinedTerm.sameAs
same_as:
  - https://github.com/snapsynapse/turnfile
# ASK before next run: is Turnfile listed on ClawHub yet? Any package on npm/PyPI?

# IndieWeb rel=me (v6 addition)
rel_me:
  - https://github.com/snapsynapse
  - https://paice.work/
# ASK: LinkedIn, Mastodon, or other identity-graph profiles Turnfile explicitly claims?

# Canonical reference note
cross_post_targets: []
# ASK: once Turnfile starts getting public write-ups, populate with LinkedIn/blog/dev.to URLs
# so the canonical-note aside can cite specific cross-posts.

# Secondary demo page
secondary_demo: null
# No interactive demo. The inception archive at examples/inception/ is linked as the "see it in action"
# section but lives in the GitHub repo, not as a sub-route on the domain.

# OG image
og_image_source: imgs/og.png                    # exists at repo root; copied to docs/imgs/og.png on first build
og_image_alt: null                              # ASK next run — needs descriptive text for v7 og:image:alt
og_image_dimensions: null                       # ASK next run — verify 1200x630 and populate og:image:width/height
```

## Notes from the archived handoff

The pre-skill hand-written `working-session/handoff-landing-page.md` was deleted in commit `9492fe8` after its content was absorbed into the first build. Key facts from it that aren't already encoded above:

- **Don't scan `node_modules/`** when running the a11y skill — Turnfile has a committed (or locally-present) `node_modules/` at the repo root from the validator deps. Scan scope should be `docs/` only.
- **The working-session/ directory is gitignored** and is where active sessions live. Do not treat anything in `working-session/` as canonical input to future skill runs.
- **First-commit date is not publication date.** All Turnfile commits are dated 2026-04-06+ but the protocol's public origin is 2026-02-08 (VISION.md creation). This is the specific precedent cited in SKILL.md Phase 0 for the "always ask date_published" rule.

## Tier-2 retroactive-enhance gap (as of 2026-04-10)

The current `docs/index.html` on `main` (commit `c0b0829`) is missing every v6/v7/v8 addition. When the skill is next invoked on this repo, Phase 1's `enhance-retroactive` detection should flag all of these:

- [ ] `docs/sitemap.xml`
- [ ] `docs/robots.txt`
- [ ] `docs/llms.txt`
- [ ] `docs/site.webmanifest`
- [ ] `docs/404.html`
- [ ] `<link rel="manifest">` in head
- [ ] `<link rel="sitemap">` in head
- [ ] `<link rel="alternate" type="text/plain" ... llms.txt>` in head
- [ ] Footer `<a href="/llms.txt">` link
- [ ] `twitter:site` meta (currently only `twitter:creator`)
- [ ] `og:image:alt`, `og:image:width`, `og:image:height` meta
- [ ] IndieWeb `<link rel="me">` entries
- [ ] `aria-label="Main navigation"` on `<nav>`
- [ ] `.btn:focus-visible` / `.btn-primary:focus-visible` focus ring CSS
- [ ] `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">` (Phase 4 / HTTPS hardening)
- [ ] siteline-scan run against https://turnfile.work/ once DNS propagates

Nothing already present needs changing — the retroactive pass should touch only the missing items.
