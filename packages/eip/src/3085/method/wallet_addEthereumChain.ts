// https://eips.ethereum.org/EIPS/eip-3085

import { uintSchema } from "@ethernauta/core"
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

export const addEthereumChainParameterSchema = object({
  chainId: uintSchema,
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
  typeof addEthereumChainParameterSchema
>

export const addEthereumChainParametersSchema = tuple([
  addEthereumChainParameterSchema,
])
export type AddEthereumChainParameters = InferOutput<
  typeof addEthereumChainParametersSchema
>

export function wallet_addEthereumChain(
  _parameters: AddEthereumChainParameters,
): Signable<null> {
  return async ([signer]: ResolvedSigner) => {
    await signer("wallet_addEthereumChain", _parameters)
    return null
  }
}
