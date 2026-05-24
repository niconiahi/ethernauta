import { addressSchema } from "@ethernauta/core"
import {
  array,
  type InferOutput,
  literal,
  object,
  optional,
  parse,
  record,
  string,
  union,
  unknown,
} from "valibot"

import { chainIdSchema } from "./chain/chain-id"

export const SignContextSchema = object({
  chain_id: chainIdSchema,
  to: optional(addressSchema),
})
export type SignContext = InferOutput<
  typeof SignContextSchema
>

/**
 * ABI function signature + parameter display names.
 * `signature` is the canonical Solidity form
 * (`"transfer(address,uint256)"`); `names` is the
 * positional list of input parameter names from the ABI.
 *
 * Travels on the transaction object inside JSON-RPC
 * params as `_ethernauta.function` — a namespaced key
 * strict 1193 wallets (MetaMask, Rabby) silently drop
 * while Ethernauta picks up. The wallet verifies
 * `keccak(signature)[0:4]` matches `input[0:4]` before
 * trusting the names.
 */
export const functionSignatureSchema = object({
  signature: string(),
  names: array(string()),
})
export type FunctionSignature = InferOutput<
  typeof functionSignatureSchema
>

export const ethernautaContextSchema = object({
  function: optional(functionSignatureSchema),
})
export type EthernautaContext = InferOutput<
  typeof ethernautaContextSchema
>

export type Signer = (
  method: string,
  params: unknown,
) => Promise<string>

export type ResolvedSigner = [Signer, SignContext]

export type Signable<T> = (
  _resolved: ResolvedSigner,
) => Promise<T>

const ERROR_CODE = {
  USER_REJECTED_REQUEST: 4001,
} as const

const signTransactionRequestSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_REQUEST_SIGN_TRANSACTION"),
  method: string(),
  chainId: string(),
  params: optional(
    union([array(unknown()), record(string(), unknown())]),
  ),
})
type SignTransactionRequest = InferOutput<
  typeof signTransactionRequestSchema
>

const signTransactionResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION"),
  signed_transaction: string(),
})
type SignTransactionResponse = InferOutput<
  typeof signTransactionResponseSchema
>

const signTypedDataResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_SIGNED_TYPED_DATA"),
  signature: string(),
})
type SignTypedDataResponse = InferOutput<
  typeof signTypedDataResponseSchema
>

const transactionRejectedResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED"),
})
type TransactionRejectedResponse = InferOutput<
  typeof transactionRejectedResponseSchema
>

const nativeExtensionCloseResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE"),
})
type NativeExtensionCloseResponse = InferOutput<
  typeof nativeExtensionCloseResponseSchema
>

export function create_signer(
  chains: Array<{ chainId: string; transports?: unknown }>,
): (_input: SignContext) => ResolvedSigner {
  return (_input: SignContext): ResolvedSigner => {
    const sign_context = parse(SignContextSchema, _input)
    const chain = chains.find(
      (c) => c.chainId === sign_context.chain_id,
    )
    if (!chain) {
      throw new Error(
        `no chain configured for: ${sign_context.chain_id}`,
      )
    }
    const signer: Signer = (method, params) =>
      new Promise((resolve, reject) => {
        const id = crypto.randomUUID()
        window.addEventListener(
          "message",
          function handler(
            event: MessageEvent<
              | SignTransactionResponse
              | SignTypedDataResponse
              | TransactionRejectedResponse
              | NativeExtensionCloseResponse
            >,
          ) {
            if (
              !event.data.type.startsWith(
                "ETHERNAUTA_RESPONSE",
              ) ||
              event.data.id !== id
            )
              return
            window.removeEventListener("message", handler)
            if (
              event.data.type ===
              "ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED"
            ) {
              reject({
                code: ERROR_CODE.USER_REJECTED_REQUEST,
                message: "User rejected request",
              })
              return
            }
            if (
              event.data.type ===
              "ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE"
            ) {
              reject({
                code: ERROR_CODE.USER_REJECTED_REQUEST,
                message: "Extension closed",
              })
              return
            }
            if (
              event.data.type ===
              "ETHERNAUTA_RESPONSE_SIGNED_TYPED_DATA"
            ) {
              resolve(event.data.signature)
              return
            }
            resolve(
              (event.data as SignTransactionResponse)
                .signed_transaction,
            )
          },
        )
        const request: SignTransactionRequest = {
          type: "ETHERNAUTA_REQUEST_SIGN_TRANSACTION",
          id,
          method,
          chainId: sign_context.chain_id,
          params: params as unknown[],
        }
        window.postMessage(request, window.location.origin)
      })
    return [signer, sign_context]
  }
}
