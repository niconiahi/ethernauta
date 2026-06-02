import {
  array,
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
import {
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"

const PARAM_CODECS = [
  array(bytes32()),
  uint256(),
  bytes32(),
] as const
const OUTPUT_CODECS = [bytes32()] as const

export const CALCULATE_MERKLE_ROOT_SIGNATURE = {
  signature:
    "calculateMerkleRoot(bytes32[],uint256,bytes32)",
  names: ["proof", "path", "item"],
}

const ParametersSchema = union([
  tuple([
    v_array(Bytes32Schema),
    Uint256Schema,
    Bytes32Schema,
  ]),
  object({
    proof: v_array(Bytes32Schema),
    path: Uint256Schema,
    item: Bytes32Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function calculateMerkleRoot(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Bytes32> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
        ] as const)
      : ([
          parameters.proof,
          parameters.path,
          parameters.item,
        ] as const)
    const calldata = encode_function_call({
      name: "calculateMerkleRoot",
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
