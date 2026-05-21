// https://eips.ethereum.org/EIPS/eip-5564 — Announcer.announce

import {
  address,
  bytes,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Uint256,
} from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"

const PARAM_CODECS = [
  uint256(),
  address(),
  bytes(),
  bytes(),
] as const

export const ANNOUNCE_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature:
    "announce(uint256,address,bytes,bytes)",
  names: [
    "schemeId",
    "stealthAddress",
    "ephemeralPubKey",
    "metadata",
  ],
}

export function announce({
  schemeId,
  stealthAddress,
  ephemeralPubKey,
  metadata,
}: {
  schemeId: Uint256
  stealthAddress: Address
  ephemeralPubKey: Bytes
  metadata: Bytes
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
      name: "announce",
      args: PARAM_CODECS,
      values: [
        schemeId,
        stealthAddress,
        ephemeralPubKey,
        metadata,
      ] as never,
    })
    return eth_signTransaction([
      {
        to: _context.to,
        value: "0x0",
        input: bytes_to_hex(calldata),
        _ethernauta: { function: ANNOUNCE_SIGNATURE },
      },
    ])([signer, _context])
  }
}
