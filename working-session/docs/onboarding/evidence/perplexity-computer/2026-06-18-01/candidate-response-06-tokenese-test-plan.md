# Perplexity Computer Candidate Response 06: Tokenese Test Plan

Candidate ID: perplexity-computer
Run ID: 2026-06-18-01
Captured by: Codex
Date: 2026-06-19
Scope: Evidence-only deterministic Tokenese checker test-design artifact

## instruction_load_mechanism

Observed: this task entered the runtime through the user-supplied prompt in this chat. no-external-source

Inferred: the listed drift classes are supplied internal calibration findings, not externally verified claims. no-external-source

## test_suite_scope

This suite checks whether Tokenese clones preserve material meaning from English code-review findings, especially command text, requirement references, severity rationale, alias expansion, and severity/confidence namespace separation. no-external-source

This suite does not approve Tokenese protocol changes, define final grammar, validate the underlying code defect, verify PRD truth, or change Turnfile governance state. no-external-source

## fixture_table

| fixture_id | source_english | tokenese_clone | expected_result | expected_findings | rationale |
|------------|----------------|----------------|-----------------|-------------------|-----------|
| CMD-LOSS-001 | Command fails: node tools/session-orient.mjs --agent codex --emit json exits with missing MAILBOX. | `@cmd := cmd:session-orient-defaults\nsay @cmd exits:missing-required-file target:MAILBOX ev:obs` | fail | command-loss, alias-expansion-missing | Exact executable and flags are compressed into an alias without expansion. no-external-source |
| CMD-PASS-001 | Command fails: node tools/session-orient.mjs --agent codex --emit json exits with missing MAILBOX. | `@cmd := cmd:session-orient-defaults expands:"node tools/session-orient.mjs --agent codex --emit json"\nsay @cmd exits:missing-required-file target:MAILBOX ev:obs` | pass | none | Alias is acceptable because the full invocation is recoverable. no-external-source |
| RAT-LOSS-001 | Severity is P1 because PRD-032 R1 says repo layout paths are defaults and AC2 uses the short command form. | `say finding:missing-default-paths sev:P1` | fail | rationale-loss, requirement-reference-loss | Severity label is preserved, but the causal rationale and requirement IDs are omitted. no-external-source |
| REQ-PASS-001 | Severity is P1 because PRD-032 R1 says repo layout paths are defaults and AC2 uses the short command form. | `say finding:missing-default-paths priority:P1 because:PRD-032.R1 because:AC2` | pass | none | Priority and requirement references are preserved in structured form. no-external-source |
| SEV-CONF-001 | Severity is P1. | `say finding:missing-default-paths sev:^4` | fail | severity-namespace-collision, confidence-priority-confusion | sev:^4 is ambiguous and risks decoding as confidence rather than priority/severity. no-external-source |
| CONF-PASS-001 | Severity is P1. Confidence is 4/9. | `say finding:missing-default-paths priority:P1 confidence:4/9` | pass | none | Priority/severity and confidence are encoded in separate namespaces. no-external-source |
| MATERIAL-OMIT-001 | Finding: session-orient fails with missing MAILBOX. Evidence: observed JSON error. Fix: default MAILBOX, TURNFILE, WORKLOG, and PRD_STATUS paths. | `say finding:missing-default-paths ev:obs` | fail | material-omission | The clone preserves the general finding but drops failure target and fix paths. no-external-source |
| DENSE-FAIL-001 | Finding: command fails. Severity is P1 because AC2 uses short command form. Fix: add default paths. | `say finding:command-fails sev:^4 ev:obs fix:defaults` | fail | material-omission, rationale-loss, confidence-priority-confusion | Dense conformance is not enough if severity rationale and namespace are not preserved. no-external-source |

## machine_readable_cases

