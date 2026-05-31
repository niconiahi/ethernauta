import {
  address,
  decode_function_result,
  encode_function_call,
  uint8,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Uint8,
} from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint8Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [address(), uint8()] as const

export const GAS_PAYING_TOKEN_SIGNATURE = {
  signature: "gasPayingToken()",
  names: [],
}

export function gasPayingToken() {
  return (
    context: ContractContext,
  ): Callable<[Address, Uint8]> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "gasPayingToken",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Address, Uint8] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(AddressSchema, decoded[0]),
          parse(Uint8Schema, decoded[1]),
        ]
      },
    }
  }
}
