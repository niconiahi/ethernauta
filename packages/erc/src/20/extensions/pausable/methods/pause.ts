import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  encode_function_call,
} from "@ethernauta/abi"
import { parse } from "valibot"


const PARAM_CODECS = [] as const

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "pause()",
  names: [],
}



export function pause()
: Signable<Bytes> {
  return async (
    [signer, _context]: ResolvedSigner,
  ): Promise<Bytes> => {
    if (!_context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    const values: unknown[] = []
    const calldata = encode_function_call({
      name: "pause",
      args: PARAM_CODECS,
      values: values as never,
    })
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction(
      [{
        to: _context.to,
        value: "0x0",
        input: bytes_to_hex(calldata),
      }],
      { _function: SIGNATURE },
    )([signer, _context])
  }
}
