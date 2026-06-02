import { encode_function_call } from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import { BytesSchema, UintSchema } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const

export const UPDATE_ROLLUP_ADDRESS_SIGNATURE = {
  signature: "updateRollupAddress()",
  names: [],
}

export function updateRollupAddress(): Signable<Bytes> {
  return async ([
    signer,
    context,
  ]: ResolvedSigner): Promise<Bytes> => {
    if (!context.to)
      throw new Error(
        "contract Signable requires a 'to' on the signer resolver",
      )
    const values = [] as const
    const calldata = encode_function_call({
      name: "updateRollupAddress",
      args: PARAM_CODECS,
      values,
    })
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction([
      {
        to: context.to,
        value: parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: UPDATE_ROLLUP_ADDRESS_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
