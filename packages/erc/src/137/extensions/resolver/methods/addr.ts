import {
  address,
  bytes32,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Address, Bytes } from "@ethernauta/core"
import {
  addressSchema,
  bytes32Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [address()] as const

export const ADDR_SIGNATURE = {
  signature: "addr(bytes32)",
  names: ["node"],
}

const parametersSchema = union([
  tuple([bytes32Schema]),
  object({ node: bytes32Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function addr(_parameters: Parameters) {
  return (context: ContractContext): Callable<Address> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.node] as const)
    const calldata = encode_function_call({
      name: "addr",
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
