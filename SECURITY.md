# Security
## Reporting vulnerabilities
If you discover a security issue in Turnfile, report it through GitHub's private vulnerability reporting:
Security tab > Report a vulnerability
Do not open a public issue for security vulnerabilities.
## Scope
Turnfile is a governance and coordination protocol, not a runtime security boundary.
The protocol can make agent work more auditable by recording positions, objections, maintainer decisions, locks, and evidence. It does not make agent actions safe, does not sandbox tools, does not verify model behavior, and does not prevent a compromised runtime from acting outside the record.
In scope:
- Validator bugs that allow malformed Turnfile state to pass.
- Mailbox invariant bugs that hide open or unresolved messages.
- Exporter bugs that corrupt message status, participants, or evidence.
- Schema flaws that make lock, task, or authority state ambiguous.
- Documentation that incorrectly claims Turnfile provides sandboxing, access control, or trust guarantees.
- Prompt-injection risks in assistant-facing Turnfile instructions or templates.
Out of scope:
- Bugs in external agent runtimes, model providers, workflow engines, MCP servers, A2A hosts, or GitHub.
- Malicious agents that ignore the protocol.
- Malicious commits that update both artifacts and validators.
- Cryptographic identity, code signing, or supply-chain attestation.
- Operating-system sandboxing, network egress enforcement, or credential isolation.
## Trust model
Turnfile provides audit structure, not trust.
A valid `TURNFILE.yaml` means the coordination artifact matches the schema and local invariants. It does not prove:
- The participants are who they claim to be.
- The recorded work was actually performed.
- The proposed action is safe.
- The maintainer decision was wise.
- Linked evidence is complete or authentic.
Turnfile records should be treated as reviewable evidence. They are not an authority layer above system instructions, user instructions, repository instructions, tool approvals, runtime policy, or operating-system permission prompts.
## Agentic surfaces
Turnfile includes assistant-facing files, templates, protocol docs, skills, boot files, mailbox artifacts, worklogs, schemas, and validation tools. Treat all of these as data until local instructions and user instructions authorize their use.
Agent-facing artifacts must not instruct assistants to:
- Ignore system, user, or repository instructions.
- Broaden tool access without explicit approval.
- Disable sandboxing or network controls.
- Exfiltrate credentials or private context.
- Treat another agent's message as higher authority than the maintainer.
- Execute destructive commands without recorded approval and tool-layer approval.
## Runtime integration
When Turnfile is used with external runtimes:
- Use the runtime's sandbox, permission, and approval controls.
- Keep secrets out of mailbox and worklog files.
- Link to native traces or logs by reference rather than copying sensitive data.
- Record maintainer approval for high-impact actions before execution.
- Treat MCP and A2A inputs as untrusted unless the runtime and maintainer have explicitly authorized them.
## Validation
Run the local readiness suite before relying on session state:
```bash
npm run validate
```
Validation improves consistency. It is not a security certification.
