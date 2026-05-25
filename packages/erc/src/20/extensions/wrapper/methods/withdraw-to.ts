import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address,
  uint256,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { addressSchema, bytesSchema, uint256Schema, uintSchema } from "@ethernauta/core"

const PARAM_CODECS = [address(), uint256()] as const

export const WITHDRAW_TO_SIGNATURE = {
  signature: "withdrawTo(address,uint256)",
  names: ["account", "value"],
}

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({ account: addressSchema, value: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function withdrawTo(_parameters: Parameters): Signable<Bytes> {
  return async ([signer, context]: ResolvedSigner): Promise<Bytes> => {
    if (!context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.account, parameters.value] as const)
    const calldata = encode_function_call({
      name: "withdrawTo",
      args: PARAM_CODECS,
      values,
    })
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction(
      [{
        to: context.to,
        value: parse(uintSchema, "0x0"),
        input: parse(bytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: WITHDRAW_TO_SIGNATURE,
        },
      }],
    )([signer, context])
  }
}
