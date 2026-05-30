// https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debug-tracecall
//
// `TracerConfig` is the second argument to `debug_trace*` methods.
// `tracer` selects one of the built-in tracers (`TRACER_TYPE`
// from `./tracer`); omitting it picks the default struct logger.
// `timeout` is a duration string (`"5s"`, `"30s"`) the node
// enforces against the trace walk.
//
// `tracerConfig` is the tracer-specific options bag. Each built-in
// tracer accepts a narrow shape: `callTracer` accepts
// `{ onlyTopCall?, withLog? }` (defined in `./call`), `prestateTracer`
// accepts `{ diffMode? }` (defined in `./prestate`), `4byteTracer`
// accepts no options. Modelling the bag as a union over those
// shapes keeps the boundary strict without an `unknown` slot. If
// the spec adds a new tracer with a new options shape, extend the
// union; do not widen.
import type { InferOutput } from "valibot"
import { object, optional, string, union } from "valibot"
import { CallTracerConfigSchema } from "./call"
import { PreStateTracerConfigSchema } from "./prestate"
import { TracerTypeSchema } from "./tracer"

export const TracerConfigOptionsSchema = union([
  CallTracerConfigSchema,
  PreStateTracerConfigSchema,
])
export type TracerConfigOptions = InferOutput<
  typeof TracerConfigOptionsSchema
>

export const TracerConfigSchema = object({
  tracer: optional(TracerTypeSchema),
  timeout: optional(string()),
  tracerConfig: optional(TracerConfigOptionsSchema),
})
export type TracerConfig = InferOutput<
  typeof TracerConfigSchema
>
