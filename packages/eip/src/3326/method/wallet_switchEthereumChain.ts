// https://eips.ethereum.org/EIPS/eip-3326

import { uintSchema } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { type InferOutput, object, tuple } from "valibot"

export const switchEthereumChainParameterSchema = object({
  chainId: uintSchema,
})
export type SwitchEthereumChainParameter = InferOutput<
  typeof switchEthereumChainParameterSchema
>

export const switchEthereumChainParametersSchema = tuple([
  switchEthereumChainParameterSchema,
])
export type SwitchEthereumChainParameters = InferOutput<
  typeof switchEthereumChainParametersSchema
>

export function wallet_switchEthereumChain(
  _parameters: SwitchEthereumChainParameters,
): Signable<null> {
  return async ([signer]: ResolvedSigner) => {
    await signer("wallet_switchEthereumChain", _parameters)
    return null
  }
}
