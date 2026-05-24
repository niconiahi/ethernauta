// https://eips.ethereum.org/EIPS/eip-1193
import type {
  Call,
  Http,
  ResolvedSigner,
  Response,
  SignContext,
  Signer,
} from "@ethernauta/transport"
import { SignContextSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  number,
  object,
  optional,
  parse,
  safeParse,
  string,
  unknown,
} from "valibot"

import type { Provider } from "./provider"
import { requestArgumentsSchema } from "./provider"

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
      const parsed = safeParse(providerRpcErrorSchema, error)
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
              parsed.output.message || "User rejected request",
          }
        }
        throw error
      }
    }
    return [signer, context]
  }
}
