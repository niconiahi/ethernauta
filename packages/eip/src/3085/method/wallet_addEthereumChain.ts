// https://eips.ethereum.org/EIPS/eip-3085

import { UintSchema } from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import {
  array,
  type InferOutput,
  number,
  object,
  optional,
  pipe,
  string,
  tuple,
  url,
} from "valibot"

export const AddEthereumChainParameterSchema = object({
  chainId: UintSchema,
  chainName: string(),
  nativeCurrency: object({
    name: string(),
    symbol: string(),
    decimals: number(),
  }),
  rpcUrls: array(pipe(string(), url())),
  blockExplorerUrls: optional(array(pipe(string(), url()))),
  iconUrls: optional(array(pipe(string(), url()))),
})
export type AddEthereumChainParameter = InferOutput<
  typeof AddEthereumChainParameterSchema
>

export const AddEthereumChainParametersSchema = tuple([
  AddEthereumChainParameterSchema,
])
export type AddEthereumChainParameters = InferOutput<
  typeof AddEthereumChainParametersSchema
>

export function wallet_addEthereumChain(
  _parameters: AddEthereumChainParameters,
): Signable<null> {
  return async ([signer]: ResolvedSigner) => {
    await signer("wallet_addEthereumChain", _parameters)
    return null
  }
}
