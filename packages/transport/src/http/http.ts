import { Input, any, array, parse, string, tuple, union } from "valibot";
import type {
  Response,
  FailedResponse,
  SuccesfulResponse,
} from "../json-rpc";
import {
  requestSchema,
  responseSchema,
} from "../json-rpc";

export const callSchema = union([tuple([string()]), tuple([string(), array(any())])])
export type Call = Input<typeof callSchema>

export function httpTransport(
  url: string,
): (call: Call) => Promise<FailedResponse | SuccesfulResponse> {
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

