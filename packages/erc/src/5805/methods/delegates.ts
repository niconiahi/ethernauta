import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Address } from "@ethernauta/core"
import { addressSchema } from "@ethernauta/core"

const PARAM_CODECS = [address()] as const
const OUTPUT_CODECS = [address()] as const

export const DELEGATES_SIGNATURE = {
  signature: "delegates(address)",
  names: ["account"],
}

const parametersSchema = union([
  tuple([addressSchema]),
  object({ account: addressSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function delegates(_parameters: Parameters) {
  return (context: ContractContext): Callable<Address> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.account] as const)
    const calldata = encode_function_call({
      name: "delegates",
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
