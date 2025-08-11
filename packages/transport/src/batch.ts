import { parse } from "valibot"

import type { Call } from "./call"
import type { Parameters, Response } from "./json-rpc"
import { requestSchema, responseSchema } from "./json-rpc"

export function batch(
  url: string,
): (_calls: Call[]) => Promise<Response> {
  return async (calls: Call[]): Promise<Response> => {
    const requests = calls.map(([method, params]) => {
      return parse(requestSchema, {
        jsonrpc: "2.0",
        id: crypto.randomUUID(),
        method,
        params: getParams(params),
      })
    })
    const _response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requests),
      // TODO: add abort signal
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json()
      })
      .catch((error) => {
        throw new Error(error)
      })
    const response = parse(responseSchema, _response)
    return response
  }
}
export type Batch = ReturnType<typeof batch>

function getParams(
  params?: Parameters,
): unknown[] | undefined {
  if (!params) {
    return undefined
  }
  return Array.isArray(params)
    ? params
    : Object.values(params)
}
