import { parse } from "valibot"

import type { Call } from "./call"
import type { Parameters, Request, Response } from "./json-rpc"
import { requestSchema, responseSchema } from "./json-rpc"

export type HttpRetryOptions = {
  attempts: number
  base_delay_ms?: number
  max_delay_ms?: number
}

export type HttpBatchOptions = {
  window_ms?: number
  max_size?: number
}

export type HttpOptions = {
  timeout_ms?: number
  retry?: HttpRetryOptions
  batch?: boolean | HttpBatchOptions
  headers?: Record<string, string>
}

export function http(
  url: string,
  options: HttpOptions = {},
): (_call: Call) => Promise<Response> {
  if (options.batch) {
    return create_batching_http(url, options)
  }
  return create_single_http(url, options)
}
export type Http = ReturnType<typeof http>

function create_single_http(
  url: string,
  options: HttpOptions,
): (_call: Call) => Promise<Response> {
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    const request = parse(requestSchema, {
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method,
      params: get_params(params),
    })
    const raw = await with_retry(
      () => post(url, request, options),
      options.retry,
    )
    return parse(responseSchema, raw)
  }
}

function create_batching_http(
  url: string,
  options: HttpOptions,
): (_call: Call) => Promise<Response> {
  const batch_options =
    typeof options.batch === "object" ? options.batch : {}
  const window_ms = batch_options.window_ms ?? 0
  const max_size = batch_options.max_size ?? 100

  type Slot = {
    request: Request
    resolve: (_response: Response) => void
    reject: (_error: Error) => void
  }
  let queue: Slot[] = []
  let timer: ReturnType<typeof setTimeout> | null = null

  function flush(): void {
    const current = queue
    queue = []
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (current.length === 0) return
    const body = current.map((s) => s.request)
    with_retry(() => post_batch(url, body, options), options.retry)
      .then((responses) => {
        const by_id = new Map<unknown, Response>()
        for (const raw of responses) {
          const response = parse(responseSchema, raw)
          by_id.set(response.id, response)
        }
        for (const slot of current) {
          const response = by_id.get(slot.request.id)
          if (!response) {
            slot.reject(
              new Error(
                `batch response missing id: ${String(slot.request.id)}`,
              ),
            )
            continue
          }
          slot.resolve(response)
        }
      })
      .catch((error) => {
        for (const slot of current) slot.reject(error)
      })
  }

  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    const request = parse(requestSchema, {
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method,
      params: get_params(params),
    })
    return new Promise<Response>((resolve, reject) => {
      queue.push({ request, resolve, reject })
      if (queue.length >= max_size) {
        flush()
        return
      }
      if (timer) return
      timer = setTimeout(flush, window_ms)
    })
  }
}

async function post(
  url: string,
  request: Request,
  options: HttpOptions,
): Promise<unknown> {
  const response = await do_fetch(url, request, options)
  return response.json()
}

async function post_batch(
  url: string,
  requests: Request[],
  options: HttpOptions,
): Promise<unknown[]> {
  const response = await do_fetch(url, requests, options)
  const body = await response.json()
  if (!Array.isArray(body)) {
    throw new Error("batch response was not an array")
  }
  return body
}

async function do_fetch(
  url: string,
  body: unknown,
  options: HttpOptions,
): Promise<globalThis.Response> {
  const signal = options.timeout_ms
    ? AbortSignal.timeout(options.timeout_ms)
    : undefined
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal,
  })
  if (!response.ok) {
    throw new Error(
      `http ${response.status}: ${response.statusText}`,
    )
  }
  return response
}

async function with_retry<T>(
  fn: () => Promise<T>,
  retry: HttpRetryOptions | undefined,
): Promise<T> {
  if (!retry || retry.attempts <= 1) return fn()
  const base = retry.base_delay_ms ?? 250
  const max = retry.max_delay_ms ?? 30_000
  let last_error: unknown
  for (let attempt = 0; attempt < retry.attempts; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      last_error = error
      if (attempt === retry.attempts - 1) break
      const delay = Math.min(max, base * 2 ** attempt)
      await sleep(delay)
    }
  }
  throw last_error
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function get_params(
  params?: Parameters,
): unknown[] | undefined {
  if (!params) return undefined
  return Array.isArray(params)
    ? params
    : Object.values(params)
}
