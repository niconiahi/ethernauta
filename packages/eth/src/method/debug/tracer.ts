// https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug
//
// The set of tracer names geth's `debug_trace*` methods accept on
// the `tracer` field of `TracerConfig`. Omitting the field picks
// the default struct logger — its dapp-side discriminator is
// `STRUCT_TYPE` in `./struct`, kept out of `TRACER_TYPE` because
// it isn't a wire-accepted tracer name.
import { picklist } from "valibot"

export const TRACER_TYPE = {
  CALL: "callTracer",
  PRESTATE: "prestateTracer",
  FOURBYTE: "4byteTracer",
} as const
export type TracerType =
  (typeof TRACER_TYPE)[keyof typeof TRACER_TYPE]
export const TracerTypeSchema = picklist(
  Object.values(TRACER_TYPE),
)
