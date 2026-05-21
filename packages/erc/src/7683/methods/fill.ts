// https://eips.ethereum.org/EIPS/eip-7683 — IDestinationSettler.fill

import {
  bytes32,
  bytes,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes, Hash32 } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"

const PARAM_CODECS = [bytes32(), bytes(), bytes()] as const

export const FILL_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "fill(bytes32,bytes,bytes)",
  names: ["orderId", "originData", "fillerData"],
}

export function fill({
  orderId,
  originData,
  fillerData,
  value,
}: {
  orderId: Hash32
  originData: `0x${string}`
  fillerData: `0x${string}`
  value?: `0x${string}`
}): Signable<Bytes> {
  return async ([
    signer,
    _context,
  ]: ResolvedSigner): Promise<Bytes> => {
    if (!_context.to)
      throw new Error(
        "contract Signable requires a 'to' on the signer resolver",
      )
    const calldata = encode_function_call({
      name: "fill",
      args: PARAM_CODECS,
      values: [orderId, originData, fillerData] as never,
    })
    return eth_signTransaction([
      {
        to: _context.to,
        value: value ?? "0x0",
        input: bytes_to_hex(calldata),
        _ethernauta: { function: FILL_SIGNATURE },
      },
    ])([signer, _context])
  }
}
