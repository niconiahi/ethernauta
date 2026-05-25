import {
  address,
  array,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Uint256 } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
  uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"

const PARAM_CODECS = [
  array(address()),
  array(uint256()),
] as const
const OUTPUT_CODECS = [array(uint256())] as const

export const BALANCE_OF_BATCH_SIGNATURE = {
  signature: "balanceOfBatch(address[],uint256[])",
  names: ["accounts", "ids"],
}

const parametersSchema = union([
  tuple([v_array(addressSchema), v_array(uint256Schema)]),
  object({
    accounts: v_array(addressSchema),
    ids: v_array(uint256Schema),
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function balanceOfBatch(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<Uint256[]> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.accounts, parameters.ids] as const)
    const calldata = encode_function_call({
      name: "balanceOfBatch",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint256[] => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(v_array(uint256Schema), decoded)
      },
    }
  }
}
