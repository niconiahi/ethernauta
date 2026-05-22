import type {
  ResolvedSubscriber,
  Subscribable,
  Unsubscribe,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

import { filterSchema } from "../../core/filter"
import { type Log, logSchema } from "../../core/receipt"

const parametersSchema = union([
  tuple([filterSchema]),
  object({ filter: filterSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function eth_subscribeLogs(
  _parameters: Parameters,
): Subscribable<Log> {
  return async (
    [transports, _context]: ResolvedSubscriber,
    on_notification: (_log: Log) => void,
  ): Promise<Unsubscribe> => {
    const parameters = parse(parametersSchema, _parameters)
    const filter = Array.isArray(parameters)
      ? parameters[0]
      : parameters.filter
    const call = parse(callSchema, [
      "eth_subscribe",
      ["logs", filter],
    ])
    const [primary] = transports
    if (!primary) {
      throw new Error("no websocket transport available")
    }
    return primary.subscribe(call, (_data) => {
      const log = parse(logSchema, _data)
      on_notification(log)
    })
  }
}
