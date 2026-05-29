// https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug
//
// Geth-namespace tracer methods. Not a numbered EIP — these are
// genuine RPC methods on the standard transport (sibling to
// `eth_*`, `net_*`, `web3_*`) so per the routing decision recorded
// in `tmp/plans/grant_track_unblock/03-tracking.md` they live in
// `@ethernauta/eth` alongside their siblings.
//
// Supported tracers (callTracer, prestateTracer, 4byteTracer, and
// the default struct logger) are emulated by reth, erigon, and
// anvil; 4byteTracer is geth-specific but widely available.
export {
  CallFrameLogSchema,
  CallFrameSchema,
  CallTracerConfigSchema,
  CallTypeSchema,
} from "./call"
export type {
  CallFrame,
  CallFrameLog,
  CallTracerConfig,
  CallType,
} from "./call"
export {
  TracerConfigOptionsSchema,
  TracerConfigSchema,
} from "./config"
export type {
  TracerConfig,
  TracerConfigOptions,
} from "./config"
export { debug_traceBlockByNumber } from "./debug-trace-block-by-number"
export { debug_traceCall } from "./debug-trace-call"
export { debug_traceTransaction } from "./debug-trace-transaction"
export { FourByteTraceSchema } from "./fourbyte"
export type { FourByteTrace } from "./fourbyte"
export {
  AccountStateSchema,
  PreStateDiffSchema,
  PreStateMapSchema,
  PreStateSchema,
  PreStateTracerConfigSchema,
} from "./prestate"
export type {
  AccountState,
  PreState,
  PreStateDiff,
  PreStateMap,
  PreStateTracerConfig,
} from "./prestate"
export {
  BlockTraceEntrySchema,
  TraceResultSchema,
} from "./result"
export type { BlockTraceEntry, TraceResult } from "./result"
export {
  STRUCT_TYPE,
  StructLogResultSchema,
  StructLogSchema,
} from "./struct"
export type {
  StructLog,
  StructLogResult,
  StructType,
} from "./struct"
export { TRACER_TYPE, TracerTypeSchema } from "./tracer"
export type { TracerType } from "./tracer"
