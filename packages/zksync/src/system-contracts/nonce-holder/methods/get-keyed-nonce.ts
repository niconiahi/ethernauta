import {
  address,
  decode_function_result,
  encode_function_call,
  uint192,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Uint256 } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint192Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [address(), uint192()] as const
const OUTPUT_CODECS = [uint256()] as const

export const GET_KEYED_NONCE_SIGNATURE = {
  signature: "getKeyedNonce(address,uint192)",
  names: ["_address", "_key"],
}

const ParametersSchema = union([
  tuple([AddressSchema, Uint192Schema]),
  object({
    _address: AddressSchema,
    _key: Uint192Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getKeyedNonce(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint256> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters._address, parameters._key] as const)
    const calldata = encode_function_call({
      name: "getKeyedNonce",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint256 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint256Schema, decoded)
      },
    }
  }
}
