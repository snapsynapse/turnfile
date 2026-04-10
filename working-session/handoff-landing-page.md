# Session Handoff — Turnfile landing page

## Context

Replicating the HardGuard25 landing-page pattern on this repo (`~/Git/turnfile`). The pattern is a single `docs/index.html` served via GitHub Pages on a custom domain, with SEO, a11y (WCAG 2.1 AA, axe verified), JSON-LD structured data, and a distinctive inline-SVG logo.

Two prior reference implementations, each at successive maturity:

1. **Graceful Boundaries** — `~/Git/graceful-boundaries/index.html` (served at `gracefulboundaries.dev`). First iteration of the 8-enhancement pattern.
2. **HardGuard25** — `~/Git/hardguard25/docs/index.html` (served at `hardguard25.com`). Adds: a11y audit to WCAG 2.1 AA, secondary demo sub-page at `/generator/`, inline SVG logo + favicon, and HardGuard25-spec self-conformance.

HardGuard25 is the most recent and complete reference — use its `docs/index.html` as the primary template.

## The full pattern (what you will be applying)

### 1. Head: SEO + OG + Twitter

- `<meta name="keywords">` — project-specific terms
- `<meta name="author" content="Sam Rogers">`
- `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">`
- `<meta name="theme-color" content="{project accent}">`
- `<link rel="canonical" href="https://{project-domain}/">`
- Favicon links: `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`, `mask-icon`, `apple-touch-icon`
- Full OG set: `og:type=article`, `og:site_name`, `og:title`, `og:description`, `og:image`, `og:url`, `og:locale`, `article:published_time`, `article:modified_time`, `article:author`, `article:publisher`, `article:section`, multiple `article:tag`
- Twitter: `summary_large_image`, title/description/image, `twitter:creator=@snapsynapse`

### 2. Head: Two JSON-LD blocks

**`TechArticle`** — headline, description, datePublished, dateModified, author (Person → PAICE.work PBC), publisher (Organization), image, keywords, `isPartOf` PAICE.work Open Patterns, license CC-BY-4.0, copyrightHolder, `citation[]` to sibling specs (the list grows — as of HG25: Graceful Boundaries, Knowledge as Code, Skill Provenance, HardGuard25).

**`DefinedTerm`** — stakes the project as a named term. `name`, `alternateName[]`, `description`, `url`, `inDefinedTermSet` → PAICE.work Open Patterns, `sameAs[]` → GitHub + any package registries + ClawHub if listed.

### 3. Accessibility baseline (non-negotiable, verified)

Run the `a11y-audit` skill after writing the page (it lives at `~/Git/skill-a11y-audit/a11y-audit/`). The scan must end at **zero violations**.

Common fixes you will need:

- **Button contrast** — white text on an accent background like `#6c8cff` fails (3.07:1). Use dark text (`var(--bg)`) on accent buttons → ~6:1.
- **Links inside muted text** — `link-in-text-block` violation if the link color vs surrounding muted text is under 3:1. Add `text-decoration: underline` on byline and canonical-note links.
- **Landmarks** — wrap all content sections in `<main id="main-content">`. Otherwise axe reports `landmark-one-main` + `region` on every section.
- **Complementary aside inside main** — the canonical-note `<aside>` needs `role="note"` to override the implicit complementary landmark.
- **Skip link** — `<a class="skip-link" href="#main-content">Skip to content</a>` at top of body.
- **Any scrollable element** (like the charset display on HG25) needs `tabindex="0"` + `role="img"` + `aria-label`.
- **Form inputs** (if you have any — e.g. a secondary demo page) need `for="..."` on labels matching input ids; avoid `title="..."`-only labels.
- **Toasts / status regions** need `role="status" aria-live="polite"`.

### 4. Content structure

From HG25's `docs/index.html`, the section flow is:
- `<nav>` with logo + mobile-compact links + GH star button
- `<main>` wrapping:
  - Hero (title, subtitle, byline with `<time>`, hook paragraph, visual-identity element, CTA row)
  - Section explaining the why (pillars grid + comparison/exclusion table)
  - Install / usage section with code-grid
  - Secondary demo callout (if applicable — HG25 has `/generator/`)
  - Canonical-note `<aside role="note">`
