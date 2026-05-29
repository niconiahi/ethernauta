// https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debug-tracecall
//
// `TraceResult` is the dapp-facing union over every supported
// tracer output. The wire result from `debug_trace*` is the raw
// tracer payload only — geth does not echo the tracer name back.
// The bindings tag the parsed payload with the tracer name from
// the request, producing a discriminated union the consumer can
// switch on without re-inspecting the request configuration.
//
// `STRUCT_TYPE` (from `./struct`) is the discriminator for the
// default tracer (the caller omitted the `tracer` field on the
// request); the other three come from `TRACER_TYPE` in `./tracer`.
//
// `BlockTraceEntry` is the per-transaction shape
// `debug_traceBlockByNumber` returns — `txHash` for the
// transaction the entry belongs to, `trace` for its discriminated
// tracer output.
import { Hash32Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { literal, object, variant } from "valibot"
import { CallFrameSchema } from "./call"
import { FourByteTraceSchema } from "./fourbyte"
import { PreStateSchema } from "./prestate"
import { STRUCT_TYPE, StructLogResultSchema } from "./struct"
import { TRACER_TYPE } from "./tracer"

export const TraceResultSchema = variant("tracer", [
  object({
    tracer: literal(TRACER_TYPE.CALL),
    result: CallFrameSchema,
  }),
  object({
    tracer: literal(TRACER_TYPE.PRESTATE),
    result: PreStateSchema,
  }),
  object({
    tracer: literal(TRACER_TYPE.FOURBYTE),
    result: FourByteTraceSchema,
  }),
  object({
    tracer: STRUCT_TYPE,
    result: StructLogResultSchema,
  }),
])
export type TraceResult = InferOutput<typeof TraceResultSchema>

export const BlockTraceEntrySchema = object({
  txHash: Hash32Schema,
  trace: TraceResultSchema,
})
export type BlockTraceEntry = InferOutput<
  typeof BlockTraceEntrySchema
>
