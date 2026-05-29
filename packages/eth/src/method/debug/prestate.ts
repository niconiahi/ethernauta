// https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers#prestate-tracer
//
// `prestateTracer` returns the state read during the trace, keyed
// by account. In default mode the output is the pre-state — the
// values as they were before the transaction executed. With
// `tracerConfig: { diffMode: true }` it returns a `{ pre, post }`
// pair so the caller can diff. The schemas below model both
// modes as a union; in practice geth always returns one shape
// per request, but the union lets the binding parse a single
// response regardless of which mode the caller configured.
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import {
  boolean,
  number,
  object,
  optional,
  record,
  union,
} from "valibot"

export const AccountStateSchema = object({
  balance: optional(UintSchema),
  nonce: optional(number()),
  code: optional(BytesSchema),
  storage: optional(record(Bytes32Schema, Bytes32Schema)),
})
export type AccountState = InferOutput<typeof AccountStateSchema>

export const PreStateMapSchema = record(
  AddressSchema,
  AccountStateSchema,
)
export type PreStateMap = InferOutput<typeof PreStateMapSchema>

export const PreStateDiffSchema = object({
  pre: PreStateMapSchema,
  post: PreStateMapSchema,
})
export type PreStateDiff = InferOutput<typeof PreStateDiffSchema>

export const PreStateSchema = union([
  PreStateDiffSchema,
  PreStateMapSchema,
])
export type PreState = InferOutput<typeof PreStateSchema>

export const PreStateTracerConfigSchema = object({
  diffMode: optional(boolean()),
})
export type PreStateTracerConfig = InferOutput<
  typeof PreStateTracerConfigSchema
>
