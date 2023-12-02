/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Input,
  array,
  literal,
  number,
  object,
  optional,
  record,
  string,
  union,
  unknown,
  excludes,
  null_,
  undefined_,
  variant,
} from "valibot";

// https://www.jsonrpc.org/specification#extensions
const methodSchema = string([excludes('rpc.', 'method names that begin with "rpc." are reserved for system extensions')])
// https://www.jsonrpc.org/specification#parameter_structures
const jsonRpcSchema = union([array(unknown()), record(unknown())])
export type JsonRpcParameters = Input<typeof jsonRpcSchema>;
// https://www.jsonrpc.org/specification#request_object
export const jsonRpcRequestSchema = object({
  jsonrpc: literal('2.0'),
  method: methodSchema,
  params: optional(jsonRpcSchema),
  id: union([string(), number(), null_()])
})
export type JsonRpcRequest = Input<typeof jsonRpcRequestSchema>
// https://www.jsonrpc.org/specification#notification
const jsonRpcNotificationSchema = object({
  jsonrpc: literal('2.0'),
  method: methodSchema,
  params: optional(jsonRpcSchema),
})
export type JsonRpcNotification = Input<typeof jsonRpcNotificationSchema>
// https://www.jsonrpc.org/specification#error_object
const jsonRpcResponseErrorSchema = object({
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
const jsonRpcFailedResponseSchema = object({
  jsonrpc: literal('2.0'),
  result: undefined_(),
  error: jsonRpcResponseErrorSchema
})
export type JsonRpcFailedResponse = Input<typeof jsonRpcFailedResponseSchema>
const jsonRpcSuccesfulResponse = object({
  jsonrpc: literal('2.0'),
  result: unknown(),
  error: undefined_(),
})
export type JsonRpcSuccesfulResponse = Input<typeof jsonRpcSuccesfulResponse>
export const jsonRpcResponseSchema = variant('jsonrpc', [
  jsonRpcSuccesfulResponse,
  jsonRpcFailedResponseSchema
])
export type JsonRpcResponse = Input<typeof jsonRpcResponseSchema>
// https://www.jsonrpc.org/specification#request_object
export function runJsonRpcRequest(
  request: JsonRpcRequest,
): JsonRpcFailedResponse | JsonRpcSuccesfulResponse {
  const successful: JsonRpcSuccesfulResponse = {
    jsonrpc: "2.0",
    result: "something",
  };

  return successful;
}
// https://www.jsonrpc.org/specification#notification
export function runJsonRpcNotification(
  notification: JsonRpcNotification,
): JsonRpcFailedResponse | JsonRpcSuccesfulResponse {
  const successful: JsonRpcSuccesfulResponse = {
    jsonrpc: "2.0",
    result: "something",
  };

  return successful;
}
// https://www.jsonrpc.org/specification#batch
export function runJsonRpcBatch(
  batch: (JsonRpcRequest | JsonRpcNotification)[],
): (JsonRpcFailedResponse | JsonRpcSuccesfulResponse)[] | JsonRpcFailedResponse {
  const successful: JsonRpcSuccesfulResponse = {
    jsonrpc: "2.0",
    result: "something",
  };
  const error: JsonRpcFailedResponse = {
    jsonrpc: "2.0",
    error: {
      code: 32600,
      message: "omg",
      data: "_omg",
    },
  };
  // align the order of the responses with the requests, based on the "id" used

  return [successful, error];
}
