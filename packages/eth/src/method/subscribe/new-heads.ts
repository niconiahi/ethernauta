import type {
  ResolvedSubscriber,
  Subscribable,
  Unsubscribe,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { parse } from "valibot"

import { type Block, blockSchema } from "../../core/block"

export function eth_subscribeNewHeads(): Subscribable<Block> {
  return async (
    [transports, _context]: ResolvedSubscriber,
    on_notification: (_block: Block) => void,
  ): Promise<Unsubscribe> => {
    const call = parse(callSchema, [
      "eth_subscribe",
      ["newHeads"],
    ])
    const [primary] = transports
    if (!primary) {
      throw new Error("no websocket transport available")
    }
    return primary.subscribe(call, (_data) => {
      const block = parse(blockSchema, _data)
      on_notification(block)
    })
  }
}
