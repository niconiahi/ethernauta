import {
  custom,
  type InferOutput,
  literal,
  nullable,
  object,
  parse,
  string,
  unknown,
} from "valibot"
import type { Call } from "./call"
import { CallSchema } from "./call"
import type { Parameters, Response } from "./json-rpc"
import { RequestSchema, ResponseSchema } from "./json-rpc"

const SubscriptionNotificationSchema = object({
  jsonrpc: literal("2.0"),
  method: literal("eth_subscription"),
  params: object({
    subscription: string(),
    result: unknown(),
  }),
})
export type SubscriptionNotification = InferOutput<
  typeof SubscriptionNotificationSchema
>

export type Unsubscribe = () => Promise<void>

export const WebsocketTransportSchema = object({
  call: custom<(_call: Call) => Promise<Response>>(
    (value) => typeof value === "function",
  ),
  subscribe: custom<
    (
      _call: Call,
      _on_notification: (data: unknown) => void,
    ) => Promise<Unsubscribe>
  >((value) => typeof value === "function"),
  close: custom<() => Promise<void>>(
    (value) => typeof value === "function",
  ),
})
export type WebsocketTransport = InferOutput<
  typeof WebsocketTransportSchema
>

const PendingSchema = object({
  resolve: custom<(_response: Response) => void>(
    (value) => typeof value === "function",
  ),
  reject: custom<(_error: Error) => void>(
    (value) => typeof value === "function",
  ),
})
type Pending = InferOutput<typeof PendingSchema>

const SubscriptionSchema = object({
  call: CallSchema,
  on_notification: custom<(_data: unknown) => void>(
    (value) => typeof value === "function",
  ),
  server_id: nullable(string()),
})
type Subscription = InferOutput<typeof SubscriptionSchema>

export function websocket(url: string): WebsocketTransport {
  let socket: WebSocket | null = null
  let connecting: Promise<WebSocket> | null = null
  let reconnect_attempt = 0
  let closed = false
  const pending = new Map<string, Pending>()
  const subscriptions = new Map<string, Subscription>()
  const server_to_client = new Map<string, string>()

  function next_id(): string {
    return crypto.randomUUID()
  }

  function open(): Promise<WebSocket> {
    if (socket && socket.readyState === WebSocket.OPEN) {
      return Promise.resolve(socket)
    }
    if (connecting) return connecting
    connecting = new Promise<WebSocket>(
      (resolve, reject) => {
        const ws = new WebSocket(url)
        socket = ws
        const on_open = () => {
          reconnect_attempt = 0
          connecting = null
          ws.removeEventListener("error", on_error_initial)
          resubscribe_all(ws)
            .then(() => resolve(ws))
            .catch(reject)
        }
        const on_error_initial = () => {
          connecting = null
          ws.removeEventListener("open", on_open)
          reject(new Error(`websocket error: ${url}`))
        }
        ws.addEventListener("open", on_open, { once: true })
        ws.addEventListener("error", on_error_initial, {
          once: true,
        })
        ws.addEventListener("close", on_close)
        ws.addEventListener("message", on_message)
      },
    )
    return connecting
  }

  function on_close(): void {
    socket = null
    connecting = null
    for (const [, p] of pending) {
      p.reject(new Error("websocket closed"))
    }
    pending.clear()
    server_to_client.clear()
    for (const [, sub] of subscriptions) {
      sub.server_id = null
    }
    if (!closed && subscriptions.size > 0) {
      schedule_reconnect()
    }
  }

  function schedule_reconnect(): void {
    const delay = Math.min(
      30_000,
      1_000 * 2 ** reconnect_attempt,
    )
    reconnect_attempt += 1
    setTimeout(() => {
      if (closed) return
      open().catch(() => undefined)
    }, delay)
  }

  function on_message(event: MessageEvent): void {
    const raw = JSON.parse(event.data as string)
    if (
      raw &&
      typeof raw === "object" &&
      "method" in raw &&
      !("id" in raw)
    ) {
      const notification = parse(
        SubscriptionNotificationSchema,
        raw,
      )
      const client_id = server_to_client.get(
        notification.params.subscription,
      )
      if (!client_id) return
      const sub = subscriptions.get(client_id)
      if (!sub) return
      sub.on_notification(notification.params.result)
      return
    }
    const response = parse(ResponseSchema, raw)
    const id = String(response.id)
    const p = pending.get(id)
    if (!p) return
    pending.delete(id)
    p.resolve(response)
  }

  async function resubscribe_all(
    ws: WebSocket,
  ): Promise<void> {
    for (const [client_id, sub] of subscriptions) {
      await raw_subscribe(ws, client_id, sub)
    }
  }

  function send(
    ws: WebSocket,
    call: Call,
  ): Promise<Response> {
    const [method, params] = call
    const id = next_id()
    const request = parse(RequestSchema, {
      jsonrpc: "2.0",
      id,
      method,
      params: get_params(params),
    })
    return new Promise<Response>((resolve, reject) => {
      pending.set(id, { resolve, reject })
      ws.send(JSON.stringify(request))
    })
  }

  async function send_call(call: Call): Promise<Response> {
    const ws = await open()
    return send(ws, call)
  }

  async function raw_subscribe(
    ws: WebSocket,
    client_id: string,
    sub: Subscription,
  ): Promise<void> {
    const response = await send(ws, sub.call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const server_id = parse(string(), response.result)
    sub.server_id = server_id
    server_to_client.set(server_id, client_id)
  }

  return {
    call: send_call,
    subscribe: async (call, on_notification) => {
      const client_id = next_id()
      const subscription: Subscription = {
        call,
        on_notification,
        server_id: null,
      }
      subscriptions.set(client_id, subscription)
      try {
        const ws = await open()
        await raw_subscribe(ws, client_id, subscription)
      } catch (error) {
        subscriptions.delete(client_id)
        throw error
      }
      return async () => {
        const subscription = subscriptions.get(client_id)
        if (!subscription) return
        subscriptions.delete(client_id)
        if (subscription.server_id) {
          server_to_client.delete(subscription.server_id)
          await send_call([
            "eth_unsubscribe",
            [subscription.server_id],
          ]).catch(() => undefined)
        }
      }
    },
    close: async () => {
      closed = true
      subscriptions.clear()
      server_to_client.clear()
      if (socket) socket.close()
    },
  }
}

function get_params(
  params?: Parameters,
): unknown[] | undefined {
  if (!params) return undefined
  return Array.isArray(params)
    ? params
    : Object.values(params)
}
