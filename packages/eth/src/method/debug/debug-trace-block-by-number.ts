// https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debug-traceblockbynumber
//
// `debug_traceBlockByNumber` replays every transaction in a block
// and returns the per-tx trace payload selected by the
// `TracerConfig`. The wire response is an array of
// `{ txHash, result }` entries; the binding tags each entry's
// raw payload through the shared `tag` dispatch and exposes a
// list of `BlockTraceEntry` so the caller can fan out by tx.
//
// The per-entry `result` field is opaque at parse time — its
// shape depends on the request-side tracer selection, which the
// wire response doesn't echo back. Same opaque-by-dispatch
// pattern as ERC-7677's ContextSchema; the `unknown()` slot is
// the irreducible boundary.
import { Hash32Schema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import {
  CallSchema,
  RpcRequestError,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  array,
  object,
  optional,
  parse,
  tuple,
  union,
  unknown,
} from "valibot"
import { BlockNumberOrTagSchema } from "../../core/block"
import { TracerConfigSchema } from "./config"
import type { BlockTraceEntry } from "./result"
import { tag } from "./tag"

export const DebugTraceBlockByNumberParametersSchema = union([
  tuple([BlockNumberOrTagSchema, TracerConfigSchema]),
  tuple([BlockNumberOrTagSchema]),
  object({
    blockNumberOrTag: BlockNumberOrTagSchema,
    tracerConfig: optional(TracerConfigSchema),
  }),
])
export type DebugTraceBlockByNumberParameters = InferOutput<
  typeof DebugTraceBlockByNumberParametersSchema
>

const RawBlockEntrySchema = object({
  txHash: Hash32Schema,
  result: unknown(),
})

export function debug_traceBlockByNumber(
  _parameters: DebugTraceBlockByNumberParameters,
): Readable<BlockTraceEntry[]> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<BlockTraceEntry[]> => {
    const method = "debug_traceBlockByNumber"
    const parameters = parse(
      DebugTraceBlockByNumberParametersSchema,
      _parameters,
    )
    const { block, tracer_config } = split_parameters(parameters)
    const call = parse(
      CallSchema,
      tracer_config === undefined
        ? [method, [block]]
        : [method, [block, tracer_config]],
    )
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new RpcRequestError(response.error)
    }
    const entries = parse(
      array(RawBlockEntrySchema),
      response.result,
    )
    return entries.map((entry) => ({
      txHash: entry.txHash,
      trace: tag(tracer_config?.tracer, entry.result),
    }))
  }
}

function split_parameters(
  parameters: DebugTraceBlockByNumberParameters,
) {
  if (Array.isArray(parameters)) {
    return {
      block: parameters[0],
      tracer_config:
        parameters.length === 2 ? parameters[1] : undefined,
    }
  }
  return {
    block: parameters.blockNumberOrTag,
    tracer_config: parameters.tracerConfig,
  }
}
