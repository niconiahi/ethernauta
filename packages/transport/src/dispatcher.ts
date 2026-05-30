import { type InferOutput, literal, object, union } from "valibot"

import type { Call } from "./call"
import type { Http } from "./http"
import type { Response } from "./json-rpc"

export const DispatcherStrategySchema = object({
  type: union([literal("parallel"), literal("sequential")]),
})
export type DispatcherStrategy = InferOutput<
  typeof DispatcherStrategySchema
>

export type Dispatcher = (_call: Call) => Promise<Response>

export const DEFAULT_STRATEGY: DispatcherStrategy = {
  type: "parallel",
}

export function create_dispatcher(
  transports: Http[],
  strategy: DispatcherStrategy,
): Dispatcher {
  if (strategy.type === "parallel") {
    return create_parallel(transports)
  }
  return create_sequential(transports)
}

function create_parallel(transports: Http[]): Dispatcher {
  return (call) =>
    Promise.any(
      transports.map((transport) => transport(call)),
    )
}

function create_sequential(
  transports: Http[],
): Dispatcher {
  return async (call) => {
    const errors: Error[] = []
    for (const transport of transports) {
      try {
        return await transport(call)
      } catch (error) {
        errors.push(
          error instanceof Error
            ? error
            : new Error(String(error)),
        )
      }
    }
    throw new AggregateError(
      errors,
      "all transports failed",
    )
  }
}
