import {
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
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

const PARAM_CODECS = [uint256(), uint256()] as const

export const FORWARDED_BRIDGE_BURN_SET_SETTLEMENT_LAYER_SIGNATURE =
  {
    signature:
      "forwardedBridgeBurnSetSettlementLayer(uint256,uint256)",
    names: ["_chainId", "_newSettlementLayerChainId"],
  }

const ParametersSchema = union([
  tuple([Uint256Schema, Uint256Schema]),
  object({
    _chainId: Uint256Schema,
    _newSettlementLayerChainId: Uint256Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function forwardedBridgeBurnSetSettlementLayer(
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
      : ([
          parameters._chainId,
          parameters._newSettlementLayerChainId,
        ] as const)
    const calldata = encode_function_call({
      name: "forwardedBridgeBurnSetSettlementLayer",
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
          function:
            FORWARDED_BRIDGE_BURN_SET_SETTLEMENT_LAYER_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
