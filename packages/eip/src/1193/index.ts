// https://eips.ethereum.org/EIPS/eip-1193

import type { Http } from "@ethernauta/transport"
import * as v from "valibot"

export const ListenerSchema = v.instance(Function)
export type Listener = v.InferOutput<typeof ListenerSchema>

export const ListenersSchema = v.map(
  v.string(),
  v.instance(Set<Listener>),
)
export type Listeners = v.InferOutput<
  typeof ListenersSchema
>

export interface RequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | object
}

export interface ProviderRpcError extends Error {
  code: number
  data?: unknown
}

export interface ProviderMessage {
  readonly type: string
  readonly data: unknown
}

export interface EthSubscription extends ProviderMessage {
  readonly type: "eth_subscription"
  readonly data: {
    readonly subscription: string
    readonly result: unknown
  }
}

export interface ProviderConnectInfo {
  readonly chainId: string
}

export interface Provider {
  request(args: RequestArguments): Promise<unknown>
  on(
    event: "connect",
    listener: (info: ProviderConnectInfo) => void,
  ): void
  on(
    event: "disconnect",
    listener: (error: ProviderRpcError) => void,
  ): void
  on(
    event: "chainChanged",
    listener: (chainId: string) => void,
  ): void
  on(
    event: "accountsChanged",
    listener: (accounts: string[]) => void,
  ): void
  on(
    event: "message",
    listener: (message: ProviderMessage) => void,
  ): void
  removeListener(
    event: string,
    listener: (...args: unknown[]) => void,
  ): void
}

export const ERROR_CODE = {
  USER_REJECTED_REQUEST: 4001,
  UNAUTHORIZED: 4100,
  UNSUPPORTED_METHOD: 4200,
  DISCONNECTED: 4900,
  CHAIN_DISCONNECTED: 4901,
} as const

export type Signer = (
  method: string,
  params: unknown,
) => Promise<string>

export type Signable<T> = (_signer: Signer) => Promise<T>

export function create_provider({
  chains,
}: {
  chains: Array<{ chainId: string; transports: Http[] }>
}): Provider {
  const listeners: Listeners = new Map()

  return {
    async request({
      method,
    }: RequestArguments): Promise<unknown> {
      switch (method) {
        case "eth_chainId": {
          const chain = chains[0]
          if (!chain)
            throw {
              code: ERROR_CODE.DISCONNECTED,
              message: "No chain configured",
            }
          return chain.chainId
        }
        default: {
          throw {
            code: ERROR_CODE.UNSUPPORTED_METHOD,
            message: `method not supported: ${method}`,
          }
        }
      }
    },

    on(event, listener) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set())
      } else {
        const valid = v.parse(ListenerSchema, listener)
        listeners.get(event)?.add(valid)
      }
    },

    removeListener(event, listener) {
      const valid = v.parse(ListenerSchema, listener)
      listeners.get(event)?.delete(valid)
    },
  }
}
