import { Input, any, array, parse, string, tuple, union } from "valibot";
import { jsonRpcRequestSchema, type JsonRpcFailedResponse, type JsonRpcSuccesfulResponse, JsonRpcResponse, jsonRpcResponseSchema } from "@ethernauta/core";

const callSchema = union([tuple([string()]), tuple([string(), array(any())])])
export type Call = Input<typeof callSchema>

export function httpTransport(
  url: string,
): (call: Call) => Promise<JsonRpcFailedResponse | JsonRpcSuccesfulResponse> {
  return async function (
    call: Call,
  ): Promise<JsonRpcResponse> {
    const [method, params] = call
    const jsonRpcRequest = parse(jsonRpcRequestSchema, { jsonrpc: '2.0', id: generateId(), method, params })
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(jsonRpcRequest),
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
