// https://eips.ethereum.org/EIPS/eip-1014

import {
  type Address,
  addressSchema,
  bytes32Schema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

export const getCreate2AddressParametersSchema = object({
  from: addressSchema,
  salt: bytes32Schema,
  bytecodeHash: bytes32Schema,
})
export type GetCreate2AddressParameters = InferOutput<
  typeof getCreate2AddressParametersSchema
>

// CREATE2: keccak256(0xff ‖ from ‖ salt ‖ keccak256(init_code))[12:].
export function get_create2_address(
  _parameters: GetCreate2AddressParameters,
): Address {
  const parameters = parse(
    getCreate2AddressParametersSchema,
    _parameters,
  )
  const from_bytes = hex_to_bytes(parameters.from)
  const salt_bytes = hex_to_bytes(parameters.salt)
  const code_hash = hex_to_bytes(parameters.bytecodeHash)
  const buf = new Uint8Array(1 + 20 + 32 + 32)
  buf[0] = 0xff
  buf.set(from_bytes, 1)
  buf.set(salt_bytes, 21)
  buf.set(code_hash, 53)
  const digest = keccak_256(buf)
  return parse(
    addressSchema,
    bytes_to_hex(digest.slice(12)),
  )
}
