// https://eips.ethereum.org/EIPS/eip-7683 — IOriginSettler.openFor

import {
  address,
  bytes,
  bytes32,
  encode_function_call,
  tuple,
  uint32,
  uint256,
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
  type GaslessCrossChainOrder,
  gaslessCrossChainOrderSchema,
} from "../types"

export const GASLESS_ORDER_CODEC = tuple({
  originSettler: address(),
  user: address(),
  nonce: uint256(),
  originChainId: uint256(),
  openDeadline: uint32(),
  fillDeadline: uint32(),
  orderDataType: bytes32(),
  orderData: bytes(),
})

const PARAM_CODECS = [
  GASLESS_ORDER_CODEC,
  bytes(),
  bytes(),
] as const

export const OPEN_FOR_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature:
    "openFor((address,address,uint256,uint256,uint32,uint32,bytes32,bytes),bytes,bytes)",
  names: ["order", "signature", "originFillerData"],
}

export function openFor({
  order: _order,
  signature: _signature,
  originFillerData: _filler_data,
}: {
  order: GaslessCrossChainOrder
  signature: `0x${string}`
  originFillerData: `0x${string}`
}): Signable<Bytes> {
  return async ([
    signer,
    _context,
  ]: ResolvedSigner): Promise<Bytes> => {
    if (!_context.to)
      throw new Error(
        "contract Signable requires a 'to' on the signer resolver",
      )
    const order = parse(
      gaslessCrossChainOrderSchema,
      _order,
    )
    const calldata = encode_function_call({
      name: "openFor",
      args: PARAM_CODECS,
      values: [order, _signature, _filler_data] as never,
    })
    return eth_signTransaction([
      {
        to: _context.to,
        value: "0x0",
        input: bytes_to_hex(calldata),
        _ethernauta: { function: OPEN_FOR_SIGNATURE },
      },
    ])([signer, _context])
  }
}
