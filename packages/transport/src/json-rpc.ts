import type { InferOutput } from "valibot"
import {
  array,
  excludes,
  literal,
  null_,
  number,
  object,
  optional,
  pipe,
  record,
  string,
  union,
  unknown,
} from "valibot"

// https://www.jsonrpc.org/specification#extensions
export const MethodSchema = pipe(
  string(),
  excludes(
    "rpc.",
    'method names that begin with "rpc." are reserved for system extensions',
  ),
)

// https://www.jsonrpc.org/specification#parameter_structures
export const ParametersSchema = union([
  array(unknown()),
  record(string(), unknown()),
])
export type Parameters = InferOutput<
  typeof ParametersSchema
>

export const IdSchema = union([string(), number(), null_()])
export type Id = InferOutput<typeof IdSchema>

// https://www.jsonrpc.org/specification#request_object
export const RequestSchema = object({
  jsonrpc: literal("2.0"),
  method: MethodSchema,
  params: optional(ParametersSchema),
  id: IdSchema,
})
export type Request = InferOutput<typeof RequestSchema>

// https://www.jsonrpc.org/specification#notification
const NotificationSchema = object({
  jsonrpc: literal("2.0"),
  method: MethodSchema,
  params: optional(ParametersSchema),
})
export type Notification = InferOutput<
  typeof NotificationSchema
>

// https://www.jsonrpc.org/specification#error_object
//
// JSON-RPC 2.0 reserves -32768..-32000 for transport / protocol
// errors (parse, invalid request, method not found, …). EIP-1193
// adds the wallet-side codes 4001 / 4100 / 4200 / 4900 / 4901,
// which the injected-provider adapter forwards verbatim. Validate
// `code` as `number` rather than enumerating literals — any code
// outside that range is still a real JSON-RPC error response and
// shouldn't be coerced into a different one to satisfy the schema.
const ErrorSchema = object({
  data: optional(unknown()),
  message: string(),
  code: number(),
})

// https://www.jsonrpc.org/specification#response_object
const FailedResponseSchema = object({
  id: IdSchema,
  jsonrpc: literal("2.0"),
  error: ErrorSchema,
})
export type FailedResponse = InferOutput<
  typeof FailedResponseSchema
>

const SuccesfulResponseSchema = object({
  id: IdSchema,
  jsonrpc: literal("2.0"),
  result: unknown(),
})
export type SuccesfulResponse = InferOutput<
  typeof SuccesfulResponseSchema
>

export const ResponseSchema = union([
  FailedResponseSchema,
  SuccesfulResponseSchema,
])
export type Response = InferOutput<typeof ResponseSchema>
