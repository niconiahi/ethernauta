import * as v from "valibot"

export const SignTransactionRequestSchema = v.object({
  id: v.string(),
  type: v.literal("CRYPTOMAN_SIGN_TRANSACTION"),
  method: v.string(),
  params: v.array(v.unknown()),
})
export type SignTransactionRequest = v.InferOutput<
  typeof ConnectRequestSchema
>

export const SignTransactionResponseSchema = v.object({
  id: v.string(),
  error: v.optional(v.string()),
  signature: v.optional(v.string()),
})
export type SignTransactionResponse = v.InferOutput<
  typeof ConnectRequestSchema
>

const ConnectRequestSchema = v.object({
  id: v.string(),
  type: v.literal("CRYPTOMAN_CONNECT"),
})
export type ConnectRequest = v.InferOutput<
  typeof ConnectRequestSchema
>

export const ConnectResponseSchema = v.object({
  id: v.string(),
  error: v.optional(v.string()),
})
export type ConnectResponse = v.InferOutput<
  typeof ConnectResponseSchema
>

export const RequestSchema = v.union([
  SignTransactionRequestSchema,
  ConnectRequestSchema,
])

export const ResponseSchema = v.union([
  SignTransactionResponseSchema,
  ConnectResponseSchema,
])
