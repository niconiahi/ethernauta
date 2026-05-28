// https://eips.ethereum.org/EIPS/eip-7702
// Authorization tuple: an EOA delegates execution to a
// contract at `address` for one transaction. Each tuple is
// signed independently with the magic prefix `0x05`:
//
//   digest = keccak256(0x05 || rlp([chain_id, address, nonce]))
//
// `chain_id = 0` is a wildcard ("valid on every chain").
// Type-4 transactions carry a list of these tuples as
// the 10th RLP field.

import { AddressSchema, UintSchema } from "@ethernauta/core"
import { hex_to_bytes, rlp_encode } from "@ethernauta/utils"
import { keccak_256 } from "@noble/hashes/sha3"
import {
  array,
  type InferOutput,
  object,
  parse,
} from "valibot"

export const SET_CODE_TX_TYPE = 0x04 as const
export const SET_CODE_MAGIC = 0x05 as const

export const AuthorizationParameterSchema = object({
  chainId: UintSchema,
  address: AddressSchema,
  nonce: UintSchema,
})
export type AuthorizationParameter = InferOutput<
  typeof AuthorizationParameterSchema
>

export const AuthorizationSignedSchema = object({
  chainId: UintSchema,
  address: AddressSchema,
  nonce: UintSchema,
  yParity: UintSchema,
  r: UintSchema,
  s: UintSchema,
})
export type AuthorizationSigned = InferOutput<
  typeof AuthorizationSignedSchema
>

export const AuthorizationListSchema = array(
  AuthorizationSignedSchema,
)
export type AuthorizationList = InferOutput<
  typeof AuthorizationListSchema
>

function hex_to_big(hex: string): bigint {
  return BigInt(hex)
}

function encode_authorization_body(
  auth: AuthorizationParameter,
): Uint8Array {
  return rlp_encode([
    hex_to_big(auth.chainId),
    hex_to_bytes(auth.address),
    hex_to_big(auth.nonce),
  ])
}

/**
 * Bytes the user must sign for an EIP-7702 authorization:
 * `0x05 || rlp([chain_id, address, nonce])`.
 */
export function build_authorization_message(
  _auth: AuthorizationParameter,
): Uint8Array {
  const auth = parse(AuthorizationParameterSchema, _auth)
  const body = encode_authorization_body(auth)
  const out = new Uint8Array(1 + body.length)
  out[0] = SET_CODE_MAGIC
  out.set(body, 1)
  return out
}

/** 32-byte keccak digest of the authorization message. */
export function hash_authorization(
  auth: AuthorizationParameter,
): Uint8Array {
  return keccak_256(build_authorization_message(auth))
}