- `<footer>` with meta line + links

### 5. Byline treatment

Centered `<p class="byline">` with: author name (`rel="author"`), org, `<time datetime>` published, `<time datetime>` updated, version pill, CC-BY-4.0 link (`rel="license"`). Underline all links.

### 6. Canonical reference note

`<aside class="canonical-note" role="note">` at the bottom of the main content area. States this page is the authoritative source, names cross-post targets that should cite it, includes last-revised timestamp, and links to GitHub revision history for the canonical file.

### 7. GitHub star button in nav

Inline flex anchor with a yellow (`#eab308`) star SVG and "Star on GitHub" text. `target="_blank" rel="noopener"` with `aria-label`. **No fetch() for live count** — Sam explicitly does not want that.

### 8. Inline SVG logo + favicon

Design a distinctive inline-SVG mark for the nav. Pair it with a wordmark span. Serve the same (or a variant) SVG as `/favicon.svg` with a dark rounded-square background baked in for tab contrast. Link `rel="icon"`, `mask-icon`, `apple-touch-icon` from every HTML page.

HardGuard25's logo is the "slashed zero" glyph — an ellipse (rx 7.5, ry 11) with a short slash contained inside. Picking a semantically resonant mark beats a generic shield/icon every time — look for the one symbol that encapsulates the project's core idea.

## Values you must confirm before writing the Turnfile page

Don't assume. Ask the user.

| Field | HG25 value | Turnfile value |
|---|---|---|
| Canonical URL | `https://hardguard25.com/` | **ask** — is `turnfile.com` / `turnfile.dev` / something else registered? |
| Page title | "HardGuard25 — An open standard for human-safe identifiers" | **ask** — current tagline |
| Hero h1 | "25 characters. Zero confusion." | **ask** — what is Turnfile's equivalent punchy statement |
| Keywords | hardguard25, unambiguous IDs, … | **derive from README + ask** |
| `datePublished` | `2019-11-14` (original LinkedIn) | **ask** — when does the project count as "published" |
| `dateModified` | today | today |
| Version pill | `v1.3.0` | check `CHANGELOG.md` / `package.json` |
| Revision history URL | `commits/main/SPEC.md` | check which file is canonical — Turnfile has `PROTOCOL_CORE.md`, `SESSION_CHARTER.md`, etc. **Ask which to point at.** |
| JSON-LD `TechArticle` citations | GB, KaC, SP, LinkedIn article | GB, HG25, KaC, SP (the sibling list) |
| `DefinedTerm.sameAs` | GitHub + npm + PyPI | GitHub + any package registries Turnfile ships to |
| Canonical-note cross-post targets | LinkedIn + sam-rogers.com | **ask** — where else is Turnfile discussed publicly |
| Theme color / accent | `#6c8cff` (dark indigo) | **ask or pick** — Turnfile may have an established palette |
| OG image | `docs/imgs/og.png` (copied from repo root) | check `imgs/` for a ready OG image; if not, flag and skip or use a placeholder |
| Logo design | slashed zero (glyph-as-concept) | **design one** — look at Turnfile's core metaphor. "Turnfile" suggests turns, rotations, pages, records, or turn-by-turn. Think turnstile, flipbook, page-turn, revolving file. Offer options before building. |
| Secondary demo page? | yes (`/generator/`) | **ask** — does Turnfile have an interactive demo worth including? |

## Watch out for

- **Existing docs/ content.** Turnfile's `docs/` folder already has files (`PROTOCOL_CORE.md`, `SESSION_CHARTER.md`, etc.). If you create `docs/index.html`, confirm with the user first whether GitHub Pages should serve the whole `docs/` directory or a subdirectory. HG25's `docs/` was basically empty before we started; Turnfile's isn't.
- **GH Pages workflow.** Check `.github/workflows/` — HG25 publishes `docs/` via a GH Pages workflow. Turnfile may not have one set up; confirm and add if needed.
- **CNAME.** Needs `docs/CNAME` (or repo-root `CNAME` depending on publish source) with just the domain name. DNS at the registrar is a separate manual step — flag this to the user, don't try to do it yourself.
- **Preview server.** Create `.claude/launch.json` pointing at the directory that GH Pages will serve, so Claude Preview + the a11y scanner can run locally:
  ```json
  {
    "version": "0.0.1",
    "configurations": [{
      "name": "docs",
      "runtimeExecutable": "python3",
      "runtimeArgs": ["-m", "http.server", "4173", "--directory", "docs"],
      "port": 4173
    }]
  }
  ```
