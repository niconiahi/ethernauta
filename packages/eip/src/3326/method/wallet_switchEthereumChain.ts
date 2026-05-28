// https://eips.ethereum.org/EIPS/eip-3326

import { UintSchema } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { type InferOutput, object, tuple } from "valibot"

export const SwitchEthereumChainParameterSchema = object({
  chainId: UintSchema,
})
export type SwitchEthereumChainParameter = InferOutput<
  typeof SwitchEthereumChainParameterSchema
>

export const SwitchEthereumChainParametersSchema = tuple([
  SwitchEthereumChainParameterSchema,
])
export type SwitchEthereumChainParameters = InferOutput<
  typeof SwitchEthereumChainParametersSchema
>

export function wallet_switchEthereumChain(
  _parameters: SwitchEthereumChainParameters,
): Signable<null> {
  return async ([signer]: ResolvedSigner) => {
    await signer("wallet_switchEthereumChain", _parameters)
    return null
  }
}
