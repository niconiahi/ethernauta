import {
  tuple as abi_tuple,
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
import { object, parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [
  abi_tuple({
    root: bytes32(),
    l2SequenceNumber: uint256(),
  }),
] as const

export const GET_STARTING_ANCHOR_ROOT_SIGNATURE = {
  signature: "getStartingAnchorRoot()",
  names: [],
}

export function getStartingAnchorRoot() {
  return (
    context: ContractContext,
  ): Callable<{
    root: Bytes32
    l2SequenceNumber: Uint256
  }> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "getStartingAnchorRoot",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): { root: Bytes32; l2SequenceNumber: Uint256 } => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(
          object({
            root: Bytes32Schema,
            l2SequenceNumber: Uint256Schema,
          }),
          decoded,
        )
      },
    }
  }
}
