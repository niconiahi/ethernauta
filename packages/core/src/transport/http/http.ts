import { Input, array, literal, number, object, optional, record, string, union, unknown, keyof, includes } from "valibot";
import type { JsonRpcCall } from "../../provider";

// https://www.jsonrpc.org/specification#parameter_structures
const jsonRpcSchema = union([array(unknown()), record(unknown())])
type JsonRpcParameters = Input<typeof jsonRpcSchema>;
// https://www.jsonrpc.org/specification#request_object
const jsonRpcRequest = object({
  jsonrpc: literal('2.0'),
  method: string(),
  params: optional(jsonRpcSchema),
  id: union([string(), number()])
})
type JsonRpcRequest = Input<typeof jsonRpcRequest>
// https://www.jsonrpc.org/specification#notification
const jsonRpcNotification = object({
  jsonrpc: literal('2.0'),
  method: string(),
  params: optional(jsonRpcSchema),
})
type JsonRpcNotification = Input<typeof jsonRpcNotification>
// https://www.jsonrpc.org/specification#error_object
const jsonRpcResponseError = object({
  data: optional(unknown()),
  message: string(),
  code: union([
    literal(32700),
    literal(32701),
    literal(32702),
    literal(32600),
    literal(32601),
    literal(32602),
    literal(32603),
    literal(32500),
    literal(32400),
    literal(32300)
  ]),
})
// https://www.jsonrpc.org/specification#response_object
const jsonRpcFailedResponse = object({
  jsonrpc: literal('2.0'),
  error: jsonRpcResponseError
})
type JsonRpcFailedResponse = Input<typeof jsonRpcFailedResponse>
const jsonRpcSuccesfulResponse = object({
  jsonrpc: literal('2.0'),
  result: unknown()
})
type JsonRpcSuccesfulResponse = Input<typeof jsonRpcSuccesfulResponse>
const methodNameSchema = includes("rpc.")
export function httpTransport(
  url: string,
): (call: JsonRpcCall) => Promise<JsonRpcFailedResponse | JsonRpcSuccesfulResponse> {
  async function transport(
    call: JsonRpcCall,
  ): Promise<JsonRpcFailedResponse | JsonRpcSuccesfulResponse> {
    const [method, params] = call

    methodNameSchema._parse(method)

    const request: JsonRpcRequest = {jsonrpc: '2.0', id: 'SOME_RANDOM_GENERATED_ID',method, params}
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json()) as unknown as JsonRpcSuccesfulResponse;

    return response;
  }

  return transport;
}
export type HttpTransport = ReturnType<typeof httpTransport>;

// https://www.jsonrpc.org/specification#extensions

// // https://www.jsonrpc.org/specification#request_object
// function runJsonRpcRequest(
//   request: JsonRpcRequest,
// ): JsonRpcFailedResponse | JsonRpcSuccesfulResponse {
//   validateMethodName(request.method);

//   const successful: JsonRpcSuccesfulResponse = {
//     jsonrpc: "2.0",
//     result: "something",
//   };

//   return successful;
// }
// // https://www.jsonrpc.org/specification#notification
// function runJsonRpcNotification(
//   notification: JsonRpcNotification,
// ): JsonRpcFailedResponse | JsonRpcSuccesfulResponse {
//   validateMethodName(notification.method);

//   const successful: JsonRpcSuccesfulResponse = {
//     jsonrpc: "2.0",
//     result: "something",
//   };

//   return successful;
// }

// // https://www.jsonrpc.org/specification#batch
// function runJsonRpcBatch(
//   batch: (JsonRpcRequest | JsonRpcNotification)[],
// ): (JsonRpcFailedResponse | JsonRpcSuccesfulResponse)[] | JsonRpcFailedResponse {
//   batch.every((call) => validateMethodName(call.method));

//   const successful: JsonRpcSuccesfulResponse = {
//     jsonrpc: "2.0",
//     result: "something",
//   };
//   const error: JsonRpcFailedResponse = {
//     jsonrpc: "2.0",
//     error: {
//       code: 32600,
//       message: "omg",
//       data: "some extra data",
//     },
//   };

//   return [successful, error];
// }
