## Summary

What this changes and why.

## Type

- [ ] Protocol / PRD change (admitted via the PRD-006 A1 loop)
- [ ] Tool / validator
- [ ] Documentation
- [ ] Tooling / CI / hygiene

## Checklist

- [ ] Validators pass (`turnfile-lint`, `validate-mailbox-invariants`, `validate-prd-promotion`, `npm run -s validate:skills`)
- [ ] `npm test` (PRD eval suites) green
- [ ] Docs / PRD status index updated if behavior or surfaces changed
- [ ] `CHANGELOG.md` updated
- [ ] Version + dependent surfaces propagated if a published surface changed (see `RELEASE_CHECKLIST.md`)
