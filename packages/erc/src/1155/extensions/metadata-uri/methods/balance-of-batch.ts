import {
  address,
  array,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Uint256 } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint256Schema,
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

const ParametersSchema = union([
  tuple([v_array(AddressSchema), v_array(Uint256Schema)]),
  object({
    accounts: v_array(AddressSchema),
    ids: v_array(Uint256Schema),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function balanceOfBatch(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<Uint256[]> => {
    const parameters = parse(ParametersSchema, _parameters)
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
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint256[] => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(v_array(Uint256Schema), decoded)
      },
    }
  }
}
