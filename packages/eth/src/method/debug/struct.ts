// https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debug-tracecall
//
// The default tracer (when no `tracer` field is set on the
// request) emits an `ExecutionResult` wrapper around a per-opcode
// `StructLog[]` step stream. Each step carries the program
// counter, opcode, gas envelope, and optionally the live stack /
// memory / storage at that point. This is the rawest output
// `debug_traceCall` can produce; the tree-shaped callTracer and
// the aggregate fourbyte / prestate tracers all derive from a
// walk of the same step stream.
//
// `STRUCT_TYPE` is the dapp-side discriminator the bindings tag
// the parsed `StructLogResult` with. Kept out of `TRACER_TYPE`
// in `./tracer` because geth's wire request `tracer` field never
// carries it — the request signals "default tracer" by omitting
// the field entirely. The literal IS the schema; call sites that
// need the bare string read `STRUCT_TYPE.literal`.
import type { InferOutput } from "valibot"
import {
  array,
  boolean,
  literal,
  number,
  object,
  optional,
  record,
  string,
} from "valibot"

export const STRUCT_TYPE = literal("struct")
export type StructType = InferOutput<typeof STRUCT_TYPE>

export const StructLogSchema = object({
  pc: number(),
  op: string(),
  gas: number(),
  gasCost: number(),
  depth: number(),
  stack: optional(array(string())),
  memory: optional(array(string())),
  storage: optional(record(string(), string())),
  error: optional(string()),
})
export type StructLog = InferOutput<typeof StructLogSchema>

export const StructLogResultSchema = object({
  gas: number(),
  failed: boolean(),
  returnValue: string(),
  structLogs: array(StructLogSchema),
})
export type StructLogResult = InferOutput<
  typeof StructLogResultSchema
>
