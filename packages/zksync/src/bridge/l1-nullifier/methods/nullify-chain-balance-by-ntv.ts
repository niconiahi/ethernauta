import {
  address,
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

const PARAM_CODECS = [uint256(), address()] as const

export const NULLIFY_CHAIN_BALANCE_BY_NTV_SIGNATURE = {
  signature: "nullifyChainBalanceByNTV(uint256,address)",
  names: ["_chainId", "_token"],
}

const ParametersSchema = union([
  tuple([Uint256Schema, AddressSchema]),
  object({
    _chainId: Uint256Schema,
    _token: AddressSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function nullifyChainBalanceByNTV(
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
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters._chainId, parameters._token] as const)
    const calldata = encode_function_call({
      name: "nullifyChainBalanceByNTV",
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
          function: NULLIFY_CHAIN_BALANCE_BY_NTV_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
