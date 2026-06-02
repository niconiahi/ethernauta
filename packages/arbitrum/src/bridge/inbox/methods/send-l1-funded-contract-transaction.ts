import {
  address,
  bytes,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint256Schema,
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
  uint256(),
  uint256(),
  address(),
  bytes(),
] as const

export const SEND_L1_FUNDED_CONTRACT_TRANSACTION_SIGNATURE =
  {
    signature:
      "sendL1FundedContractTransaction(uint256,uint256,address,bytes)",
    names: ["gasLimit", "maxFeePerGas", "to", "data"],
  }

const ParametersSchema = union([
  tuple([
    Uint256Schema,
    Uint256Schema,
    AddressSchema,
    BytesSchema,
  ]),
  object({
    gasLimit: Uint256Schema,
    maxFeePerGas: Uint256Schema,
    to: AddressSchema,
    data: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function sendL1FundedContractTransaction(
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
          parameters.gasLimit,
          parameters.maxFeePerGas,
          parameters.to,
          parameters.data,
        ] as const)
    const calldata = encode_function_call({
      name: "sendL1FundedContractTransaction",
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
        value: context.value ?? parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function:
            SEND_L1_FUNDED_CONTRACT_TRANSACTION_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
