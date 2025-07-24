import { parse } from "valibot"

import type { Call } from "../base"
import type { Parameters, Response } from "../json-rpc"
import { requestSchema, responseSchema } from "../json-rpc"

export function http(
  url: string,
): (_call: Call) => Promise<Response> {
  return async function (
    call: Call,
  ): Promise<Response> {
    const [method, params] = call
    const request = parse(requestSchema, {
      jsonrpc: "2.0",
      id: generateId(),
      method,
      params: getParams(params),
    })
    const _response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
      // maybe adding abort signal
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
export type Http = ReturnType<typeof http>

function getParams(params?: Parameters): unknown[] | undefined {
  if (!params) {
    return undefined
  }

  return Array.isArray(params) ? params : Object.values(params)
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