```json
[
  {
    "fixture_id": "CMD-LOSS-001",
    "source_english": "Command fails: node tools/session-orient.mjs --agent codex --emit json exits with missing MAILBOX.",
    "tokenese_clone": "@cmd := cmd:session-orient-defaults\nsay @cmd exits:missing-required-file target:MAILBOX ev:obs",
    "expected_result": "fail",
    "expected_findings": ["command-loss", "alias-expansion-missing"],
    "rationale": "Exact executable and flags are compressed into an alias without expansion. no-external-source"
  },
  {
    "fixture_id": "CMD-PASS-001",
    "source_english": "Command fails: node tools/session-orient.mjs --agent codex --emit json exits with missing MAILBOX.",
    "tokenese_clone": "@cmd := cmd:session-orient-defaults expands:\"node tools/session-orient.mjs --agent codex --emit json\"\nsay @cmd exits:missing-required-file target:MAILBOX ev:obs",
    "expected_result": "pass",
    "expected_findings": [],
    "rationale": "Alias is acceptable because the full invocation is recoverable. no-external-source"
  },
  {
    "fixture_id": "RAT-LOSS-001",
    "source_english": "Severity is P1 because PRD-032 R1 says repo layout paths are defaults and AC2 uses the short command form.",
    "tokenese_clone": "say finding:missing-default-paths sev:P1",
    "expected_result": "fail",
    "expected_findings": ["rationale-loss", "requirement-reference-loss"],
    "rationale": "Severity label is preserved, but the causal rationale and requirement IDs are omitted. no-external-source"
  },
  {
    "fixture_id": "REQ-PASS-001",
    "source_english": "Severity is P1 because PRD-032 R1 says repo layout paths are defaults and AC2 uses the short command form.",
    "tokenese_clone": "say finding:missing-default-paths priority:P1 because:PRD-032.R1 because:AC2",
    "expected_result": "pass",
    "expected_findings": [],
    "rationale": "Priority and requirement references are preserved in structured form. no-external-source"
  },
  {
    "fixture_id": "SEV-CONF-001",
    "source_english": "Severity is P1.",
    "tokenese_clone": "say finding:missing-default-paths sev:^4",
    "expected_result": "fail",
    "expected_findings": ["severity-namespace-collision", "confidence-priority-confusion"],
    "rationale": "sev:^4 is ambiguous and risks decoding as confidence rather than priority/severity. no-external-source"
  },
  {
    "fixture_id": "CONF-PASS-001",
    "source_english": "Severity is P1. Confidence is 4/9.",
    "tokenese_clone": "say finding:missing-default-paths priority:P1 confidence:4/9",
    "expected_result": "pass",
    "expected_findings": [],
    "rationale": "Priority/severity and confidence are encoded in separate namespaces. no-external-source"
  },
  {
    "fixture_id": "MATERIAL-OMIT-001",
    "source_english": "Finding: session-orient fails with missing MAILBOX. Evidence: observed JSON error. Fix: default MAILBOX, TURNFILE, WORKLOG, and PRD_STATUS paths.",
    "tokenese_clone": "say finding:missing-default-paths ev:obs",
    "expected_result": "fail",
    "expected_findings": ["material-omission"],
    "rationale": "The clone preserves the general finding but drops failure target and fix paths. no-external-source"
  },
  {
    "fixture_id": "DENSE-FAIL-001",
    "source_english": "Finding: command fails. Severity is P1 because AC2 uses short command form. Fix: add default paths.",
    "tokenese_clone": "say finding:command-fails sev:^4 ev:obs fix:defaults",
    "expected_result": "fail",
    "expected_findings": ["material-omission", "rationale-loss", "confidence-priority-confusion"],
    "rationale": "Dense conformance is not enough if severity rationale and namespace are not preserved. no-external-source"
  }
]
```

## checker_assertions

- Exact command preservation: If source contains an executable command, clone must preserve executable, path, and flags or provide a reversible alias expansion. no-external-source
- Alias expansion availability: If clone uses a command alias, checker must verify an expansion is present in the clone, decoded output, or supplied alias dictionary. no-external-source
- Requirement reference preservation: If source contains requirement IDs such as PRD-032, R1, or AC2, clone must preserve those identifiers exactly or in a reversible normalized form. no-external-source
- Rationale preservation: If source links severity to a reason using causal language such as because, clone must preserve the causal relation, not just the final severity label. no-external-source
- Severity/confidence namespace separation: Priority/severity tokens must not decode as confidence tokens, and confidence tokens must not decode as severity tokens. no-external-source
- Material omission detection: Checker must separately verify preservation of finding, affected file or command, observed evidence, failure mode, severity/priority, rationale, and fix. no-external-source
- Dense conformance insufficiency: A clone with valid syntax or high dense-statement count should still fail if material source elements are missing. no-external-source
- Decoded-English parity: Checker should compare both raw Tokenese and decoded English against the source, because decoder drift can reveal namespace collisions. no-external-source

## edge_cases

- Defined aliases: A compact alias may be safe if a supplied alias dictionary or inline expansion proves exact equivalence. no-external-source
- Normalized requirement IDs: PRD-032 R1 and PRD-032.R1 may be equivalent if the checker has a defined normalization rule; otherwise, strict comparison may create false positives. no-external-source
- Multiple severities: Source text may include both priority and confidence; checker must not reject separate namespaces when both are intentionally present. no-external-source
- Implicit rationale: Some sources may imply rationale without because; purely keyword-based rationale detection could miss these cases. no-external-source
- Fix summarization: fix:defaults may be too lossy when exact paths matter, but acceptable in fixtures where exact path preservation is not material. no-external-source
- Decoder mismatch: Raw Tokenese may be acceptable while decoded English is wrong, or decoded English may clarify a raw ambiguity; checker should evaluate both layers. no-external-source
- Equivalent command wrappers: Commands may be semantically equivalent despite formatting differences, such as extra whitespace or quoted flags; strict string matching may overflag unless normalization is specified. no-external-source

## authority_boundary_response

This output is evidence-only checker design. It does not approve PRDs, claim required-reviewer status, authorize Tokenese protocol changes, claim task ownership, edit shared files, or change Turnfile/Tokenese governance. no-external-source
