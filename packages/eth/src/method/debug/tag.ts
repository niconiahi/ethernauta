// https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug
//
// Shared dispatch the three `debug_trace*` bindings call after
// they receive a successful JSON-RPC response. Geth does not echo
// the tracer name back, so the dispatch reads the name from the
// request-side `TracerConfig` and tags the parsed payload with
// the matching discriminator. Extracted here so all three
// bindings reuse the same per-tracer parse without duplicating
// the four-branch switch.
//
// The `raw` parameter takes the `result` field of a
// `SuccesfulResponse` — typed once at the json-rpc boundary; the
// schemas validate it here.
import type { SuccesfulResponse } from "@ethernauta/transport"
import { parse } from "valibot"
import { CallFrameSchema } from "./call"
import { FourByteTraceSchema } from "./fourbyte"
import { PreStateSchema } from "./prestate"
import type { TraceResult } from "./result"
import { STRUCT_TYPE, StructLogResultSchema } from "./struct"
import { TRACER_TYPE, type TracerType } from "./tracer"

export function tag(
  tracer: TracerType | undefined,
  raw: SuccesfulResponse["result"],
): TraceResult {
  if (tracer === TRACER_TYPE.CALL) {
    return {
      tracer: TRACER_TYPE.CALL,
      result: parse(CallFrameSchema, raw),
    }
  }
  if (tracer === TRACER_TYPE.PRESTATE) {
    return {
      tracer: TRACER_TYPE.PRESTATE,
      result: parse(PreStateSchema, raw),
    }
  }
  if (tracer === TRACER_TYPE.FOURBYTE) {
    return {
      tracer: TRACER_TYPE.FOURBYTE,
      result: parse(FourByteTraceSchema, raw),
    }
  }
  return {
    tracer: STRUCT_TYPE.literal,
    result: parse(StructLogResultSchema, raw),
  }
}
