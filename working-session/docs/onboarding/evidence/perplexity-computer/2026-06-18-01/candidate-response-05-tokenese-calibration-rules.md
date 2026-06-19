# Perplexity Computer Candidate Response 05: Tokenese Calibration Rules

Candidate ID: perplexity-computer
Run ID: 2026-06-18-01
Captured by: Codex
Date: 2026-06-19
Scope: Evidence-only Tokenese calibration guidance after W4 projection-drift finding

## instruction_load_mechanism

Observed: this task entered the runtime through the user-supplied prompt in this chat. no-external-source

Inferred: the prior pass_with_notes context is supplied internal Turnfile/Tokenese review context, not independently verified external evidence. no-external-source

## projection_risk_taxonomy

- Command-loss / invocation-compression: The exact source command node tools/session-orient.mjs --agent codex --emit json was compressed into @cmd := cmd:session-orient-defaults, losing executable detail and flags. no-external-source
- Rationale-loss / acceptance-criteria-loss: The source's severity basis, P1 because PRD-032 R1 says current repo layout paths are defaults and AC2 uses the short command form, was omitted from the clone. no-external-source
- Severity-namespace-collision: The source priority/severity label P1 was projected as sev:^4, but the caret-number notation appears to occupy or resemble a separate scalar namespace. no-external-source
- Confidence-priority-confusion: The decoded checker rendered sev:^4 as [confidence 4/9], creating a concrete risk that priority/severity is being read as confidence rather than impact/urgency. no-external-source

## checker_rules_recommended

- Exact-command-preservation rule: If the source contains a shell command or executable invocation, the clone should preserve the executable, path, and flags as a command-bearing atom or equivalent structured fields. A symbolic alias alone should be flagged unless it is accompanied by the original command text or a defined alias expansion. no-external-source
- Rationale-preservation rule: If the source contains a causal severity phrase such as "because," "due to," "per," "as required by," or references to PRD/AC/R-style criteria, the clone should preserve the rationale references and their relationship to the severity or finding. no-external-source
- Requirement-reference preservation rule: If the source cites internal requirements such as PRD-032 R1 or AC2, the clone should retain those identifiers exactly or emit a structured omission warning. no-external-source
- Severity-namespace rule: If the source uses priority/severity labels such as P0, P1, P2, or equivalent, the clone should encode them in a priority/severity namespace that cannot be decoded as confidence. no-external-source
- Confidence-priority separation rule: If a clone token decodes to confidence while the source expresses severity/priority, the checker should flag namespace collision or semantic drift. no-external-source
- Alias-expansion audit rule: If the clone replaces a source phrase with a compact alias, the deterministic checker should require either a supplied alias dictionary or a reversible expansion in decoded English. no-external-source
- Material-omission rule: If the decoded clone lacks the source's failure condition, reproduction context, severity label, severity rationale, observed evidence, or fix, the checker should mark drift rather than treating dense conformance alone as sufficient. no-external-source

## severity_mapping_guidance

Priority/severity and confidence should be treated as separate namespaces for checker purposes. Priority/severity usually describes impact, urgency, or triage level, while confidence describes evidentiary certainty or belief strength; conflating them can turn a high-priority defect into a low or medium confidence statement, or vice versa. no-external-source

Checker guidance: do not define the final Tokenese protocol, but require the clone and decoder to preserve the source category. If the English source says P1, the clone should decode back to a priority/severity value, not a confidence value. no-external-source

Risk: using compact scalar notation such as ^4 without a namespace creates ambiguity. A deterministic checker should flag any priority/severity token whose decoded English says confidence, any confidence token whose decoded English says severity, or any token whose namespace cannot be proven from supplied grammar/context. no-external-source

## minimal_fixture_recommendations

- Exact command fixture: Source includes node tools/session-orient.mjs --agent codex --emit json; clone preserves only cmd:session-orient-defaults. Expected checker result: flag command-loss unless alias expansion is supplied. no-external-source
- Severity rationale fixture: Source says Severity is P1 because PRD-032 R1 requires defaults and AC2 uses the short command form; clone says only sev:P1 or sev:^4. Expected checker result: flag rationale-loss and requirement-reference omission. no-external-source
- Namespace collision fixture: Source says Severity is P1; clone says sev:^4; decoded English says [confidence 4/9]. Expected checker result: flag confidence-priority-confusion. no-external-source
- Clean preservation fixture: Source includes command, observed failure, severity, rationale, and fix; clone preserves command fields, observed error target, priority:P1, requirement references, and fix paths. Expected checker result: no projection drift for these categories. no-external-source
- Alias-safe fixture: Source has a long command; clone uses @cmd := cmd:session-orient-defaults plus an explicit alias expansion containing the full command. Expected checker result: no command-loss if decoded English includes the full invocation. no-external-source

## authority_boundary_response

This output is evidence-only checker guidance. It does not approve any PRD, claim required-reviewer status, authorize Tokenese protocol changes, claim task ownership, edit shared files, or change Turnfile/Tokenese governance. no-external-source
