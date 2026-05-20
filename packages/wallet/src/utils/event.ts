import {
  array,
  type InferOutput,
  literal,
  object,
  optional,
  record,
  string,
  union,
  unknown,
} from "valibot"

export {
  type FunctionSignature,
  functionSignatureSchema,
} from "@ethernauta/transport"

export const SignTransactionRequestSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_REQUEST_SIGN_TRANSACTION"),
  method: string(),
  chainId: string(),
  to: optional(string()),
  params: optional(
    union([array(unknown()), record(string(), unknown())]),
  ),
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

export const SignTypedDataResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_SIGNED_TYPED_DATA"),
  signature: string(),
})
export type SignTypedDataResponse = InferOutput<
  typeof SignTypedDataResponseSchema
>

export const PersonalSignResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_PERSONAL_SIGNED"),
  signature: string(),
})
export type PersonalSignResponse = InferOutput<
  typeof PersonalSignResponseSchema
>

export const AddChainApprovedResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_ADD_CHAIN_APPROVED"),
})
export type AddChainApprovedResponse = InferOutput<
  typeof AddChainApprovedResponseSchema
>

export const EthernautaRequestSchema =
  SignTransactionRequestSchema
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
  SignTypedDataResponseSchema,
  PersonalSignResponseSchema,
  AddChainApprovedResponseSchema,
  TransactionRejectedResponseSchema,
  NativeExtensionCloseResponseSchema,
])
export type EthernautaResponse = InferOutput<
  typeof EthernautaResponseSchema
>

export const PopupReadyNotificationSchema = object({
  type: literal("ETHERNAUTA_NOTIFICATION_POPUP_READY"),
})
export type PopupReadyNotification = InferOutput<
  typeof PopupReadyNotificationSchema
>

export const ChainSelectedNotificationSchema = object({
  type: literal("ETHERNAUTA_NOTIFICATION_CHAIN_SELECTED"),
  chainId: string(),
})
export type ChainSelectedNotification = InferOutput<
  typeof ChainSelectedNotificationSchema
>

export const EthernautaNotificationSchema = union([
  PopupReadyNotificationSchema,
  ChainSelectedNotificationSchema,
])
export type EthernautaNotification = InferOutput<
  typeof EthernautaNotificationSchema
>

export const EthernautaEventSchema = union([
  EthernautaRequestSchema,
  EthernautaResponseSchema,
  EthernautaNotificationSchema,
])
export type EthernautaEvent = InferOutput<
  typeof EthernautaEventSchema
>
