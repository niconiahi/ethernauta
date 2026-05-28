import type {
  ResolvedSubscriber,
  Subscribable,
  Unsubscribe,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

import { type Block, BlockSchema } from "../../core/block"

export function eth_subscribeNewHeads(): Subscribable<Block> {
  return async (
    [transports, _context]: ResolvedSubscriber,
    on_notification: (_block: Block) => void,
  ): Promise<Unsubscribe> => {
    const call = parse(CallSchema, [
      "eth_subscribe",
      ["newHeads"],
    ])
    const [primary] = transports
    if (!primary) {
      throw new Error("no websocket transport available")
    }
    return primary.subscribe(call, (_data) => {
      const block = parse(BlockSchema, _data)
      on_notification(block)
    })
  }
}
