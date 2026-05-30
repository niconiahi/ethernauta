// https://eips.ethereum.org/EIPS/eip-1271
//
// `verify_hash` is the primitive: given a contract address,
// a 32-byte digest, and a signature, decide whether the
// signature is valid for that contract per EIP-1271.
//
// Strictly the on-chain path: `eth_call
// address.isValidSignature(hash, sig)` and check the first
// 4 bytes of the result against `MAGIC_VALUE` (0x1626ba7e).
// Anything else — non-magic return, revert, network error —
// surfaces as `false` rather than thrown.
//
// EOA verification (no `isValidSignature` on the target,
// recover via ECDSA instead) is NOT this primitive's job.
// It lives in `verify_message_deployed` /
// `verify_typed_data_deployed` in `@ethernauta/crypto`,
// which compose this call with `recover_address` and an
// `eth_getCode` check.

import {
  AddressSchema,
  BytesSchema,
  Hash32Schema,
} from "@ethernauta/core"
import {
  CallSchema,
  type Readable,
  type ResolvedReader,
  type Response,
} from "@ethernauta/transport"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { type InferOutput, object, parse } from "valibot"

import { MAGIC_VALUE } from "./magic-value"

export const VerifyHashParametersSchema = object({
  address: AddressSchema,
  hash: Hash32Schema,
  signature: BytesSchema,
})
export type VerifyHashParameters = InferOutput<
  typeof VerifyHashParametersSchema
>

function encode_is_valid_signature_calldata(
  hash: string,
  signature: string,
): string {
  const hash_bytes = hex_to_bytes(hash as `0x${string}`)
  const sig_bytes = hex_to_bytes(signature as `0x${string}`)
  const padded_len = Math.ceil(sig_bytes.length / 32) * 32
  // selector(4) || hash(32) || offset(32) || length(32) ||
  //   data(padded to 32-byte multiple)
  const calldata = new Uint8Array(
    4 + 32 + 32 + 32 + padded_len,
  )
  calldata[0] = 0x16
  calldata[1] = 0x26
  calldata[2] = 0xba
  calldata[3] = 0x7e
  calldata.set(hash_bytes, 4)
  // offset to dynamic bytes arg = 0x40 (2 * 32)
  calldata[4 + 32 + 31] = 0x40
  // length of signature in bytes, big-endian uint256
  let len = sig_bytes.length
  for (let i = 0; i < 4 && len > 0; i++) {
    calldata[4 + 64 + 31 - i] = len & 0xff
    len >>= 8
  }
  calldata.set(sig_bytes, 4 + 96)
  return bytes_to_hex(calldata)
}

export function verify_hash(
  _parameters: VerifyHashParameters,
): Readable<boolean> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<boolean> => {
    const parameters = parse(
      VerifyHashParametersSchema,
      _parameters,
    )
    const input = encode_is_valid_signature_calldata(
      parameters.hash,
      parameters.signature,
    )
    const call = parse(CallSchema, [
      "eth_call",
      [{ to: parameters.address, input }, "latest"],
    ])
    let response: Response
    try {
      response = await dispatcher(call)
    } catch {
      return false
    }
    if ("error" in response) return false
    const result = response.result
    if (typeof result !== "string") return false
    return (
      result.slice(0, 10).toLowerCase() ===
      MAGIC_VALUE.toLowerCase()
    )
  }
}
