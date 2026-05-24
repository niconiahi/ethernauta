import {
  array,
  custom,
  type InferOutput,
  object,
  parse,
  string,
} from "valibot"

import { chainIdSchema } from "./chain/chain-id"
import type {
  Unsubscribe,
  WebsocketTransport,
} from "./websocket"

export const SubscribeContextSchema = object({
  chain_id: chainIdSchema,
})
export type SubscribeContext = InferOutput<
  typeof SubscribeContextSchema
>

export const wsChainEntrySchema = object({
  chainId: string(),
  websockets: array(
    custom<WebsocketTransport>(
      (value) => value != null && typeof value === "object",
    ),
  ),
})
export type WsChainEntry = InferOutput<
  typeof wsChainEntrySchema
>

export type ResolvedSubscriber = [
  WebsocketTransport[],
  SubscribeContext,
]

export type Subscribable<T> = (
  _resolved: ResolvedSubscriber,
  _on_notification: (data: T) => void,
) => Promise<Unsubscribe>

export function create_subscriber(
  chains: WsChainEntry[],
): (_input: SubscribeContext) => ResolvedSubscriber {
  return (_input: SubscribeContext): ResolvedSubscriber => {
    const context = parse(SubscribeContextSchema, _input)
    const chain = chains.find(
      (c) => c.chainId === context.chain_id,
    )
    if (!chain) {
      throw new Error(
        `no websocket configured for: ${context.chain_id}`,
      )
    }
    return [chain.websockets, context]
  }
}

export type Subscriber = ReturnType<
  typeof create_subscriber
>
