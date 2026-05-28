import type { InferOutput } from "valibot"
import {
  array,
  object,
  parse,
  string,
  unknown,
} from "valibot"

import type { AbiCodec } from "./abi-codec"
import {
  decode_event_log,
  type EventLog,
  event_topic_hash,
  EventLogSchema,
} from "./encoding/event"

// Decoded log entry. `args` is positional in the matched event's
// declared input order. `log` is the original wire log for traceability.
export const DecodedLogEntrySchema = object({
  name: string(),
  args: array(unknown()),
  log: EventLogSchema,
})
export type DecodedLogEntry = InferOutput<
  typeof DecodedLogEntrySchema
>

// One event entry: same args you would pass to `decode_event_log`
// for a single log. Topic hash is precomputed inside `decode_logs`
// for dispatch.
export type EventEntry<
  Args extends
    readonly AbiCodec<unknown>[] = readonly AbiCodec<unknown>[],
> = {
  name: string
  args: Args
  indexed: boolean[]
  anonymous?: boolean
}

// Dispatch logs to their matching event entry by topic0 and decode.
// Unrecognised logs (no entry matches their topic0) are skipped.
// Anonymous events cannot be dispatched by topic0 — they are
// out of scope for this helper; decode them with `decode_event_log`.
export function decode_logs(
  _entries: readonly EventEntry[],
  _logs: readonly EventLog[],
): DecodedLogEntry[] {
  const logs = _logs.map((log) =>
    parse(EventLogSchema, log),
  )
  const by_topic = new Map<string, EventEntry>()
  for (const entry of _entries) {
    if (entry.anonymous) continue
    const topic = event_topic_hash(entry.name, entry.args)
    by_topic.set(topic, entry)
  }
  const out: DecodedLogEntry[] = []
  for (const log of logs) {
    const topic0 = log.topics[0]
    const entry = topic0 ? by_topic.get(topic0) : undefined
    if (!entry) continue
    const decoded = decode_event_log({
      name: entry.name,
      args: entry.args,
      indexed: entry.indexed,
      topics: log.topics,
      data: log.data,
      anonymous: entry.anonymous,
    })
    out.push({
      name: decoded.name,
      args: decoded.args,
      log,
    })
  }
  return out
}
