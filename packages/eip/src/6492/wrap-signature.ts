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

import { encode_address_bytes_bytes } from "./abi"
import { MAGIC_BYTES } from "./magic-bytes"

export const WrapSignatureParametersSchema = object({
  factory: AddressSchema,
  factoryData: BytesSchema,
  signature: BytesSchema,
})
export type WrapSignatureParameters = InferOutput<
  typeof WrapSignatureParametersSchema
>

// Wrap a 1271 signature with the CREATE2-factory deploy
// shim so it can be verified before the signer contract
// exists on-chain. The result reads as a normal `bytes`
// blob ending in `MAGIC_BYTES`.
export function wrap_signature(
  _parameters: WrapSignatureParameters,
): Bytes {
  const parameters = parse(
    WrapSignatureParametersSchema,
    _parameters,
  )
  const body = encode_address_bytes_bytes(
    parameters.factory,
    parameters.factoryData,
    parameters.signature,
  )
  const magic = hex_to_bytes(MAGIC_BYTES)
  const out = new Uint8Array(body.length + magic.length)
  out.set(body, 0)
  out.set(magic, body.length)
  return parse(BytesSchema, bytes_to_hex(out))
}
