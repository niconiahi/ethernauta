import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address,
  uint256,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Uint256 } from "@ethernauta/core"
import { addressSchema, uint256Schema } from "@ethernauta/core"

const PARAM_CODECS = [address()] as const
const OUTPUT_CODECS = [uint256()] as const

export const BALANCE_OF_SIGNATURE = {
  signature: "balanceOf(address)",
  names: ["owner"],
}

const parametersSchema = union([
  tuple([addressSchema]),
  object({ owner: addressSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function balanceOf(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint256> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.owner] as const)
    const calldata = encode_function_call({
      name: "balanceOf",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: bytes_to_hex(calldata),
      decode: (result: Bytes): Uint256 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(uint256Schema, decoded)
      },
    }
  }
}
