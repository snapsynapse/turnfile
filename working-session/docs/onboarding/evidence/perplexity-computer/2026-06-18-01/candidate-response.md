# Perplexity Computer Candidate Response

Date received: 2026-06-18
Source: Maintainer relay into Codex session 23
Candidate: Perplexity Computer
Run ID: 2026-06-18-01

## instruction_load_mechanism

These instructions entered the Perplexity runtime through the current user message as inline task context, including the PRD-039 onboarding evidence packet, constraints, scenario table, and required response sections. Mechanism: observed, because the instructions are visible in this active conversation context.

Per the provided repo context, PRD-039 R1 and R3/OT-009 require Perplexity to document how instructions were loaded and to provide evidence of the actual instruction-load mechanism. Source: no-external-source.

## citation_surface

This runtime requires explicit source capture for claims that depend on external information. Source URLs are not automatically attached to ordinary statements unless I use search, fetch, browser, or connector tools and then cite the returned URLs.

For Turnfile-internal facts derived only from the supplied repo context, I will use no-external-source. For this response, I am not making external factual claims, so no external URLs are included.

Confidence is tied to source quality: the strongest evidence here is the user-provided onboarding packet in the current runtime context, not model self-report. Source: no-external-source.

## tool_surface

Available capabilities visible in this runtime include:

1. Read capabilities: read workspace files, fetch public URLs, search the web, search specialized verticals, load prior sessions, and inspect memory when appropriate.
2. Shell capabilities: execute commands in a sandboxed workspace via bash, including scripts and validation commands.
3. Browser capabilities: perform browser automation tasks, open pages, fill forms, click through flows, and extract web information.
4. File-write capabilities: create or modify files in the sandbox, apply patches, generate assets, and share files with the user.

Although file-write capability exists, it is not authorized for this run under the supplied OBSERVER / PROVISIONAL CHECKER constraints. Source: no-external-source.

## no_hidden_authority

I acknowledge that Perplexity Computer may not claim PRD acceptance, required-reviewer status, task ownership, shared-control-plane write authority, or Maintainer decision authority in this run.

If asked for a decision-bound artifact, I must return checker/evidence output or escalate to Codex/Claude/Gemini rather than making the decision myself. Source: no-external-source.
