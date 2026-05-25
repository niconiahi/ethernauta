import { addressSchema } from "@ethernauta/core"
import {
  array,
  type InferOutput,
  literal,
  object,
  optional,
  parse,
  record,
  safeParse,
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

const signTransactionResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_SIGNED_TRANSACTION"),
  signed_transaction: string(),
})

const signTypedDataResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_SIGNED_TYPED_DATA"),
  signature: string(),
})

const transactionRejectedResponseSchema = object({
  id: string(),
  type: literal("ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED"),
})

const nativeExtensionCloseResponseSchema = object({
  id: string(),
  type: literal(
    "ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE",
  ),
})

const signerResponseSchema = union([
  signTransactionResponseSchema,
  signTypedDataResponseSchema,
  transactionRejectedResponseSchema,
  nativeExtensionCloseResponseSchema,
])

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
          function handler(event) {
            const parsed = safeParse(
              signerResponseSchema,
              event.data,
            )
            if (!parsed.success) return
            const data = parsed.output
            if (data.id !== id) return
            window.removeEventListener("message", handler)
            if (
              data.type ===
              "ETHERNAUTA_RESPONSE_TRANSACTION_REJECTED"
            ) {
              reject({
                code: ERROR_CODE.USER_REJECTED_REQUEST,
                message: "User rejected request",
              })
              return
            }
            if (
              data.type ===
              "ETHERNAUTA_RESPONSE_NATIVE_EXTENSION_CLOSE"
            ) {
              reject({
                code: ERROR_CODE.USER_REJECTED_REQUEST,
                message: "Extension closed",
              })
              return
            }
            if (
              data.type ===
              "ETHERNAUTA_RESPONSE_SIGNED_TYPED_DATA"
            ) {
              resolve(data.signature)
              return
            }
            resolve(data.signed_transaction)
          },
        )
        const request = parse(
          signTransactionRequestSchema,
          {
            type: "ETHERNAUTA_REQUEST_SIGN_TRANSACTION",
            id,
            method,
            chainId: sign_context.chain_id,
            params,
          },
        )
        window.postMessage(request, window.location.origin)
      })
    return [signer, sign_context]
  }
}
