import {
  array,
  type InferOutput,
  literal,
  object,
  record,
  string,
  union,
  unknown,
} from "valibot"

export const SignTransactionRequestSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_REQUEST_SIGN_TRANSACTION"),
  method: string(),
  params: union([
    array(unknown()),
    record(string(), unknown()),
  ]),
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

export const EthernautaRequestSchema = union([
  SignTransactionRequestSchema,
  ConnectRequestSchema,
])
export type EthernautaRequest = InferOutput<
  typeof EthernautaRequestSchema
>

export const EthernautaResponseSchema = union([
  SignTransactionResponseSchema,
])
export type EthernautaResponse = InferOutput<
  typeof EthernautaResponseSchema
>

export const EthernautaEventSchema = union([
  EthernautaRequestSchema,
  EthernautaResponseSchema,
])
export type EthernautaEvent = InferOutput<
  typeof EthernautaEventSchema
>