- **Turnfile's existing webpage.** Check if Turnfile already serves a page somewhere. If yes, same pattern as HG25: move the existing page to a subdirectory (e.g. `/demo/`) before creating the new `docs/index.html`.
- **node_modules in repo root.** Turnfile has `node_modules/` committed or present at the repo root — do not scan that directory with the a11y skill.
- **Copyright.** Sam is `Sam Rogers`, org is `PAICE.work PBC` for JSON-LD / OG, Twitter handle is `@snapsynapse`. Don't change these.
- **Muted-text contrast.** HG25 uses `--text-muted: #8b90a0` on `--bg: #0f1117` which passes AA. If Turnfile uses a lighter background (light mode), recompute the contrast before reusing any color tokens.

## Workflow for the next session

1. Read `~/Git/hardguard25/docs/index.html` end-to-end as your primary template.
2. Read Turnfile's `README.md`, `VISION.md`, `CHANGELOG.md`, and any existing landing materials to extract the content.
3. **Ask the user to confirm** the fields in the table above before writing anything — don't assume domain, published date, or canonical file.
4. Check `.github/workflows/` for an existing GH Pages config; add one if missing, matching HG25's `pages.yml`.
5. Create `.claude/launch.json` for the preview server.
6. Write `docs/index.html` using HG25 as the scaffold. Preserve the HTML structure, swap content and colors.
7. Add `docs/CNAME` and `docs/favicon.svg`.
8. If Turnfile has a repo-root image for OG, copy it to `docs/imgs/og.png` so the favicon/OG URLs resolve.
9. Start the preview server via Claude Preview (`mcp__Claude_Preview__preview_start name="docs"`).
10. Run the a11y scan:
    ```bash
    node /Users/snap/Git/skill-a11y-audit/a11y-audit/scripts/scan.js \
      --root /Users/snap/Git/turnfile \
      --urls http://127.0.0.1:4173/ \
      --output /tmp/turnfile-a11y-scan.json --summary
    ```
11. Fix violations until the scan is clean. Common fixes are enumerated in section 3 above.
12. Take screenshots at desktop + mobile to verify visually.
13. Commit + push when the user approves.

## Key files to reference from HG25

- `~/Git/hardguard25/docs/index.html` — primary template (head, structure, CSS, JS-free)
- `~/Git/hardguard25/docs/favicon.svg` — favicon pattern with baked-in bg
- `~/Git/hardguard25/docs/CNAME` — just the domain, one line
- `~/Git/hardguard25/.github/workflows/pages.yml` — GH Pages workflow
- `~/Git/hardguard25/.claude/launch.json` — preview server config

## Things I got wrong in this session that you should skip

- **First-time assumption that `index.html` in docs/ would be empty.** Turnfile has existing docs content — confirm publish strategy first.
- **Initial logo was too circular.** Looked like a no-smoking sign. For Turnfile, sketch the concept at 120px before committing; a font-glyph-like mark reads better than a bold geometric one in the nav.
- **Contrast on muted-text links.** Forgot to underline footer-meta links and had to fix in a second pass. Include footer links in the underline pass from the start.
- **Mobile charset overflow.** Tweaked letter-spacing three times. Compute the actual width first: `chars × (font_size × mono_ratio + letter_spacing_em × font_size)` and verify it fits the container minus 2× side padding.

## Final a11y state (reference target)

HardGuard25 home + `/generator/` both pass with:
- **0 violations**
- **39 passes** (home), **32 passes** (generator)
- **1 incomplete** each (decorative separator characters — not failures)

Target the same state for Turnfile.
