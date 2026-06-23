#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const CLOSED_STATES = new Set(["read", "acknowledged", "actioned", "closed"]);
const SNAPSHOT_RECIPIENTS = ["Codex", "Claude", "Maintainer"];

function usage() {
  return "usage: node tools/aggregate-coordination.mjs --shards <dir>|--input <dir> [--emit json|mailbox-md|mailbox-json|arbitration-json|task-json] [--rev <N>]";
}

function parseArgs(argv) {
  const args = { emit: "json", shards: null, rev: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--shards" || arg === "--input") {
      args.shards = argv[++i] || null;
    } else if (arg === "--emit") {
      args.emit = argv[++i] || null;
    } else if (arg === "--rev") {
      const raw = argv[++i];
      args.rev = raw === undefined ? null : Number(raw);
    } else if (arg === "-h" || arg === "--help") {
      console.log(usage());
      process.exit(0);
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  if (!args.shards) throw new Error("--shards is required");
  if (!["json", "mailbox-md", "mailbox-json", "arbitration-json", "task-json"].includes(args.emit)) {
    throw new Error(`unsupported --emit mode: ${args.emit}`);
  }
  if (args.rev !== null && !Number.isInteger(args.rev)) throw new Error("--rev must be an integer");
  return args;
}

function readJsonl(file, conflicts) {
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, "utf8");
  const rows = [];
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    try {
      rows.push(JSON.parse(line));
    } catch (error) {
      conflicts.push({
        kind: "parse-error",
        detail: `${file}:${index + 1}: ${error.message}`,
      });
    }
  }
  return rows;
}

