import {
  bytes,
  bytes32,
  encode_function_call,
  uint8,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  Uint8Schema,
  UintSchema,
} from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [
  bytes32(),
  bytes32(),
  bytes(),
  uint8(),
] as const

export const CREATE_ACCOUNT_SIGNATURE = {
  signature: "createAccount(bytes32,bytes32,bytes,uint8)",
  names: ["arg_0", "_bytecodeHash", "_input", "_aaVersion"],
}

const ParametersSchema = union([
  tuple([
    Bytes32Schema,
    Bytes32Schema,
    BytesSchema,
    Uint8Schema,
  ]),
  object({
    arg_0: Bytes32Schema,
    _bytecodeHash: Bytes32Schema,
    _input: BytesSchema,
    _aaVersion: Uint8Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function createAccount(
  _parameters: Parameters,
): Signable<Bytes> {
  return async ([
    signer,
    context,
  ]: ResolvedSigner): Promise<Bytes> => {
    if (!context.to)
      throw new Error(
        "contract Signable requires a 'to' on the signer resolver",
      )
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
          parameters[3],
        ] as const)
      : ([
          parameters.arg_0,
          parameters._bytecodeHash,
          parameters._input,
          parameters._aaVersion,
        ] as const)
    const calldata = encode_function_call({
      name: "createAccount",
      args: PARAM_CODECS,
      values,
    })
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction([
      {
        to: context.to,
        value: parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: CREATE_ACCOUNT_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
