// https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers#4byte-tracer
//
// `4byteTracer` returns a count of `<selector>-<callDataSize>`
// occurrences seen during the trace. Keys look like
// `"0xa9059cbb-68"` (transfer with the standard 4-byte selector
// plus a 64-byte argument tail); values are the count of times
// that signature was invoked. Useful for high-level "what got
// called" summaries without descending into per-frame detail.
import type { InferOutput } from "valibot"
import { number, record, string } from "valibot"

export const FourByteTraceSchema = record(
  string(),
  number(),
)
export type FourByteTrace = InferOutput<
  typeof FourByteTraceSchema
>
