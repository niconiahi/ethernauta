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

export const TransactionRejectedResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED"),
})
export type TransactionRejectedResponse = InferOutput<
  typeof TransactionRejectedResponseSchema
>

export const NativeExtensionCloseResponseSchema = object({
  id: string(),
  type: literal(
    "ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE",
  ),
})
export type NativeExtensionCloseResponse = InferOutput<
  typeof NativeExtensionCloseResponseSchema
>

export const EthernautaResponseSchema = union([
  SignTransactionResponseSchema,
  TransactionRejectedResponseSchema,
  NativeExtensionCloseResponseSchema,
])
export type EthernautaResponse = InferOutput<
  typeof EthernautaResponseSchema
>

const PopupReadySchema = object({
  type: literal("ETHERNAUTA_POPUP_READY"),
})
export type PopupReady = InferOutput<
  typeof PopupReadySchema
>

export const EthernautaEventSchema = union([
  EthernautaRequestSchema,
  EthernautaResponseSchema,
  PopupReadySchema,
])
export type EthernautaEvent = InferOutput<
  typeof EthernautaEventSchema
>
