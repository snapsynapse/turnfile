# Legal Landscape Summary (Patent-Oriented, High-Level)

**Prepared:** 2026-02-08  
**Project:** `turnfile` (SNAP — Structured Negotiation of Autonomous Peers)  
**Purpose:** Briefing note for counsel before public launch.

> This document is not legal advice. It is a high-level technical landscape summary for attorney review.

---

## 1) Scope and method

This summary focuses on patent documents with claims adjacent to:

- multi-agent AI orchestration,
- human-in-the-loop governance,
- inter-agent messaging,
- auditable workflow/event logging.

Primary source used: Google Patents records (grants + published applications), checked on 2026-02-08.

### Limitations

This search has known coverage gaps that counsel should be aware of:

- **PCT international applications** that have not yet entered national phase are not indexed in Google Patents until publication
- **Non-English-language filings** — particularly CJK-jurisdiction patents (China, Japan, South Korea) where AI agent patent activity is high — were not systematically searched
- **Unpublished provisional applications** and **trade secrets** are inherently unsearchable and represent an unknown gap
- **Semantic search limitations** — keyword-based patent search may miss claims that describe similar mechanisms using different terminology

Counsel should determine whether a professional prior art search is warranted before relying on this summary for freedom-to-operate decisions.

---

## 2) Potentially similar patent families

The following documents appear materially adjacent to parts of this project's design space.

| Patent / Application | Status (as listed) | Why it matters |
|---|---|---|
| [US12061970B1](https://patents.google.com/patent/US12061970B1/en) | Active, granted (2024-08-13) | Covers hybrid orchestration of multiple ML/LLM agents with role specialization and orchestrated workflows. |
| [US20250252293A1](https://patents.google.com/patent/US20250252293A1/en) | Pending (published 2025-08-07) | Related family continuing multi-agent orchestration and system-level coordination patterns. |
| [US20250259042A1](https://patents.google.com/patent/US20250259042A1/en) | Pending (published 2025-08-14) | Describes a network of collaborative/negotiating agents for context-aware tasks. |
| [US12412138B1](https://patents.google.com/patent/US12412138B1/en) | Active, granted (2025-09-09) | Agentic orchestration with human-in-the-loop workflow control concepts. |
| [US12346713B1](https://patents.google.com/patent/US12346713B1/en) | Active, granted (2025-07-01) | Unified orchestration involving AI agents plus workflow automation/RPA patterns. |
| [US20250165890A1](https://patents.google.com/patent/US20250165890A1/en) | Pending (published 2025-05-22) | Multi-agent software-development workflow coordination concepts. |
| [US20250131044A1](https://patents.google.com/patent/US20250131044A1/en) | Pending (published 2025-04-24) | Human-in-the-loop orchestration and lineage/traceability concepts. |
| [US12475151B1](https://patents.google.com/patent/US12475151B1/en) | Active, granted (2025-11-18) | Fault-tolerant multi-agent operations using message pools and backup/shadow behaviors. |
| [US12386807B2](https://patents.google.com/patent/US12386807B2/en) | Active, granted (2025-08-26) | Adjacent audit-trail/event-ledger patterns relevant to governance claims. |

---

## 3) Risk themes vs this protocol

This project most likely overlaps at the **theme level** with claims around:

1. Multi-agent coordination and role assignment.
2. Human approval/escalation in automated workflows.
3. Structured message passing and event logging.
4. Reliability/fault-tolerance patterns for distributed agents.

Likely strongest claim-density area in the landscape:
- centralized orchestrator/control-plane architectures that direct subordinate agents.

---

## 4) Strong differentiation direction for this repo

The most defensible product direction appears to be:

1. **Protocol standard, not orchestrator software.**
2. **No shared runtime requirement** (agents are stateless and isolated).
3. **Human-readable markdown artifacts as canonical state** (WORKLOG/MAILBOX/charter), not opaque internal message buses.
4. **Consent-based participation + explicit handshake governance** rather than unilateral controller assignment.
5. **Human arbiter model with transparent decisions** (documented in append-only logs), not hidden policy engines.

In short: emphasize this project as an **open, auditable collaboration protocol** for heterogeneous agents, not an autonomous orchestration engine.

---

## 5) Practical guidance for counsel handoff

Suggested attorney tasks:

1. Perform claim-chart analysis against the listed patent families for:
   - mailbox/event semantics,
   - human approval/escalation flows,
   - lane ownership and handoff mechanics.
2. Validate freedom-to-operate assumptions for U.S. launch (and planned jurisdictions).
3. Advise on wording in public docs to maintain protocol/spec positioning and avoid control-plane implementation language.
4. Determine whether defensive publication should be expanded for core protocol invariants.

---

## 6) Draft positioning statement (lawyer-reviewable)

Turnfile (`turnfile`) is an open governance and communications specification for asynchronous human-plus-LLM collaboration. It requires only human-readable markdown files, append-only audit logs, and explicit participant consent. It does not require a centralized runtime orchestrator, proprietary message bus, or hidden control plane.
