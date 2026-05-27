import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address,
  array,
  bytes,
  bytes32,
  uint256,
  uint64,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union, array as v_array } from "valibot"
import type { Address, Bytes32, Uint256 } from "@ethernauta/core"
import { addressSchema, bytes32Schema, bytesSchema, uint256Schema, uint64Schema } from "@ethernauta/core"

const PARAM_CODECS = [uint256(), uint64()] as const
const OUTPUT_CODECS = [array(bytes32()), uint256(), address(), address(), uint256(), uint256(), uint256(), uint256(), bytes()] as const

export const LEGACY_LOOKUP_MESSAGE_BATCH_PROOF_SIGNATURE = {
  signature: "legacyLookupMessageBatchProof(uint256,uint64)",
  names: ["batchNum", "index"],
}

const parametersSchema = union([
  tuple([uint256Schema, uint64Schema]),
  object({ batchNum: uint256Schema, index: uint64Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function legacyLookupMessageBatchProof(_parameters: Parameters) {
  return (context: ContractContext): Callable<[Bytes32[], Uint256, Address, Address, Uint256, Uint256, Uint256, Uint256, Bytes]> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.batchNum, parameters.index] as const)
    const calldata = encode_function_call({
      name: "legacyLookupMessageBatchProof",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Bytes32[], Uint256, Address, Address, Uint256, Uint256, Uint256, Uint256, Bytes] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(v_array(bytes32Schema), decoded[0]),
          parse(uint256Schema, decoded[1]),
          parse(addressSchema, decoded[2]),
          parse(addressSchema, decoded[3]),
          parse(uint256Schema, decoded[4]),
          parse(uint256Schema, decoded[5]),
          parse(uint256Schema, decoded[6]),
          parse(uint256Schema, decoded[7]),
          parse(bytesSchema, decoded[8]),
        ]
      },
    }
  }
}
