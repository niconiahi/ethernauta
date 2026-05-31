// Coarse Arbitrum gas estimator. Single call to the NodeInterface
// precompile's `gasEstimateComponents(to, false, data)`, which the
// Nitro node intercepts and answers with the L2-execution +
// L1-batch-posting split. Simpler than OP-stack because Arbitrum
// hands back all four numbers in one shot — no separate L1-fee read.

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
import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"

import { gasEstimateComponents } from "./node-interface/methods/gas-estimate-components"
import { NODE_INTERFACE_PREDEPLOY } from "./predeploy"

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
    const callable = gasEstimateComponents({
      to: parameters.tx.to,
      contractCreation: false,
      data: input,
    })({
      chain_id: resolved[1].chain_id,
      to: NODE_INTERFACE_PREDEPLOY,
    })
    const result = await eth_call([
      {
        to: NODE_INTERFACE_PREDEPLOY,
        input: callable.data,
      },
    ])(resolved)
    const [gas_estimate, _gas_l1, base_fee, l1_base_fee] =
      callable.decode(result)
    return parse(ArbitrumFeesSchema, {
      gas_estimate: to_compact_uint(gas_estimate),
      l1_base_fee_estimate: to_compact_uint(l1_base_fee),
      l2_base_fee: to_compact_uint(base_fee),
    })
  }
}
