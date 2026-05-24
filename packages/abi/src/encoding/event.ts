import {
  bytes32Schema,
  bytesSchema,
  type Hash32,
  hash32Schema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import type { InferOutput } from "valibot"
import {
  array,
  boolean,
  nullable,
  object,
  optional,
  parse,
  string,
  unknown,
} from "valibot"

import type { AbiCodec } from "../abi-codec"
import { decode_sequence } from "../sequence"

// Wire shape of a log — the topics + data slice of what
// eth_getLogs / eth_getFilterLogs returns. Strict on the
// two fields decoding actually consumes; the full Log type
// in @ethernauta/eth keeps metadata (blockNumber, txHash…).
export const eventLogSchema = object({
  topics: array(bytes32Schema),
  data: bytesSchema,
})
export type EventLog = InferOutput<typeof eventLogSchema>

// Topic list returned by encode_event_topics — suitable for
// eth_getLogs `topics`. `null` is a wildcard slot.
export const eventTopicsSchema = array(
  nullable(hash32Schema),
)
export type EventTopics = InferOutput<
  typeof eventTopicsSchema
>

// Decoded log. `args` is positional in the SAME order as the
// event's declared inputs. For indexed reference types
// (string / bytes / dynamic arrays / tuples) the value is the
// 32-byte topic hash — the original value cannot be recovered
// from the log.
export const decodedEventLogSchema = object({
  name: string(),
  args: array(unknown()),
})
export type DecodedEventLog = InferOutput<
  typeof decodedEventLogSchema
>

// Boundary schema for the non-codec parts of decode_event_log's
// input. `args` and `indexed` are validated by length-pairing
// inside the function; the codec list is a generic shape
// (tolerated per the conventions skill).
export const decodeEventLogInputSchema = object({
  name: string(),
  indexed: array(boolean()),
  topics: array(bytes32Schema),
  data: bytesSchema,
  anonymous: optional(boolean()),
})
export type DecodeEventLogInput = InferOutput<
  typeof decodeEventLogInputSchema
>

// Boundary schema for the non-codec parts of
// encode_event_topics' input. Same carve-out for the codec
// list. `values` is loose — its per-position type depends on
// the matching indexed codec, so it's `unknown` at the schema
// layer and the codec validates the actual value at encode
// time via its own schema.
export const encodeEventTopicsInputSchema = object({
  name: string(),
  indexed: array(boolean()),
  values: optional(array(nullable(unknown()))),
  anonymous: optional(boolean()),
})
export type EncodeEventTopicsInput = InferOutput<
  typeof encodeEventTopicsInputSchema
>

// Full 32-byte keccak256 of the canonical event signature.
// Unlike function selectors, event topic0 is NOT truncated.
export function event_topic_hash(
  _name: string,
  _args: readonly AbiCodec<unknown>[],
): Hash32 {
  const sig = `${_name}(${_args.map((a) => a.signature).join(",")})`
  return parse(
    hash32Schema,
    bytes_to_hex(keccak_256(new TextEncoder().encode(sig))),
  )
}

// Encode the per-arg indexed topic. Solidity ABI rules:
//   - static value types (address, uintN, bool, bytesN): topic
//     is the normal 32-byte head encoding of the value.
//   - dynamic `string` / `bytes`: topic is keccak256 of the raw
//     value bytes (no length prefix, no padding).
//   - any other dynamic / reference type (arrays, tuples):
//     topic is keccak256 of the standard ABI encoding.
function encode_indexed_topic(
  _codec: AbiCodec<unknown>,
  _value: unknown,
): Uint8Array {
  if (!_codec.is_dynamic) {
    return _codec.encode(_value)
  }
  if (_codec.signature === "string") {
    return keccak_256(
      new TextEncoder().encode(parse(string(), _value)),
    )
  }
  if (_codec.signature === "bytes") {
    return keccak_256(
      hex_to_bytes(parse(bytesSchema, _value)),
    )
  }
  return keccak_256(_codec.encode(_value))
}

// Build the topic list for an eth_getLogs filter or for
// inspecting a known log. `args` is the full ordered event
// input list; `indexed` is parallel to it. `values` carries
// values only for the indexed positions, in their indexed-
// declaration order. A `null` (or a trailing-unspecified
// position) becomes a wildcard.
export function encode_event_topics<
  const Args extends readonly AbiCodec<unknown>[],
>(
  _input: EncodeEventTopicsInput & { args: Args },
): EventTopics {
  const { args } = _input
  const input = parse(encodeEventTopicsInputSchema, _input)
  const { name, indexed, values, anonymous } = input
  if (args.length !== indexed.length) {
    throw new Error(
      `event ${name}: \`args\` and \`indexed\` length mismatch (${args.length} vs ${indexed.length})`,
    )
  }
  const indexed_codecs: AbiCodec<unknown>[] = []
  for (const [i, codec] of args.entries()) {
    if (indexed[i]) {
      indexed_codecs.push(codec)
    }
  }
  // First build the per-indexed-arg topic list, then drop
  // trailing wildcards — eth_getLogs treats a missing trailing
  // topic as "any", so emitting redundant nulls is at best
  // noise and at worst gets rejected by strict clients.
  const indexed_part: (Hash32 | null)[] = []
  for (const [i, codec] of indexed_codecs.entries()) {
    const v = values?.[i]
    if (v === null || v === undefined) {
      indexed_part.push(null)
      continue
    }
    const topic = encode_indexed_topic(codec, v)
    indexed_part.push(
      parse(hash32Schema, bytes_to_hex(topic)),
    )
  }
  while (
    indexed_part.length > 0 &&
    indexed_part[indexed_part.length - 1] === null
  ) {
    indexed_part.pop()
  }
  const out: EventTopics = []
  if (!anonymous) {
    out.push(event_topic_hash(name, args))
  }
  for (const t of indexed_part) {
    out.push(t)
  }
  return out
}

// Decode an on-chain log against a known event signature.
// Caller is responsible for matching `topics[0]` to the right
// event signature first (use `event_topic_hash`).
export function decode_event_log<
  const Args extends readonly AbiCodec<unknown>[],
>(
  _input: DecodeEventLogInput & {
    args: Args
  },
): DecodedEventLog {
  const { args } = _input
  const input = parse(decodeEventLogInputSchema, _input)
  const { name, indexed, topics, data, anonymous } = input
  if (args.length !== indexed.length) {
    throw new Error(
      `event ${name}: \`args\` and \`indexed\` length mismatch (${args.length} vs ${indexed.length})`,
    )
  }
  const topic_offset = anonymous ? 0 : 1
  const indexed_topics = topics.slice(topic_offset)

  const non_indexed_codecs: AbiCodec<unknown>[] = []
  for (const [i, codec] of args.entries()) {
    if (!indexed[i]) {
      non_indexed_codecs.push(codec)
    }
  }
  const data_bytes = hex_to_bytes(data)
  const non_indexed_values =
    non_indexed_codecs.length > 0
      ? decode_sequence(non_indexed_codecs, data_bytes, 0)
      : []

  const out: unknown[] = []
  let topic_i = 0
  let data_i = 0
  for (const [i, codec] of args.entries()) {
    if (indexed[i]) {
      const topic = indexed_topics[topic_i++]
      if (topic === undefined) {
        throw new Error(
          `event ${name}: not enough indexed topics in log`,
        )
      }
      if (codec.is_dynamic) {
        out.push(topic)
      } else {
        out.push(codec.decode(hex_to_bytes(topic), 0))
      }
    } else {
      out.push(non_indexed_values[data_i++])
    }
  }
  return parse(decodedEventLogSchema, { name, args: out })
}
