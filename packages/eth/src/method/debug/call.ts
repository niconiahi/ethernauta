// https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers#call-tracer
//
// `callTracer` returns the recursive call tree rooted at the top-
// level transaction. Each frame carries its EVM opcode (CALL,
// DELEGATECALL, CREATE2, …), the gas envelope, the input / output
// hex, and zero or more child `calls` and `logs`. The recursion
// goes as deep as the trace; an internal contract that fires N
// subcalls produces N entries in `calls`, each of which may have
// its own `calls`.
//
// `value` is optional because STATICCALL / DELEGATECALL frames
// don't carry a separate value. `to` is optional because the
// final CREATE / CREATE2 frame describing a deployment failure
// lacks one. `output` is absent on reverted frames; geth instead
// populates `error` (and `revertReason` when the revert data
// decodes to `Error(string)`).
//
// The schema follows Valibot's canonical recursive pattern
// (https://valibot.dev/guides/other/): hand-rolled `CallFrame`
// type anchor tagged with `R4-recursive-schema`, and `lazy()`
// only on the self-reference inside `calls`. The non-recursive
// fields stay outside the lazy wrapper so the object schema is
// built once at module load.
//
// `GenericSchema<unknown, CallFrame>` (instead of the
// single-param `GenericSchema<CallFrame>` shape Valibot's
// docs show) is required because the branded `@ethernauta/core`
// primitives have `InferInput = `0x${string}`` (unbranded —
// what `custom()`'s predicate runs on) but `InferOutput =
// `0x${string}` & Brand<...>`. `GenericSchema<T>` defaults to
// `<T, T>` and would require the input shape to be branded too,
// which it cannot be. Widening the input slot to `unknown` is
// what Valibot's own type signature documents — the schema
// `parse()`s any JSON and returns the branded shape.
//
// `CallTracerConfig` is the per-request options bag accepted by
// `tracerConfig` when the caller selects this tracer:
// `onlyTopCall` collapses subcalls; `withLog` includes event
// logs emitted during the trace.
import type { Address, Bytes, Uint } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import type { GenericSchema, InferOutput } from "valibot"
import {
  array,
  boolean,
  lazy,
  literal,
  number,
  object,
  optional,
  string,
  union,
} from "valibot"

export const CallTypeSchema = union([
  literal("CALL"),
  literal("STATICCALL"),
  literal("DELEGATECALL"),
  literal("CALLCODE"),
  literal("CREATE"),
  literal("CREATE2"),
  literal("SELFDESTRUCT"),
])
export type CallType = InferOutput<typeof CallTypeSchema>

export const CallFrameLogSchema = object({
  address: AddressSchema,
  topics: array(Hash32Schema),
  data: BytesSchema,
  position: optional(number()),
})
export type CallFrameLog = InferOutput<
  typeof CallFrameLogSchema
>

// allow-violation: R4-recursive-schema
export type CallFrame = {
  type: CallType
  from: Address
  to?: Address
  value?: Uint
  gas: Uint
  gasUsed: Uint
  input: Bytes
  output?: Bytes
  error?: string
  revertReason?: string
  calls?: CallFrame[]
  logs?: CallFrameLog[]
}
export const CallFrameSchema: GenericSchema<
  unknown,
  CallFrame
> = object({
  type: CallTypeSchema,
  from: AddressSchema,
  to: optional(AddressSchema),
  value: optional(UintSchema),
  gas: UintSchema,
  gasUsed: UintSchema,
  input: BytesSchema,
  output: optional(BytesSchema),
  error: optional(string()),
  revertReason: optional(string()),
  calls: optional(array(lazy(() => CallFrameSchema))),
  logs: optional(array(CallFrameLogSchema)),
})

export const CallTracerConfigSchema = object({
  onlyTopCall: optional(boolean()),
  withLog: optional(boolean()),
})
export type CallTracerConfig = InferOutput<
  typeof CallTracerConfigSchema
>
