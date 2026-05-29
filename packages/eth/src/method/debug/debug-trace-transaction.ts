// https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debug-tracetransaction
//
// `debug_traceTransaction` replays a historical transaction at
// the block it was included in and returns the trace payload
// selected by the `TracerConfig`. Same response shape and same
// per-tracer dispatch as `debug_traceCall`; only the request
// arguments differ (transaction hash + tracer config, no `from /
// to / data` call object and no block argument — geth picks the
// block from the tx hash).
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import {
  CallSchema,
  RpcRequestError,
} from "@ethernauta/transport"
import { Hash32Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { object, optional, parse, tuple, union } from "valibot"
import { TracerConfigSchema } from "./config"
import type { TraceResult } from "./result"
import { tag } from "./tag"

export const DebugTraceTransactionParametersSchema = union([
  tuple([Hash32Schema, TracerConfigSchema]),
  tuple([Hash32Schema]),
  object({
    transactionHash: Hash32Schema,
    tracerConfig: optional(TracerConfigSchema),
  }),
])
export type DebugTraceTransactionParameters = InferOutput<
  typeof DebugTraceTransactionParametersSchema
>

export function debug_traceTransaction(
  _parameters: DebugTraceTransactionParameters,
): Readable<TraceResult> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<TraceResult> => {
    const method = "debug_traceTransaction"
    const parameters = parse(
      DebugTraceTransactionParametersSchema,
      _parameters,
    )
    const { transaction_hash, tracer_config } =
      split_parameters(parameters)
    const call = parse(
      CallSchema,
      tracer_config === undefined
        ? [method, [transaction_hash]]
        : [method, [transaction_hash, tracer_config]],
    )
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new RpcRequestError(response.error)
    }
    return tag(tracer_config?.tracer, response.result)
  }
}

function split_parameters(
  parameters: DebugTraceTransactionParameters,
) {
  if (Array.isArray(parameters)) {
    return {
      transaction_hash: parameters[0],
      tracer_config:
        parameters.length === 2 ? parameters[1] : undefined,
    }
  }
  return {
    transaction_hash: parameters.transactionHash,
    tracer_config: parameters.tracerConfig,
  }
}
