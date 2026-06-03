import {
  array,
  bool,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint8,
  uint16,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  Uint8Schema,
  Uint16Schema,
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
  array as v_array,
} from "valibot"

const PARAM_CODECS = [
  uint256(),
  bytes32(),
  uint256(),
  uint256(),
  uint16(),
  array(bytes32()),
  uint8(),
] as const
const OUTPUT_CODECS = [bool()] as const

export const PROVE_L1_TO_L2_TRANSACTION_STATUS_SIGNATURE = {
  signature:
    "proveL1ToL2TransactionStatus(uint256,bytes32,uint256,uint256,uint16,bytes32[],uint8)",
  names: [
    "_chainId",
    "_l2TxHash",
    "_l2BatchNumber",
    "_l2MessageIndex",
    "_l2TxNumberInBatch",
    "_merkleProof",
    "_status",
  ],
}

const ParametersSchema = union([
  tuple([
    Uint256Schema,
    Bytes32Schema,
    Uint256Schema,
    Uint256Schema,
    Uint16Schema,
    v_array(Bytes32Schema),
    Uint8Schema,
  ]),
  object({
    _chainId: Uint256Schema,
    _l2TxHash: Bytes32Schema,
    _l2BatchNumber: Uint256Schema,
    _l2MessageIndex: Uint256Schema,
    _l2TxNumberInBatch: Uint16Schema,
    _merkleProof: v_array(Bytes32Schema),
    _status: Uint8Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function proveL1ToL2TransactionStatus(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<boolean> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
          parameters[3],
          parameters[4],
          parameters[5],
          parameters[6],
        ] as const)
      : ([
          parameters._chainId,
          parameters._l2TxHash,
          parameters._l2BatchNumber,
          parameters._l2MessageIndex,
          parameters._l2TxNumberInBatch,
          parameters._merkleProof,
          parameters._status,
        ] as const)
    const calldata = encode_function_call({
      name: "proveL1ToL2TransactionStatus",
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
