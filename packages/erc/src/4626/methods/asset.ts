import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { parse } from "valibot"
import type { Address } from "@ethernauta/core"
import { addressSchema, bytesSchema } from "@ethernauta/core"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [address()] as const

export const ASSET_SIGNATURE = {
  signature: "asset()",
  names: [],
}



export function asset() {
  return (context: ContractContext): Callable<Address> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "asset",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
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
