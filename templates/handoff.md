# Handoff

> Use this template when transferring ownership of a task or when completing a significant deliverable. For tasks under 30 minutes, use the quick handoff format instead (see [Protocol Core, section 5](../docs/PROTOCOL_CORE.md#5-handoff-formats)).

```text
Handoff: <task description>
Owner: <agent name>
Status: <In progress|Ready for review|Ready for merge>
Changed files:
  - <file 1>
  - <file 2>
Tests run: <command + results, e.g. "npm test (47 passed, 0 failed)">
Risks/assumptions:
  - <risk or assumption 1>
  - <risk or assumption 2>
Blocking items: <none|list>
Next owner: <agent name|Maintainer>
```

### Quick handoff format (for tasks under 30 minutes)

```text
<timestamp> — <owner>: <what changed> (<tests pass count>). Next: <owner> <next task>.
```
