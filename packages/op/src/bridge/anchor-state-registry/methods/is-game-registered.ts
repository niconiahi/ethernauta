import {
  address,
  bool,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [address()] as const
const OUTPUT_CODECS = [bool()] as const

export const IS_GAME_REGISTERED_SIGNATURE = {
  signature: "isGameRegistered(address)",
  names: ["_game"],
}

const ParametersSchema = union([
  tuple([AddressSchema]),
  object({ _game: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function isGameRegistered(_parameters: Parameters) {
  return (context: ContractContext): Callable<boolean> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters._game] as const)
    const calldata = encode_function_call({
      name: "isGameRegistered",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): boolean => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(boolean(), decoded)
      },
    }
  }
}
