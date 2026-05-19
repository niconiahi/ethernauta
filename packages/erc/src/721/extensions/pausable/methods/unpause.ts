import {
  build_signature,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/eth"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/transport"
import { parse } from "valibot"

const PARAM_TYPES = [] as const

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "unpause()",
  names: [],
}

export function unpause(): Signable<Bytes> {
  return async ([
    signer,
    _context,
  ]: ResolvedSigner): Promise<Bytes> => {
    if (!_context.to)
      throw new Error(
        "contract Signable requires a 'to' on the signer resolver",
      )
    const values: unknown[] = []
    const signature = build_signature("unpause", [
      ...PARAM_TYPES,
    ])
    const calldata = encode_function_call(
      signature,
      [...PARAM_TYPES],
      values,
    )
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction(
      [
        {
          to: _context.to,
          value: "0x0",
          input: bytes_to_hex(calldata),
        },
      ],
      { _function: SIGNATURE },
    )([signer, _context])
  }
}
