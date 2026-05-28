// https://eips.ethereum.org/EIPS/eip-6492
//
// Pre-deploy signature verification: simulate deploying
// the universal validator contract via `eth_call({ to:
// null, data: bytecode || abi.encode(signer, hash, sig) })`
// and read the constructor's single-byte return value.
// 0x01 means valid (EOA recover, deployed 1271, or
// undeployed 1271 after running the embedded factory).
// Anything else — revert, network error, non-0x01
// response — surfaces as `false`.

import {
  AddressSchema,
  BytesSchema,
  Hash32Schema,
} from "@ethernauta/core"
import {
  CallSchema,
  type Readable,
  type ResolvedReader,
} from "@ethernauta/transport"
import {
  bytes_to_hex,
  hex_to_bytes,
} from "@ethernauta/utils"
import { type InferOutput, object, parse } from "valibot"

import { encode_address_bytes32_bytes } from "./abi"
import { VALIDATOR_BYTECODE } from "./validator-bytecode"

export const VerifyHashParametersSchema = object({
  address: AddressSchema,
  hash: Hash32Schema,
  signature: BytesSchema,
})
export type VerifyHashParameters = InferOutput<
  typeof VerifyHashParametersSchema
>

function build_calldata(
  parameters: VerifyHashParameters,
): `0x${string}` {
  const args = encode_address_bytes32_bytes(
    parameters.address,
    parameters.hash,
    parameters.signature,
  )
  const bytecode = hex_to_bytes(VALIDATOR_BYTECODE)
  const out = new Uint8Array(bytecode.length + args.length)
  out.set(bytecode, 0)
  out.set(args, bytecode.length)
  return bytes_to_hex(out) as `0x${string}`
}

export function verify_hash(
  _parameters: VerifyHashParameters,
): Readable<boolean> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<boolean> => {
    const parameters = parse(
      VerifyHashParametersSchema,
      _parameters,
    )
    const input = build_calldata(parameters)
    const call = parse(CallSchema, [
      "eth_call",
      [{ input }, "latest"],
    ])
    let response: Awaited<
      ReturnType<(typeof transports)[number]>
    >
    try {
      response = await Promise.any(
        transports.map((transport) => transport(call)),
      )
    } catch {
      return false
    }
    if ("error" in response) return false
    const result = response.result
    if (typeof result !== "string") return false
    const bytes = hex_to_bytes(result as `0x${string}`)
    return (
      bytes.length === 1 && (bytes[0] as number) === 0x01
    )
  }
}
