import { parse } from "valibot";
import type { Response } from "../json-rpc";
import { requestSchema, responseSchema } from "../json-rpc";
import { Call } from "../base";

export function httpTransport(
  url: string,
): (call: Call) => Promise<Response> {
  return async function (
    call: Call,
  ): Promise<Response> {
    const [method, params] = call
    const request = parse(requestSchema, { jsonrpc: '2.0', id: generateId(), method, params })
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
      });
    const response = parse(responseSchema, _response)

    return response;
  }
}
export type HttpTransport = ReturnType<typeof httpTransport>;

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

