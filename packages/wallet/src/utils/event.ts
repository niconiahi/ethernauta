import * as v from "valibot"

export const SignTransactionRequestSchema = v.object({
  id: v.string(),
  type: v.literal("ETHERNAUTA_REQUEST_SIGN_TRANSACTION"),
  method: v.string(),
  params: v.array(v.unknown()),
})
export type SignTransactionRequest = v.InferOutput<
  typeof SignTransactionRequestSchema
>

export const SignTransactionResponseSchema = v.object({
  id: v.string(),
  type: v.literal("ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION"),
  signed_transaction: v.string(),
})
export type SignTransactionResponse = v.InferOutput<
  typeof SignTransactionResponseSchema
>

const ConnectRequestSchema = v.object({
  id: v.string(),
  type: v.literal("ETHERNAUTA_REQUEST_CONNECT"),
})
export type ConnectRequest = v.InferOutput<
  typeof ConnectRequestSchema
>

export const CryptomanRequestSchema = v.union([
  SignTransactionRequestSchema,
  ConnectRequestSchema,
])
export type CryptomanRequest = v.InferOutput<
  typeof CryptomanRequestSchema
>

export const CryptomanResponseSchema = v.union([
  SignTransactionResponseSchema,
])
export type CryptomanResponse = v.InferOutput<
  typeof CryptomanResponseSchema
>

export const CryptomanEventSchema = v.union([
  CryptomanRequestSchema,
  CryptomanResponseSchema,
])
export type CryptomanEvent = v.InferOutput<
  typeof CryptomanEventSchema
>
