import {
  array,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Uint256 } from "@ethernauta/core"
import {
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
const OUTPUT_CODECS = [array(uint256())] as const

export const GET_ALL_ZK_CHAIN_CHAIN_IDS_SIGNATURE = {
  signature: "getAllZKChainChainIDs()",
  names: [],
}

export function getAllZKChainChainIDs() {
  return (
    context: ContractContext,
  ): Callable<Uint256[]> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "getAllZKChainChainIDs",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint256[] => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(v_array(Uint256Schema), decoded)
      },
    }
  }
}
