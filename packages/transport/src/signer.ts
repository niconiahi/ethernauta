import { AddressSchema, UintSchema } from "@ethernauta/core"
import {
  array,
  type InferOutput,
  object,
  optional,
  string,
} from "valibot"

import { ChainIdSchema } from "./chain/chain-id"

// `value` rides on the context (not on per-call params) because
// it's a transaction-envelope field, not a Solidity-ABI argument.
// Thin Signable bindings for payable contract methods route it
// into the `eth_signTransaction` envelope's `value` field; the
// codegen defaults it to `0x0` for non-payable methods to match
// the on-chain `payable` rule.
export const SignContextSchema = object({
  chain_id: ChainIdSchema,
  to: optional(AddressSchema),
  value: optional(UintSchema),
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
export const FunctionSignatureSchema = object({
  signature: string(),
  names: array(string()),
})
export type FunctionSignature = InferOutput<
  typeof FunctionSignatureSchema
>

export const EthernautaContextSchema = object({
  function: optional(FunctionSignatureSchema),
})
export type EthernautaContext = InferOutput<
  typeof EthernautaContextSchema
>

export type Signer = (
  method: string,
  params: unknown,
) => Promise<string>

export type ResolvedSigner = [Signer, SignContext]

export type Signable<T> = (
  _resolved: ResolvedSigner,
) => Promise<T>
