import {
  bytes32,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Bytes32 } from "@ethernauta/core"
import {
  Bytes32Schema,
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

const PARAM_CODECS = [uint256(), bytes32()] as const
const OUTPUT_CODECS = [bytes32()] as const

export const DEPOSIT_HAPPENED_SIGNATURE = {
  signature: "depositHappened(uint256,bytes32)",
  names: ["chainId", "l2DepositTxHash"],
}

const ParametersSchema = union([
  tuple([Uint256Schema, Bytes32Schema]),
  object({
    chainId: Uint256Schema,
    l2DepositTxHash: Bytes32Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function depositHappened(_parameters: Parameters) {
  return (context: ContractContext): Callable<Bytes32> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([
          parameters.chainId,
          parameters.l2DepositTxHash,
        ] as const)
    const calldata = encode_function_call({
      name: "depositHappened",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Bytes32 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Bytes32Schema, decoded)
      },
    }
  }
}
