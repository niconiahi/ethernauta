// Coarse Arbitrum gas estimator. Single eth_call to the NodeInterface
// precompile's `gasEstimateComponents(to, false, data)`, which the
// Nitro node intercepts and answers with the L2-execution +
// L1-batch-posting split. Simpler than OP-stack because Arbitrum
// hands back all four numbers in one shot — no separate L1-fee read.
//
// Why the encoder/decoder is composed inline here instead of reusing
// the autogen `gasEstimateComponents` binding under
// `../precompiles/node-interface/methods/`: upstream declares the
// method `payable`, so the walker correctly emits a `Signable<Bytes>`
// — even though the spec comment says "Use eth_call to call". The
// estimator wants the read path. Composing the bytes primitives
// keeps M1 honest (use primitives, not bypasses).

import {
  address,
  bool as bool_codec,
  bytes,
  decode_function_result,
  encode_function_call,
  uint64,
  uint256,
} from "@ethernauta/abi"
import {
  AddressSchema,
  BytesSchema,
  type Uint,
  UintSchema,
} from "@ethernauta/core"
import { eth_call } from "@ethernauta/eth"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"

import { NODE_INTERFACE_ADDRESS } from "../precompiles/node-interface/address"

export const EstimateArbitrumFeesParametersSchema = object({
  tx: object({
    to: AddressSchema,
    input: optional(BytesSchema),
  }),
})
export type EstimateArbitrumFeesParameters = InferOutput<
  typeof EstimateArbitrumFeesParametersSchema
>

export const ArbitrumFeesSchema = object({
  gas_estimate: UintSchema,
  l1_base_fee_estimate: UintSchema,
  l2_base_fee: UintSchema,
})
export type ArbitrumFees = InferOutput<
  typeof ArbitrumFeesSchema
>

const EMPTY_BYTES = parse(BytesSchema, "0x")
const PARAM_CODECS = [
  address(),
  bool_codec(),
  bytes(),
] as const
const OUTPUT_CODECS = [
  uint64(),
  uint64(),
  uint256(),
  uint256(),
] as const

function to_compact_uint(_padded: `0x${string}`): Uint {
  return parse(
    UintSchema,
    `0x${BigInt(_padded).toString(16)}`,
  )
}

export function estimate_arbitrum_fees(
  _parameters: EstimateArbitrumFeesParameters,
): Readable<ArbitrumFees> {
  return async (
    resolved: ResolvedReader,
  ): Promise<ArbitrumFees> => {
    const parameters = parse(
      EstimateArbitrumFeesParametersSchema,
      _parameters,
    )
    const input = parameters.tx.input ?? EMPTY_BYTES
    const calldata = encode_function_call({
      name: "gasEstimateComponents",
      args: PARAM_CODECS,
      values: [parameters.tx.to, false, input] as const,
    })
    const result = await eth_call([
      {
        to: NODE_INTERFACE_ADDRESS,
        input: parse(BytesSchema, bytes_to_hex(calldata)),
      },
    ])(resolved)
    const [gas_estimate, _gas_l1, base_fee, l1_base_fee] =
      decode_function_result(OUTPUT_CODECS, result)
    return parse(ArbitrumFeesSchema, {
      gas_estimate: to_compact_uint(gas_estimate),
      l1_base_fee_estimate: to_compact_uint(l1_base_fee),
      l2_base_fee: to_compact_uint(base_fee),
    })
  }
}
