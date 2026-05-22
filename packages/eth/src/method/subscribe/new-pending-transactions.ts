import type { Hash32 } from "@ethernauta/core"
import { hash32Schema } from "@ethernauta/core"
import type {
  ResolvedSubscriber,
  Subscribable,
  Unsubscribe,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { parse } from "valibot"

export function eth_subscribeNewPendingTransactions(): Subscribable<Hash32> {
  return async (
    [transports, _context]: ResolvedSubscriber,
    on_notification: (_hash: Hash32) => void,
  ): Promise<Unsubscribe> => {
    const call = parse(callSchema, [
      "eth_subscribe",
      ["newPendingTransactions"],
    ])
    const [primary] = transports
    if (!primary) {
      throw new Error("no websocket transport available")
    }
    return primary.subscribe(call, (_data) => {
      const hash = parse(hash32Schema, _data)
      on_notification(hash)
    })
  }
}
