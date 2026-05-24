import {
  address,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Address, Bytes } from "@ethernauta/core"
import { addressSchema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [address()] as const

export const UNDERLYING_SIGNATURE = {
  signature: "underlying()",
  names: [],
}

export function underlying() {
  return (context: ContractContext): Callable<Address> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "underlying",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: bytes_to_hex(calldata),
      decode: (result: Bytes): Address => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(addressSchema, decoded)
      },
    }
  }
}
