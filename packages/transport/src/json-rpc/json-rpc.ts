import type {
  Input,
} from 'valibot'
import {
  array,
  excludes,
  literal,
  null_,
  number,
  object,
  optional,
  record,
  string,
  union,
  unknown,
} from 'valibot'

// https://www.jsonrpc.org/specification#extensions
export const methodSchema = string([excludes('rpc.', 'method names that begin with "rpc." are reserved for system extensions')])

// https://www.jsonrpc.org/specification#parameter_structures
export const parametersSchema = union([array(unknown()), record(unknown())])
export type Parameters = Input<typeof parametersSchema>

export const idSchema = union([string(), number(), null_()])
export type Id = Input<typeof idSchema>

// https://www.jsonrpc.org/specification#request_object
export const requestSchema = object({
  jsonrpc: literal('2.0'),
  method: methodSchema,
  params: optional(parametersSchema),
  id: idSchema,
})
export type Request = Input<typeof requestSchema>

// https://www.jsonrpc.org/specification#notification
const notificationSchema = object({
  jsonrpc: literal('2.0'),
  method: methodSchema,
  params: optional(parametersSchema),
})
export type Notification = Input<typeof notificationSchema>

// https://www.jsonrpc.org/specification#error_object
const errorSchema = object({
  data: optional(unknown()),
  message: string(),
  code: union([
    literal(-32700),
    literal(-32701),
    literal(-32702),
    literal(-32600),
    literal(-32601),
    literal(-32602),
    literal(-32603),
    literal(-32500),
    literal(-32400),
    literal(-32300),
  ]),
})

// https://www.jsonrpc.org/specification#response_object
const failedResponseSchema = object({
  id: idSchema,
  jsonrpc: literal('2.0'),
  error: errorSchema,
})
export type FailedResponse = Input<typeof failedResponseSchema>

const succesfulResponseSchema = object({
  id: idSchema,
  jsonrpc: literal('2.0'),
  result: unknown(),
})
export type SuccesfulResponse = Input<typeof succesfulResponseSchema>

export const responseSchema = union([
  failedResponseSchema,
  succesfulResponseSchema,
])
export type Response = Input<typeof responseSchema>

// https://www.jsonrpc.org/specification#notification
export function runJsonRpcNotification(
  // eslint-disable-next-line unused-imports/no-unused-vars
  notification: Notification,
): FailedResponse | SuccesfulResponse {
  const successful: SuccesfulResponse = {
    id: 'some-id',
    jsonrpc: '2.0',
    result: 'something',
  }

  return successful
}

// https://www.jsonrpc.org/specification#batch
export function runJsonRpcBatch(
  // eslint-disable-next-line unused-imports/no-unused-vars
  batch: (Request | Notification)[],
): (FailedResponse | SuccesfulResponse)[] | FailedResponse {
  const successful: SuccesfulResponse = {
    id: 'some-id',
    jsonrpc: '2.0',
    result: 'something',
  }
  const error: FailedResponse = {
    id: 'some-id',
    jsonrpc: '2.0',
    error: {
      code: -32600,
      message: 'omg',
      data: '_omg',
    },
  }
  // align the order of the responses with the requests, based on the "id" used

  return [successful, error]
}
