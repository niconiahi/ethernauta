import { parse } from "valibot";
import { jsonRpcRequestSchema, type JsonRpcCall, type JsonRpcFailedResponse, type JsonRpcSuccesfulResponse, JsonRpcResponse, jsonRpcResponseSchema } from "../../provider";

export function httpTransport(
  url: string,
): (call: JsonRpcCall) => Promise<JsonRpcFailedResponse | JsonRpcSuccesfulResponse> {
  return async function (
    call: JsonRpcCall,
  ): Promise<JsonRpcResponse> {
    const [method, params] = call
    const request = parse(jsonRpcRequestSchema, { jsonrpc: '2.0', id: generateId(), method, params })
    const response = await fetch(url, {
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

    const jsonRpcResponse = parse(jsonRpcResponseSchema, response)
    return jsonRpcResponse;
  }
}
export type HttpTransport = ReturnType<typeof httpTransport>;

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