function sortedShardAgents(shardsDir) {
  return fs
    .readdirSync(shardsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function shardRoot(inputDir) {
  const agentsDir = path.join(inputDir, "agents");
  return fs.existsSync(agentsDir) && fs.statSync(agentsDir).isDirectory() ? agentsDir : inputDir;
}

function signalNamespace(id) {
  const match = /^SIG-([A-Za-z0-9_-]+)-(\d{4,})$/.exec(String(id || ""));
  if (!match) return null;
  return { owner: match[1], seq: Number(match[2]) };
}

function messageNamespace(id) {
  const match = /^MSG-([A-Za-z0-9_-]+)-(\d{8})-(\d{4,})$/.exec(String(id || ""));
  if (!match) return null;
  return { owner: match[1], date: match[2], seq: Number(match[3]) };
}

function ensureNamespace(namespaces, agent) {
  if (!namespaces[agent]) namespaces[agent] = { max_sig: 0, max_msg: {} };
  return namespaces[agent];
}

function recordDuplicate(id, seen, conflicts, kind) {
  if (!id) return;
  if (seen.has(id)) {
    conflicts.push({
      kind: "duplicate-id",
      detail: `${kind} id ${id} appears in both ${seen.get(id)} and current shard`,
    });
  } else {
    seen.set(id, kind);
  }
}

function baseCompare(a, b) {
  const ats = String(a.ts || "");
  const bts = String(b.ts || "");
  if (ats !== bts) return ats < bts ? -1 : 1;
  const aid = String(a.id || "");
  const bid = String(b.id || "");
  if (aid !== bid) return aid < bid ? -1 : 1;
  return 0;
}

function causalOrder(events) {
  const nodes = events.slice().sort(baseCompare);
  const byId = new Map(nodes.map((event) => [event.id, event]));
  const indegree = new Map(nodes.map((event) => [event.id, 0]));
  const outgoing = new Map(nodes.map((event) => [event.id, []]));

  for (const event of nodes) {
    for (const dep of Array.isArray(event.deps) ? event.deps : []) {
      if (!byId.has(dep) || dep === event.id) continue;
      indegree.set(event.id, indegree.get(event.id) + 1);
      outgoing.get(dep).push(event.id);
    }
  }

  let ready = nodes.filter((event) => indegree.get(event.id) === 0).sort(baseCompare);
  const ordered = [];
  const emitted = new Set();

  while (ready.length) {
    const event = ready.shift();
    if (emitted.has(event.id)) continue;
    emitted.add(event.id);
    ordered.push(event);

    const nextIds = outgoing.get(event.id) || [];
    for (const nextId of nextIds) {
      indegree.set(nextId, indegree.get(nextId) - 1);
      if (indegree.get(nextId) === 0) ready.push(byId.get(nextId));
    }
    ready.sort(baseCompare);
  }

  const remainder = nodes.filter((event) => !emitted.has(event.id)).sort(baseCompare);
  return ordered.concat(remainder);
}

function causalOrderWithCycles(events) {
  const nodes = events.slice().sort(baseCompare);
  const byId = new Map(nodes.map((event) => [event.id, event]));
  const indegree = new Map(nodes.map((event) => [event.id, 0]));
  const outgoing = new Map(nodes.map((event) => [event.id, []]));

  for (const event of nodes) {
    for (const dep of Array.isArray(event.deps) ? event.deps : []) {
      if (!byId.has(dep) || dep === event.id) continue;
      indegree.set(event.id, indegree.get(event.id) + 1);
      outgoing.get(dep).push(event.id);
    }
  }

  let ready = nodes.filter((event) => indegree.get(event.id) === 0).sort(baseCompare);
  const ordered = [];
  const emitted = new Set();

  while (ready.length) {
    const event = ready.shift();
    if (emitted.has(event.id)) continue;
    emitted.add(event.id);
    ordered.push(event);

    for (const nextId of outgoing.get(event.id) || []) {
      indegree.set(nextId, indegree.get(nextId) - 1);
      if (indegree.get(nextId) === 0) ready.push(byId.get(nextId));
    }
    ready.sort(baseCompare);
  }

  const remainder = nodes.filter((event) => !emitted.has(event.id)).sort(baseCompare);
  return { ordered: ordered.concat(remainder), cycleIds: remainder.map((event) => event.id) };
}

function parseScalar(value) {
  const trimmed = String(value || "").trim();
  if (trimmed === "null") return null;
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function readFlatYaml(file, conflicts) {
  if (!fs.existsSync(file)) return null;
  const out = {};
  const text = fs.readFileSync(file, "utf8");
  for (const [index, raw] of text.split(/\r?\n/).entries()) {
    const line = raw.replace(/\s+#.*$/, "");
    if (!line.trim()) continue;
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!match) {
      conflicts.push({ kind: "parse-error", detail: `${file}:${index + 1}: unsupported YAML line` });
      continue;
    }
    out[match[1]] = parseScalar(match[2]);
  }
  return out;
}

function latestReadStates(readStates) {
  const latest = new Map();
  for (const event of readStates) {
    const reader = String(event.reader || "").toLowerCase();
    const msgId = event.msg_id;
    if (!reader || !msgId) continue;
    const key = `${reader}\u0000${msgId}`;
    const prior = latest.get(key);
    if (!prior || String(event.ts || "") >= String(prior.ts || "")) latest.set(key, event);
  }
  return latest;
}

function attachReadState(messages, readStates) {
  const byMessage = new Map();
  for (const event of latestReadStates(readStates).values()) {
    if (!byMessage.has(event.msg_id)) byMessage.set(event.msg_id, {});
    byMessage.get(event.msg_id)[String(event.reader).toLowerCase()] = event.state;
  }
  return messages.map((message) => ({
    ...message,
    read_by: byMessage.get(message.id) || {},
  }));
}

function isAddressedTo(message, recipient) {
  const to = String(message.to || "").toLowerCase();
  const from = String(message.from || "").toLowerCase();
  const target = recipient.toLowerCase();
  return to === target || (to === "all" && from !== target);
}

function deriveSnapshot(messages) {
  const snapshot = {};
  const byAge = messages.slice().sort(baseCompare);
  for (const recipient of SNAPSHOT_RECIPIENTS) {
    const key = recipient.toLowerCase();
    const unread = byAge.filter((message) => {
      if (!isAddressedTo(message, key)) return false;
      return !CLOSED_STATES.has(message.read_by?.[key]);
    });
    snapshot[recipient] = {
      unread: unread.length,
      oldest_unread: unread[0]?.id || "none",
    };
  }
  return snapshot;
}

function aggregate(shardsDir) {
  const agents = sortedShardAgents(shardsDir);
  const signals = [];
  const outbox = [];
  const readStates = [];
  const conflicts = [];
  const namespaces = {};
  const seenIds = new Map();

  for (const agent of agents) {
    const ns = ensureNamespace(namespaces, agent);
    const dir = path.join(shardsDir, agent);

    for (const event of readJsonl(path.join(dir, "signals.jsonl"), conflicts)) {
      const parsed = signalNamespace(event.id);
      if (!parsed) {
        conflicts.push({ kind: "namespace-violation", detail: `${agent} signal id ${event.id} is malformed` });
      } else {
        if (parsed.owner !== agent) {
          conflicts.push({
            kind: "namespace-violation",
            detail: `${agent} shard contains signal id ${event.id} owned by ${parsed.owner}`,
          });
        }
        ns.max_sig = Math.max(ns.max_sig, parsed.seq);
      }
      recordDuplicate(event.id, seenIds, conflicts, "signal");
      signals.push(event);
    }

    for (const event of readJsonl(path.join(dir, "outbox.jsonl"), conflicts)) {
      const parsed = messageNamespace(event.id);
      if (!parsed) {
        conflicts.push({ kind: "namespace-violation", detail: `${agent} message id ${event.id} is malformed` });
      } else {
        if (parsed.owner !== agent) {
          conflicts.push({
            kind: "namespace-violation",
            detail: `${agent} shard contains message id ${event.id} owned by ${parsed.owner}`,
          });
        }
        ns.max_msg[parsed.date] = Math.max(ns.max_msg[parsed.date] || 0, parsed.seq);
      }
      recordDuplicate(event.id, seenIds, conflicts, "message");
      outbox.push(event);
    }

    readStates.push(...readJsonl(path.join(dir, "read-state.jsonl"), conflicts));
  }

  const messages = causalOrder(attachReadState(outbox, readStates));
  return {
    agents,
    signals: causalOrder(signals),
    messages,
    snapshot: deriveSnapshot(messages),
    namespaces,
    conflicts: conflicts.sort((a, b) => {
      const ak = `${a.kind}\u0000${a.detail}`;
      const bk = `${b.kind}\u0000${b.detail}`;
      return ak < bk ? -1 : ak > bk ? 1 : 0;
    }),
  };
}

function readArbitrationEvents(shardsDir) {
  const conflicts = [];
  const events = [];
  for (const agent of sortedShardAgents(shardsDir)) {
    const file = path.join(shardsDir, agent, "arbitration.jsonl");
    for (const event of readJsonl(file, conflicts)) events.push(event);
  }
  return { events: causalOrder(events), conflicts };
}

function resourceKey(event) {
  return event?.resource?.id || "";
}

function ensureResource(state, id) {
  if (!state.resources[id]) {
    state.resources[id] = {
      holder: null,
      turn_ref: null,
      state: "idle",
      expires_after_rev: null,
      queue: [],
    };
  }
  return state.resources[id];
}

function removeFromQueue(resource, turnRef) {
  resource.queue = resource.queue.filter((queued) => queued !== turnRef);
}

function isReleaseActor(event, holder) {
  return event.actor === holder || event.actor === "router" || event.actor === "maintainer";
}

function applyArbitrationEvent(state, event, currentRev) {
  const id = resourceKey(event);
  const resource = id ? ensureResource(state, id) : null;

  if (event.kind === "request_turn" && resource && event.turn_ref) {
    if (!resource.queue.includes(event.turn_ref) && resource.turn_ref !== event.turn_ref) {
      resource.queue.push(event.turn_ref);
    }
    return;
  }

  if (event.kind === "grant_turn" && resource) {
    const target = event.turn_ref;
    const queueHead = resource.queue[0];
    const maintainerGrant = event.actor === "maintainer";
    if (target && (queueHead === target || maintainerGrant || resource.queue.length === 0)) {
      resource.holder = event.lease?.holder || event.actor;
      resource.turn_ref = target;
      resource.state = "granted";
      resource.expires_after_rev = event.lease?.expires_after_rev ?? null;
      removeFromQueue(resource, target);
    }
    return;
  }

  if (event.kind === "release_turn" && resource && isReleaseActor(event, resource.holder)) {
    resource.holder = null;
    resource.turn_ref = null;
    resource.state = resource.queue.length ? "queued" : "idle";
    resource.expires_after_rev = null;
    return;
  }

  if (event.kind === "expire_turn" && resource && currentRev !== null) {
    if (resource.expires_after_rev !== null && currentRev > resource.expires_after_rev) {
      resource.holder = null;
      resource.turn_ref = null;
      resource.state = resource.queue.length ? "queued" : "idle";
      resource.expires_after_rev = null;
    }
    return;
  }

  if (event.kind === "preempt" && resource) {
    const interrupted = event.preempt?.target_turn_ref || resource.turn_ref;
    state.interrupts.push({
      event: event.id,
      resource: id,
      turn_ref: interrupted,
      reason: event.preempt?.reason || null,
    });
    resource.holder = event.preempt?.next_holder || null;
    resource.turn_ref = event.preempt?.next_holder ? event.turn_ref : null;
    resource.state = event.preempt?.next_holder ? "granted" : (resource.queue.length ? "queued" : "idle");
    resource.expires_after_rev = null;
    return;
  }

  if (event.kind === "gate_request" && id) {
    state.gates[id] = {
      state: "requested",
      requested_by: event.actor,
      governance_kind: event.gate?.governance_kind || null,
      target: event.gate?.target || null,
    };
    return;
  }

  if (event.kind === "gate_decision" && id && event.actor === "maintainer") {
    const prior = state.gates[id] || {};
    state.gates[id] = {
      ...prior,
      state: event.gate?.decision || "deferred",
      decided_by: "maintainer",
      maintainer_event: event.gate?.maintainer_event || event.id,
      governance_kind: event.gate?.governance_kind || prior.governance_kind || null,
      target: event.gate?.target || prior.target || null,
    };
    return;
  }

  if (event.kind === "delivery_update" && event.delivery?.message_event) {
    const msg = event.delivery.message_event;
    const prior = state.deliveries[msg] || {
      state: null,
      attempts: 0,
      adapter: event.delivery.adapter || null,
      delivered_count: 0,
      dedupe_keys: [],
    };
    const dedupe = event.delivery.dedupe_key || `${event.id}`;
    if (!prior.dedupe_keys.includes(dedupe)) {
      prior.dedupe_keys.push(dedupe);
      prior.attempts += 1;
      if (event.delivery.state === "delivered") prior.delivered_count += 1;
    }
    prior.state = event.delivery.state || prior.state;
    prior.adapter = event.delivery.adapter || prior.adapter;
    state.deliveries[msg] = prior;
  }
}

function reduceArbitration(shardsDir, currentRev) {
  const { events, conflicts } = readArbitrationEvents(shardsDir);
  const state = {
    schema_version: "prd-041-arbitration-state-v0",
    resources: {},
    deliveries: {},
    gates: {},
    interrupts: [],
    conflicts,
  };
  for (const event of events) applyArbitrationEvent(state, event, currentRev);

  if (currentRev !== null) {
    for (const resource of Object.values(state.resources)) {
      if (resource.expires_after_rev !== null && currentRev > resource.expires_after_rev) {
        resource.holder = null;
        resource.turn_ref = null;
        resource.state = resource.queue.length ? "queued" : "idle";
        resource.expires_after_rev = null;
      }
    }
  }

  for (const delivery of Object.values(state.deliveries)) {
    delete delivery.dedupe_keys;
  }

  return state;
}

const REGISTERED_AGENTS = new Set(["claude", "codex", "gemini", "maintainer"]);
const AUTHORIZED_TASK_AGENTS = new Set(["claude", "codex", "gemini", "maintainer"]);
const RESERVED_TASK_FIELDS = new Set(["id", "task_id", "created_by", "created_rev"]);

function ensureTask(tasks, taskId) {
  if (!tasks.has(taskId)) {
    tasks.set(taskId, {
      task_id: taskId,
      status: "pending",
      owner: null,
      created_by: null,
      claims: [],
      completions: [],
      updates: [],
    });
  }
  return tasks.get(taskId);
}

function normalizeTaskEvent(event, shardAgent, conflicts) {
  const actor = event.actor || shardAgent;
  if (actor !== shardAgent) {
    conflicts.push({
      kind: "task-owner-mismatch",
      event_id: event.id || null,
      detail: `${shardAgent} shard contains task event actor ${actor}`,
    });
  }
  return {
    ...event,
    actor,
    kind: event.kind || event.event || event.type,
    task_id: event.task_id || event.payload?.task_id || null,
    _source: `${shardAgent}-shard`,
  };
}

function applyTaskEvent(tasks, createsByTask, event, conflicts) {
  if (!event.task_id || !event.kind) return;
  const task = ensureTask(tasks, event.task_id);

  if (event.kind === "task.created") {
    const creates = createsByTask.get(event.task_id) || [];
    creates.push(event);
    createsByTask.set(event.task_id, creates);
    if (creates.length > 1) {
      conflicts.push({
        kind: "duplicate-task-create",
        task_id: event.task_id,
        event_ids: creates.map((create) => create.id).filter(Boolean),
      });
    }
    if (!task.created_by) {
      task.id = event.task_id;
      task.created_by = event.actor;
      if (event.payload?.created_rev !== undefined) task.created_rev = event.payload.created_rev;
      task.owner = event.payload?.owner || event.actor;
      task.status = event.payload?.status || "pending";
      if (event.payload?.description) task.description = event.payload.description;
    }
    return;
  }

  if (event.kind === "task.claimed") {
    if (!task.claims.some((claim) => claim.actor === event.actor && claim.event_id === event.id)) {
      task.claims.push({ actor: event.actor, event_id: event.id || null, ts: event.ts || null });
    }
    if (!task.owner) task.owner = event.actor;
    if (task.status === "pending") task.status = "in_progress";
    return;
  }

  if (event.kind === "task.updated") {
    task.updates.push({ actor: event.actor, event_id: event.id || null, payload: event.payload || {} });
    const reserved = Object.keys(event.payload || {}).filter((field) => RESERVED_TASK_FIELDS.has(field));
    if (reserved.length) {
      conflicts.push({
        kind: "reserved-field-overwrite",
        task_id: event.task_id,
        event_id: event.id || null,
        fields: reserved.sort(),
      });
    }
    const mutable = {};
    for (const [key, value] of Object.entries(event.payload || {})) {
      if (!RESERVED_TASK_FIELDS.has(key)) mutable[key] = value;
    }
    Object.assign(task, mutable);
    return;
  }

  if (event.kind === "task.completed") {
    task.completions.push({ actor: event.actor, event_id: event.id || null, ts: event.ts || null });
    const authorized = event.actor === task.owner || event.actor === "maintainer";
    if (!authorized) {
      conflicts.push({
        kind: "completion-authority-violation",
        task_id: event.task_id,
        event_id: event.id || null,
        actor: event.actor,
        owner: task.owner || null,
      });
      return;
    }
    task.status = "done";
    task.completed_by = event.actor;
    return;
  }

  if (event.kind === "task.deferred" || event.kind === "task.cancelled") {
    task.status = event.kind.replace("task.", "");
  }
}

function reduceTasks(shardsDir) {
  const conflicts = [];
  const agents = [];
  const unknownAgents = [];
  const taskEvents = [];
  const participantEvents = [];
  const seenSignals = new Map();
  const root = shardRoot(shardsDir);

  for (const shardAgent of sortedShardAgents(root)) {
    const dir = path.join(root, shardAgent);
    const status = readFlatYaml(path.join(dir, "status.yaml"), conflicts);
    const registered = REGISTERED_AGENTS.has(shardAgent);
    const taskAuthorized = AUTHORIZED_TASK_AGENTS.has(shardAgent);

    for (const signal of readJsonl(path.join(dir, "signals.jsonl"), conflicts)) {
      if (signal.id && seenSignals.has(signal.id)) {
        conflicts.push({
          kind: "duplicate-signal-id",
          signal_id: signal.id,
          agents: [seenSignals.get(signal.id), shardAgent].sort(),
        });
      } else if (signal.id) {
        seenSignals.set(signal.id, shardAgent);
      }
    }

    if (status) {
      const declaredAgent = status.agent || shardAgent;
      if (declaredAgent !== shardAgent) {
        conflicts.push({
          kind: "status-owner-mismatch",
          agent: declaredAgent,
          shard: shardAgent,
          detail: `${shardAgent} status.yaml declares agent ${declaredAgent}`,
        });
      } else if (registered && shardAgent !== "maintainer") {
        agents.push({ ...status, agent: shardAgent, _source: `${shardAgent}-shard` });
      } else {
        unknownAgents.push({ ...status, agent: shardAgent, _source: `${shardAgent}-shard` });
      }
    } else if (!registered) {
      unknownAgents.push({ agent: shardAgent, _source: `${shardAgent}-shard` });
    }

    for (const event of readJsonl(path.join(dir, "task-events.jsonl"), conflicts)) {
      taskEvents.push(normalizeTaskEvent(event, shardAgent, conflicts));
    }

    for (const event of readJsonl(path.join(dir, "participant-events.jsonl"), conflicts)) {
      participantEvents.push({
        ...event,
        actor: event.actor || shardAgent,
        authoritative: false,
        _source: `${shardAgent}-shard`,
      });
    }
  }

  const unknownNames = new Set(unknownAgents.map((agent) => agent.agent));
  const authorizedEvents = taskEvents.filter((event) => !unknownNames.has(event.actor) && AUTHORIZED_TASK_AGENTS.has(event.actor));
  const { ordered, cycleIds } = causalOrderWithCycles(authorizedEvents);
  if (cycleIds.length) {
    conflicts.push({ kind: "dependency-cycle", event_ids: cycleIds });
  }

  const tasks = new Map();
  const createsByTask = new Map();
  for (const event of ordered) applyTaskEvent(tasks, createsByTask, event, conflicts);

  for (const task of tasks.values()) {
    const actors = [...new Set(task.claims.map((claim) => claim.actor))].sort();
    if (actors.length > 1) {
      conflicts.push({
        kind: "claim-conflict",
        task_id: task.task_id,
        actors,
        event_ids: task.claims.map((claim) => claim.event_id).filter(Boolean).sort(),
        resolution: "allow-parallel-then-review",
      });
    }
  }

  return {
    tasks: [...tasks.values()]
      .map((task) => ({ id: task.id || task.task_id, ...task }))
      .sort((a, b) => a.task_id.localeCompare(b.task_id)),
    agents: agents.sort((a, b) => a.agent.localeCompare(b.agent)),
    conflicts: conflicts.sort((a, b) => {
      const ak = `${a.kind}\u0000${a.task_id || ""}\u0000${a.agent || ""}\u0000${a.detail || ""}`;
      const bk = `${b.kind}\u0000${b.task_id || ""}\u0000${b.agent || ""}\u0000${b.detail || ""}`;
      return ak < bk ? -1 : ak > bk ? 1 : 0;
    }),
    unknown_agents: unknownAgents.sort((a, b) => a.agent.localeCompare(b.agent)),
    participant_events: causalOrder(participantEvents),
    source_events: ordered.map((event) => ({ event: event.kind, ...event })),
  };
}

function renderMailboxMd(data) {
  const lines = [
    "# Mailbox (Derived)",
    "",
    "## Inbox Snapshot",
    "",
    "| Agent | Unread | Oldest unread |",
    "|---|---:|---|",
  ];
  for (const recipient of SNAPSHOT_RECIPIENTS) {
    const row = data.snapshot[recipient];
    lines.push(`| ${recipient} | ${row.unread} | ${row.oldest_unread} |`);
  }
  lines.push("", "## Open Queue", "", "| ID | From -> To | Priority | Subject |", "|---|---|---|---|");
  for (const message of data.messages.slice().sort((a, b) => -baseCompare(a, b))) {
    lines.push(
      `| ${message.id} | ${message.from || ""} -> ${message.to || ""} | ${message.priority || ""} | ${message.subject || ""} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

function renderMailboxJson(data) {
  return {
    snapshot: data.snapshot,
    messages: data.messages,
    conflicts: data.conflicts,
  };
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.emit === "arbitration-json") {
    process.stdout.write(`${JSON.stringify(reduceArbitration(path.resolve(args.shards), args.rev), null, 2)}\n`);
  } else if (args.emit === "task-json") {
    process.stdout.write(`${JSON.stringify(reduceTasks(path.resolve(args.shards)), null, 2)}\n`);
  } else {
    const data = aggregate(path.resolve(args.shards));
    if (args.emit === "mailbox-md") {
    process.stdout.write(renderMailboxMd(data));
    } else if (args.emit === "mailbox-json") {
    process.stdout.write(`${JSON.stringify(renderMailboxJson(data), null, 2)}\n`);
    } else {
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
    }
  }
} catch (error) {
  console.error(error.message);
  console.error(usage());
  process.exit(1);
}
