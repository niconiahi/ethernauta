// https://eips.ethereum.org/EIPS/eip-1193
import type { Provider, RequestArguments } from "@ethernauta/eip/1193"
import { requestArgumentsSchema } from "@ethernauta/eip/1193"
import type { InferOutput } from "valibot"
import {
  custom,
  number,
  object,
  optional,
  parse,
  safeParse,
  string,
  unknown,
} from "valibot"

import type { Call } from "./call"
import type { Http } from "./http"
import type { Response } from "./json-rpc"
import type {
  ReadContext,
  ResolvedReader,
} from "./reader"
import { ReadContextSchema } from "./reader"
import type {
  ResolvedSigner,
  SignContext,
  Signer,
} from "./signer"
import { SignContextSchema } from "./signer"

// Shape of an EIP-1193 ProviderRpcError as it comes back
// from `provider.request` rejection. The runtime shape is
// not standardized as a JS class, only as a property bag —
// so we validate at the boundary instead of trusting the
// thrown value's prototype.
export const providerRpcErrorSchema = object({
  code: number(),
  message: string(),
  data: optional(unknown()),
})
export type ProviderRpcErrorShape = InferOutput<
  typeof providerRpcErrorSchema
>

// EIP-1193 USER_REJECTED_REQUEST. Mirrors
// transport/src/signer.ts ERROR_CODE so the signer
// adapter raises the SAME shape that consumers already
// handle for the native Ethernauta wallet.
const USER_REJECTED_REQUEST = 4001

// Adapt an EIP-1193 provider (window.ethereum, an
// EIP-6963 announce result, etc.) into the Http-shaped
// transport accepted by `create_reader`, `create_writer`,
// and `create_multicall`. Reads, multicalls, logs — all
// flow through the injected wallet's selected RPC.
export function create_injected_transport(
  _provider: Provider,
): Http {
  return async (call: Call): Promise<Response> => {
    const [method, params] = call
    const id = crypto.randomUUID()
    try {
      const result = await _provider.request({
        method,
        params,
      })
      return {
        jsonrpc: "2.0",
        id,
        result,
      }
    } catch (error) {
      const parsed = safeParse(
        providerRpcErrorSchema,
        error,
      )
      if (parsed.success) {
        return {
          jsonrpc: "2.0",
          id,
          error: parsed.output,
        }
      }
      throw error
    }
  }
}

// Adapt an EIP-1193 provider into a Signer resolver so
// existing Signable methods (eth_requestAccounts,
// eth_signTransaction, eth_signTypedData_v4, personal_sign,
// wallet_addEthereumChain, wallet_switchEthereumChain) work
// against an injected wallet exactly like they do against
// the Ethernauta wallet. The signer's return type is `string`
// per the codebase convention — methods that produce arrays
// or objects JSON-encode themselves to fit.
export function create_injected_signer(
  _provider: Provider,
): (_input: SignContext) => ResolvedSigner {
  return (_input: SignContext): ResolvedSigner => {
    const context = parse(SignContextSchema, _input)
    const signer: Signer = async (method, params) => {
      try {
        const result = await _provider.request(
          parse(requestArgumentsSchema, { method, params }),
        )
        if (typeof result === "string") return result
        return JSON.stringify(result)
      } catch (error) {
        const parsed = safeParse(
          providerRpcErrorSchema,
          error,
        )
        if (
          parsed.success &&
          parsed.output.code === USER_REJECTED_REQUEST
        ) {
          throw {
            code: USER_REJECTED_REQUEST,
            message:
              parsed.output.message ||
              "User rejected request",
          }
        }
        throw error
      }
    }
    return [signer, context]
  }
}

// Wrap an EIP-1193 provider (an EIP-6963 announce result,
// window.ethereum, a test mock) into a single Ethernauta
// factory exposing both reader and signer resolvers. The
// wallet picks the RPC for the active chain, so no CHAINS
// list is needed; if the wallet fails to serve a method,
// that surfaces as the wallet's error.
//
//   const provider = create_provider(eip1193)
//   eth_getBalance(addr)(provider.reader({ chain_id }))
//   eth_sendTransaction(tx)(provider.signer({ chain_id }))
export const providerResolverSchema = object({
  reader: custom<(context: ReadContext) => ResolvedReader>(
    (value) => typeof value === "function",
  ),
  signer: custom<(context: SignContext) => ResolvedSigner>(
    (value) => typeof value === "function",
  ),
})
export type ProviderResolver = InferOutput<
  typeof providerResolverSchema
>

export function create_provider(
  provider: Provider,
): ProviderResolver {
  const http = create_injected_transport(provider)
  const signer_factory = create_injected_signer(provider)
  return {
    reader: (context: ReadContext): ResolvedReader => {
      return [[http], parse(ReadContextSchema, context)]
    },
    signer: signer_factory,
  }
}
