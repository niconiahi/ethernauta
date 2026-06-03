import {
  address,
  encode_function_call,
  string_,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  string,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [
  address(),
  string_(),
  string_(),
] as const

export const CREATE_OPTIMISM_MINTABLE_ERC721_SIGNATURE = {
  signature:
    "createOptimismMintableERC721(address,string,string)",
  names: ["_remoteToken", "_name", "_symbol"],
}

const ParametersSchema = union([
  tuple([AddressSchema, string(), string()]),
  object({
    _remoteToken: AddressSchema,
    _name: string(),
    _symbol: string(),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function createOptimismMintableERC721(
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
        ] as const)
      : ([
          parameters._remoteToken,
          parameters._name,
          parameters._symbol,
        ] as const)
    const calldata = encode_function_call({
      name: "createOptimismMintableERC721",
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
            CREATE_OPTIMISM_MINTABLE_ERC721_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
