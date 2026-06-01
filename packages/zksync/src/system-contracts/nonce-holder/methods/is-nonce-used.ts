import {
  address,
  bool,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
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
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [address(), uint256()] as const
const OUTPUT_CODECS = [bool()] as const

export const IS_NONCE_USED_SIGNATURE = {
  signature: "isNonceUsed(address,uint256)",
  names: ["_address", "_nonce"],
}

const ParametersSchema = union([
  tuple([AddressSchema, Uint256Schema]),
  object({
    _address: AddressSchema,
    _nonce: Uint256Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function isNonceUsed(_parameters: Parameters) {
  return (context: ContractContext): Callable<boolean> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters._address, parameters._nonce] as const)
    const calldata = encode_function_call({
      name: "isNonceUsed",
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
