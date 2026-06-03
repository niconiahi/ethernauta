import {
  tuple as abi_tuple,
  address,
  decode_function_result,
  encode_function_call,
  uint32,
  uint224,
} from "@ethernauta/abi"
import type {
  Bytes,
  Uint32,
  Uint224,
} from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint32Schema,
  Uint224Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [address(), uint32()] as const
const OUTPUT_CODECS = [
  abi_tuple({ fromBlock: uint32(), votes: uint224() }),
] as const

export const CHECKPOINTS_SIGNATURE = {
  signature: "checkpoints(address,uint32)",
  names: ["account", "pos"],
}

const ParametersSchema = union([
  tuple([AddressSchema, Uint32Schema]),
  object({ account: AddressSchema, pos: Uint32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function checkpoints(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<{ fromBlock: Uint32; votes: Uint224 }> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.account, parameters.pos] as const)
    const calldata = encode_function_call({
      name: "checkpoints",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): { fromBlock: Uint32; votes: Uint224 } => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(
          object({
            fromBlock: Uint32Schema,
            votes: Uint224Schema,
          }),
          decoded,
        )
      },
    }
  }
}
