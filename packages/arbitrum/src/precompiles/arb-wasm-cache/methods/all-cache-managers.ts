import {
  address,
  array,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Address, Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse, array as v_array } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [array(address())] as const

export const ALL_CACHE_MANAGERS_SIGNATURE = {
  signature: "allCacheManagers()",
  names: [],
}

export function allCacheManagers() {
  return (
    context: ContractContext,
  ): Callable<Address[]> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "allCacheManagers",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Address[] => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(v_array(AddressSchema), decoded)
      },
    }
  }
}
