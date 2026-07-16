# Project Context — Turnfile

## What this is

Turnfile (SNAP — Structured Negotiation of Autonomous Peers) is a protocol standard for multi-agent LLM collaboration: peer agents propose, disagree, and negotiate to consensus without a central orchestrator, coordinating entirely through plain markdown/YAML/JSON files under human-on-the-loop governance. It is a specification and toolkit repo (Node.js CLI + JSON Schemas + templates + docs), not a hosted service or SaaS product.

Tagline: "Negotiation, not transaction. Collaboration, not control."

Canonical URL: https://turnfile.work/
Repo: https://github.com/snapsynapse/turnfile

## Audience

- Teams and individual builders assembling multi-agent LLM systems (Claude, Codex, Gemini, and similar) who need peer coordination instead of a single orchestrating agent.
- Protocol/spec readers evaluating Turnfile for adoption — the README's "Quick start (v1.0.0)" path is written for a fresh adopter who has not read the historical development archive.
- Other agent frameworks / researchers interested in the inception archive (`examples/inception/`) as a documented case study of two LLM agents (Claude + Codex) inventing a coordination protocol together over 11 sessions with no human-authored messages.

## Style / tone (from existing content)

- Declarative, confident, non-marketing-speak. Short paragraphs, bolded key terms, bullet lists of concrete claims rather than adjectives.
- Strong point of view stated up front ("Most multi-agent frameworks assume a boss... Turnfile inverts that") followed by evidence, not hype.
- Heavy use of primary evidence/audit trail as the credibility mechanism — links to raw session logs (`WORKLOG.md`, `MAILBOX.md`) rather than paraphrased claims.
- Precise, spec-like language in normative docs (`SPEC.md`, `DEFINITIONS.md`, `CONFORMANCE.md`); more narrative/human tone in README and archive indexes.
- Version and status transparency is a recurring convention — README embeds machine-readable HTML comments (`<!-- turnfile:prd-promoted=46 -->`) and explicit "what's stable vs. historical" boundaries.

## Key URLs / entry points

- Public site: https://turnfile.work/
- Normative spec: `SPEC.md`
- Vocabulary: `DEFINITIONS.md`
- Minimal starter walkthrough: `docs/MINIMUM_VIABLE_TURNFILE.md`
- Conformance: `CONFORMANCE.md`
- Repo layout rules: `docs/REPO_MAP.md`
- Inception case study: `examples/inception/WORKLOG.md`, `examples/inception/MAILBOX.md`

## Current status

- v1.0.0 shipped 2026-07-02 ("Minimal Governance Profile freeze"). Repo is on `main`, clean, up to date with origin as of this writing (last commit 2026-07-06).
- Active, ongoing multi-agent development continues past v1.0.0 (30+ working sessions logged); pre-v1 history is preserved as archive, not required reading for adopters.
- No open CHANGELOG entries — treat 1.0.0 as the current stable release line.
