import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address,
  array,
  bytes,
  uint256,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union, array as v_array } from "valibot"
import { addressSchema, bytesSchema, uint256Schema } from "@ethernauta/core"

const PARAM_CODECS = [address(), address(), array(uint256()), array(uint256()), bytes()] as const

export const SAFE_BATCH_TRANSFER_FROM_SIGNATURE = {
  signature: "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
  names: ["from", "to", "ids", "values", "data"],
}

const parametersSchema = union([
  tuple([addressSchema, addressSchema, v_array(uint256Schema), v_array(uint256Schema), bytesSchema]),
  object({ from: addressSchema, to: addressSchema, ids: v_array(uint256Schema), values: v_array(uint256Schema), data: bytesSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function safeBatchTransferFrom(_parameters: Parameters): Signable<Bytes> {
  return async ([signer, context]: ResolvedSigner): Promise<Bytes> => {
    if (!context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1], parameters[2], parameters[3], parameters[4]] as const)
      : ([parameters.from, parameters.to, parameters.ids, parameters.values, parameters.data] as const)
    const calldata = encode_function_call({
      name: "safeBatchTransferFrom",
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
        value: "0x0",
        input: bytes_to_hex(calldata),
        _ethernauta: {
          function: SAFE_BATCH_TRANSFER_FROM_SIGNATURE,
        },
      }],
    )([signer, context])
  }
}
