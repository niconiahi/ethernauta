// https://eips.ethereum.org/EIPS/eip-1014

import {
  type Address,
  AddressSchema,
  UintSchema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
  rlp_encode,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import type { InferOutput } from "valibot"
import { bigint, object, parse, union } from "valibot"

export const GetContractAddressParametersSchema = object({
  from: AddressSchema,
  nonce: union([UintSchema, bigint()]),
})
export type GetContractAddressParameters = InferOutput<
  typeof GetContractAddressParametersSchema
>

// CREATE address: keccak256(rlp([sender, nonce]))[12:].
// Ships with EIP-1014 because they are the deploy-address
// derivation pair (CREATE vs CREATE2).
export function get_contract_address(
  _parameters: GetContractAddressParameters,
): Address {
  const parameters = parse(
    GetContractAddressParametersSchema,
    _parameters,
  )
  const sender = hex_to_bytes(parameters.from)
  const nonce =
    typeof parameters.nonce === "bigint"
      ? parameters.nonce
      : BigInt(parameters.nonce)
  const encoded = rlp_encode([sender, nonce])
  const digest = keccak_256(encoded)
  return parse(
    AddressSchema,
    bytes_to_hex(digest.slice(12)),
  )
}
