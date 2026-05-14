import type { InferOutput } from "valibot"
import {
  array,
  object,
  optional,
  parse,
  string,
} from "valibot"

import { addressSchema } from "./chain/address"
import { chainIdSchema } from "./chain/chain-id"

export const SignContextSchema = object({
  chain_id: chainIdSchema,
  to: optional(addressSchema),
})
export type SignContext = InferOutput<
  typeof SignContextSchema
>

/**
 * Sidecar metadata describing the ABI function being
 * invoked by a transaction's `input`. Travels on the
 * ethernauta transport envelope (NOT the JSON-RPC params),
 * so the standard transaction object stays spec-compliant.
 * Verified by the wallet via keccak(signature)[0:4] match
 * against input[0:4]. `names` are display-only.
 */
export const functionSidecarSchema = object({
  signature: string(),
  names: array(string()),
})
export type FunctionSidecar = InferOutput<
  typeof functionSidecarSchema
>

export type SignerContext = {
  _function?: FunctionSidecar
}

export type Signer = (
  method: string,
  params: unknown,
  context?: SignerContext,
) => Promise<string>

export type ResolvedSigner = [Signer, SignContext]

export type Signable<T> = (
  _resolved: ResolvedSigner,
) => Promise<T>

const ERROR_CODE = {
  USER_REJECTED_REQUEST: 4001,
} as const

type SignTransactionRequest = {
  id: string
  type: "ETHERNAUTA_REQUEST_SIGN_TRANSACTION"
  method: string
  chainId: string
  params?: unknown[] | Record<string, unknown>
  _function?: FunctionSidecar
}

type SignTransactionResponse = {
  id: string
  type: "ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION"
  signed_transaction: string
}

type TransactionRejectedResponse = {
  id: string
  type: "ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED"
}

type NativeExtensionCloseResponse = {
  id: string
  type: "ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE"
}

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
    const signer: Signer = (method, params, context) =>
      new Promise((resolve, reject) => {
        const id = crypto.randomUUID()
        window.addEventListener(
          "message",
          function handler(
            event: MessageEvent<
              | SignTransactionResponse
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
          _function: context?._function,
        }
        window.postMessage(request, window.location.origin)
      })
    return [signer, sign_context]
  }
}
