import {
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Uint256 } from "@ethernauta/core"
import {
  BytesSchema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [
  uint256(),
  uint256(),
  uint256(),
  uint256(),
] as const
const OUTPUT_CODECS = [uint256()] as const

export const L2_TRANSACTION_BASE_COST_SIGNATURE = {
  signature:
    "l2TransactionBaseCost(uint256,uint256,uint256,uint256)",
  names: [
    "_chainId",
    "_gasPrice",
    "_l2GasLimit",
    "_l2GasPerPubdataByteLimit",
  ],
}

const ParametersSchema = union([
  tuple([
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
  ]),
  object({
    _chainId: Uint256Schema,
    _gasPrice: Uint256Schema,
    _l2GasLimit: Uint256Schema,
    _l2GasPerPubdataByteLimit: Uint256Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function l2TransactionBaseCost(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Uint256> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
          parameters[3],
        ] as const)
      : ([
          parameters._chainId,
          parameters._gasPrice,
          parameters._l2GasLimit,
          parameters._l2GasPerPubdataByteLimit,
        ] as const)
    const calldata = encode_function_call({
      name: "l2TransactionBaseCost",
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
