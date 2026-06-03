import {
  bytes32,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes, Bytes32 } from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [bytes32()] as const

export const GET_REVOKE_TYPE_HASH_SIGNATURE = {
  signature: "getRevokeTypeHash()",
  names: [],
}

export function getRevokeTypeHash() {
  return (context: ContractContext): Callable<Bytes32> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "getRevokeTypeHash",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Bytes32 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Bytes32Schema, decoded)
      },
    }
  }
}
