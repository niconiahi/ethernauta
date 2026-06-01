import {
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
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [bytes32(), uint256()] as const

export const GET_ANCHOR_ROOT_SIGNATURE = {
  signature: "getAnchorRoot()",
  names: [],
}

export function getAnchorRoot() {
  return (
    context: ContractContext,
  ): Callable<[Bytes32, Uint256]> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "getAnchorRoot",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Bytes32, Uint256] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Bytes32Schema, decoded[0]),
          parse(Uint256Schema, decoded[1]),
        ]
      },
    }
  }
}
