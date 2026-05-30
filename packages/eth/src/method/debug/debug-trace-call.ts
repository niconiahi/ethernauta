// https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debug-tracecall
//
// `debug_traceCall` executes a call against a historical block's
// state and returns the trace payload selected by the
// `TracerConfig`. The wire result is whatever the selected tracer
// emits — a `CallFrame`, a `PreState`, a `FourByteTrace`, or a
// `StructLogResult` for the default. The binding parses each
// payload against its matching schema (via `tag`) and tags it
// with the tracer name so the caller gets a discriminated
// `TraceResult` instead of an opaque object.
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
  object,
  optional,
  parse,
  tuple,
  union,
} from "valibot"
import { BlockNumberOrTagOrHashSchema } from "../../core/block"
import { GenericTransactionSchema } from "../../core/transaction"
import { TracerConfigSchema } from "./config"
import type { TraceResult } from "./result"
import { tag } from "./tag"

export const DebugTraceCallParametersSchema = union([
  tuple([
    GenericTransactionSchema,
    BlockNumberOrTagOrHashSchema,
    TracerConfigSchema,
  ]),
  tuple([
    GenericTransactionSchema,
    BlockNumberOrTagOrHashSchema,
  ]),
  object({
    transaction: GenericTransactionSchema,
    blockNumberOrTagOrHash: BlockNumberOrTagOrHashSchema,
    tracerConfig: optional(TracerConfigSchema),
  }),
])
export type DebugTraceCallParameters = InferOutput<
  typeof DebugTraceCallParametersSchema
>

export function debug_traceCall(
  _parameters: DebugTraceCallParameters,
): Readable<TraceResult> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<TraceResult> => {
    const method = "debug_traceCall"
    const parameters = parse(
      DebugTraceCallParametersSchema,
      _parameters,
    )
    const { transaction, block, tracer_config } =
      split_parameters(parameters)
    const call = parse(
      CallSchema,
      tracer_config === undefined
        ? [method, [transaction, block]]
        : [method, [transaction, block, tracer_config]],
    )
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new RpcRequestError(response.error)
    }
    return tag(tracer_config?.tracer, response.result)
  }
}

function split_parameters(
  parameters: DebugTraceCallParameters,
) {
  if (Array.isArray(parameters)) {
    return {
      transaction: parameters[0],
      block: parameters[1],
      tracer_config:
        parameters.length === 3 ? parameters[2] : undefined,
    }
  }
  return {
    transaction: parameters.transaction,
    block: parameters.blockNumberOrTagOrHash,
    tracer_config: parameters.tracerConfig,
  }
}
