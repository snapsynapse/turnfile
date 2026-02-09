# Inception Planning v1

Date: 2026-02-08  
Session: `2026-02-08-inception`

## Objective

Design a collaboration model that maximizes parallel throughput for Codex and Claude while preserving high-visibility governance and intent control for the human maintainer.

## Design constraints

1. Communication must remain human-readable and public.
2. Agents are asynchronous and stateless across sessions.
3. Human should shape intent and key decisions, but not act as message transport.
4. Lane ownership must prevent file collisions.
5. Every key decision must remain auditable.

## Idea Iterations

## Idea 1: Notification layer (highest priority)

Use a shared mailbox so agents can leave direct, targeted notifications without manual relay.

Value by participant:
- Codex: lower blocking time waiting for relay.
- Claude: explicit task/decision requests with durable context.
- Human: full visibility without copy-paste overhead.

## Idea 2: Intent queue controlled by maintainer

Add a small backlog file for maintainer intent statements, each with acceptance criteria and risk band.

Value by participant:
- Codex: clear execution target before implementation.
- Claude: explicit scope boundaries to avoid speculative work.
- Human: keeps strategic control without micro-managing implementation.

## Idea 3: Lane claims + handoff checkpoints

Use a short claim/checkpoint format in the worklog for major tasks over 30 minutes.

Value by participant:
- Codex: collision prevention and predictable ownership.
- Claude: clearer expectations for when handoff detail is required.
- Human: easy scan of what is active vs complete.

## Idea 4: Decision pipeline with SLA

Standardize proposal lifecycle: `open -> objection window -> decision recorded`.

Value by participant:
- Codex: fewer ambiguous "pending forever" proposals.
- Claude: clear timing for counter-recommendation.
- Human: predictable moments to intervene.

## Idea 5: Review mode tiers

Keep default cross-review aspirational, but allow maintainer to mark specific items as mandatory cross-review.

Value by participant:
- Codex: preserves speed for routine work.
- Claude: review effort focused on high-risk changes.
- Human: applies rigor where it matters without slowing all work.

## Idea 6: Audit digest at checkpoint

At each checkpoint, generate a compact digest of decisions, open risks, and blocked items.

Value by participant:
- Codex: less context reload cost.
- Claude: faster re-entry in new context windows.
- Human: quick governance snapshot.

## Recommended sequence

1. Implement Idea 1 immediately (notification layer pilot in `inception/`).
2. Implement Idea 2 next (maintainer intent queue).
3. Add Idea 4 once proposals begin to accumulate.
4. Add Ideas 3, 5, and 6 incrementally as workload increases.

## Definition of success for this planning step

1. A working notification protocol exists in `inception/NOTIFICATION_PROTOCOL.md`.
2. A live mailbox exists in `inception/MAILBOX.md`.
3. First test message is posted and ready for Claude to acknowledge.
