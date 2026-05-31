import {
  array,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type {
  Bytes,
  Bytes32,
  Uint256,
} from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse, array as v_array } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [
  uint256(),
  bytes32(),
  array(bytes32()),
] as const

export const SEND_MERKLE_TREE_STATE_SIGNATURE = {
  signature: "sendMerkleTreeState()",
  names: [],
}

export function sendMerkleTreeState() {
  return (
    context: ContractContext,
  ): Callable<[Uint256, Bytes32, Bytes32[]]> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "sendMerkleTreeState",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): [Uint256, Bytes32, Bytes32[]] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Uint256Schema, decoded[0]),
          parse(Bytes32Schema, decoded[1]),
          parse(v_array(Bytes32Schema), decoded[2]),
        ]
      },
    }
  }
}
