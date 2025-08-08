import {
  array,
  literal,
  object,
  string,
  union,
  unknown,
  type InferOutput,
} from "valibot"

export const SignTransactionRequestSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_REQUEST_SIGN_TRANSACTION"),
  method: string(),
  params: array(unknown()),
})
export type SignTransactionRequest = InferOutput<
  typeof SignTransactionRequestSchema
>

export const SignTransactionResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION"),
  signed_transaction: string(),
})
export type SignTransactionResponse = InferOutput<
  typeof SignTransactionResponseSchema
>

const ConnectRequestSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_REQUEST_CONNECT"),
})
export type ConnectRequest = InferOutput<
  typeof ConnectRequestSchema
>

export const CryptomanRequestSchema = union([
  SignTransactionRequestSchema,
  ConnectRequestSchema,
])
export type CryptomanRequest = InferOutput<
  typeof CryptomanRequestSchema
>

export const CryptomanResponseSchema = union([
  SignTransactionResponseSchema,
])
export type CryptomanResponse = InferOutput<
  typeof CryptomanResponseSchema
>

export const CryptomanEventSchema = union([
  CryptomanRequestSchema,
  CryptomanResponseSchema,
])
export type CryptomanEvent = InferOutput<
  typeof CryptomanEventSchema
>
