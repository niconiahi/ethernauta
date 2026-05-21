// https://eips.ethereum.org/EIPS/eip-7683 — IOriginSettler.open

import {
  bytes32,
  bytes,
  encode_function_call,
  tuple,
  uint32,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

import {
  type OnchainCrossChainOrder,
  onchainCrossChainOrderSchema,
} from "../types"

const ONCHAIN_ORDER_CODEC = tuple({
  fillDeadline: uint32(),
  orderDataType: bytes32(),
  orderData: bytes(),
})

const PARAM_CODECS = [ONCHAIN_ORDER_CODEC] as const

export const OPEN_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "open((uint32,bytes32,bytes))",
  names: ["order"],
}

export function open(
  _order: OnchainCrossChainOrder,
): Signable<Bytes> {
  return async ([
    signer,
    _context,
  ]: ResolvedSigner): Promise<Bytes> => {
    if (!_context.to)
      throw new Error(
        "contract Signable requires a 'to' on the signer resolver",
      )
    const order = parse(
      onchainCrossChainOrderSchema,
      _order,
    )
    const calldata = encode_function_call({
      name: "open",
      args: PARAM_CODECS,
      values: [order] as never,
    })
    return eth_signTransaction([
      {
        to: _context.to,
        value: "0x0",
        input: bytes_to_hex(calldata),
        _ethernauta: { function: OPEN_SIGNATURE },
      },
    ])([signer, _context])
  }
}
