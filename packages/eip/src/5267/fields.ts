// https://eips.ethereum.org/EIPS/eip-5267
//
// `fields` is a 5-bit bitmap encoded in a `bytes1`. Bit `i`
// (counting from 0) is set iff the i-th member of the
// EIP-712 domain separator is present:
//   bit 0 → name
//   bit 1 → version
//   bit 2 → chainId
//   bit 3 → verifyingContract
//   bit 4 → salt
//
// Bits 5–7 are reserved and must be zero per the spec.

import { ByteSchema } from "@ethernauta/core"
import {
  boolean,
  type InferOutput,
  object,
  parse,
} from "valibot"

export const FIELD_NAME = 0b00001
export const FIELD_VERSION = 0b00010
export const FIELD_CHAIN_ID = 0b00100
export const FIELD_VERIFYING_CONTRACT = 0b01000
export const FIELD_SALT = 0b10000

export const DomainFieldsSchema = object({
  name: boolean(),
  version: boolean(),
  chainId: boolean(),
  verifyingContract: boolean(),
  salt: boolean(),
})
export type DomainFields = InferOutput<
  typeof DomainFieldsSchema
>

export function decode_fields(
  _value: `0x${string}`,
): DomainFields {
  const value = parse(ByteSchema, _value)
  const body = value.slice(2).padStart(2, "0")
  const byte = Number.parseInt(body, 16)
  return parse(DomainFieldsSchema, {
    name: (byte & FIELD_NAME) !== 0,
    version: (byte & FIELD_VERSION) !== 0,
    chainId: (byte & FIELD_CHAIN_ID) !== 0,
    verifyingContract:
      (byte & FIELD_VERIFYING_CONTRACT) !== 0,
    salt: (byte & FIELD_SALT) !== 0,
  })
}
