import type {
  ResolvedSubscriber,
  Subscribable,
  Unsubscribe,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

import { FilterSchema } from "../../core/filter"
import { type Log, LogSchema } from "../../core/receipt"

const ParametersSchema = union([
  tuple([FilterSchema]),
  object({ filter: FilterSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function eth_subscribeLogs(
  _parameters: Parameters,
): Subscribable<Log> {
  return async (
    [transports, _context]: ResolvedSubscriber,
    on_notification: (_log: Log) => void,
  ): Promise<Unsubscribe> => {
    const parameters = parse(ParametersSchema, _parameters)
    const filter = Array.isArray(parameters)
      ? parameters[0]
      : parameters.filter
    const call = parse(CallSchema, [
      "eth_subscribe",
      ["logs", filter],
    ])
    const [primary] = transports
    if (!primary) {
      throw new Error("no websocket transport available")
    }
    return primary.subscribe(call, (_data) => {
      const log = parse(LogSchema, _data)
      on_notification(log)
    })
  }
}
