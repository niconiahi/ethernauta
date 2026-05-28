// https://eips.ethereum.org/EIPS/eip-6492

import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
} from "@ethernauta/core"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { type InferOutput, object, parse } from "valibot"

import {
  type DecodedAddressBytesBytes,
  decode_address_bytes_bytes,
} from "./abi"
import { is_wrapped_signature } from "./is-wrapped-signature"

export const UnwrappedSignatureSchema = object({
  factory: AddressSchema,
  factoryData: BytesSchema,
  signature: BytesSchema,
})
export type UnwrappedSignature = InferOutput<
  typeof UnwrappedSignatureSchema
>

// Inverse of `wrap_signature`. Returns null when the input
// is missing the magic suffix, has an inner shape that
// doesn't ABI-decode as `(address, bytes, bytes)`, or any
// embedded offset/length is out of bounds — callers can
// then treat it as a plain non-wrapped signature.
export function unwrap_signature(
  _signature: Bytes,
): UnwrappedSignature | null {
  const signature = parse(BytesSchema, _signature)
  if (!is_wrapped_signature(signature)) return null
  const bytes = hex_to_bytes(signature)
  const body = bytes.subarray(0, bytes.length - 32)
  let decoded: DecodedAddressBytesBytes
  try {
    decoded = decode_address_bytes_bytes(body)
  } catch {
    return null
  }
  try {
    return {
      factory: parse(
        AddressSchema,
        bytes_to_hex(decoded.address),
      ),
      factoryData: parse(
        BytesSchema,
        bytes_to_hex(decoded.first),
      ),
      signature: parse(
        BytesSchema,
        bytes_to_hex(decoded.second),
      ),
    }
  } catch {
    return null
  }
}
