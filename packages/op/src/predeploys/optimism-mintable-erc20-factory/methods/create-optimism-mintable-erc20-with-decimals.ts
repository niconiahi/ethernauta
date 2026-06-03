import {
  address,
  encode_function_call,
  string_,
  uint8,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
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
  uint8(),
] as const

export const CREATE_OPTIMISM_MINTABLE_ERC20_WITH_DECIMALS_SIGNATURE =
  {
    signature:
      "createOptimismMintableERC20WithDecimals(address,string,string,uint8)",
    names: [
      "_remoteToken",
      "_name",
      "_symbol",
      "_decimals",
    ],
  }

const ParametersSchema = union([
  tuple([AddressSchema, string(), string(), Uint8Schema]),
  object({
    _remoteToken: AddressSchema,
    _name: string(),
    _symbol: string(),
    _decimals: Uint8Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function createOptimismMintableERC20WithDecimals(
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
          parameters._remoteToken,
          parameters._name,
          parameters._symbol,
          parameters._decimals,
        ] as const)
    const calldata = encode_function_call({
      name: "createOptimismMintableERC20WithDecimals",
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
            CREATE_OPTIMISM_MINTABLE_ERC20_WITH_DECIMALS_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
