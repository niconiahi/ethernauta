// Coarse Arbitrum gas estimator. Single call to the NodeInterface
// precompile's `gasEstimateComponents(to, false, data)`, which the
// Nitro node intercepts and answers with the L2-execution +
// L1-batch-posting split. Simpler than OP-stack because Arbitrum
// hands back all four numbers in one shot — no separate L1-fee read.

import {
  addressSchema,
  bytesSchema,
  type Uint,
  uintSchema,
} from "@ethernauta/core"
import { eth_call } from "@ethernauta/eth"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { literal, object, optional, parse } from "valibot"

import { gasEstimateComponents } from "./node-interface/methods/gas-estimate-components"
import { NODE_INTERFACE_PREDEPLOY } from "./predeploy"

export const calculateGasArbitrumParametersSchema = object({
  tx: object({
    to: addressSchema,
    input: optional(bytesSchema),
  }),
})
export type CalculateGasArbitrumParameters = InferOutput<
  typeof calculateGasArbitrumParametersSchema
>

export const calculateGasArbitrumFeesSchema = object({
  kind: literal("arbitrum"),
  gas_estimate: uintSchema,
  l1_base_fee_estimate: uintSchema,
  l2_base_fee: uintSchema,
})
export type CalculateGasArbitrumFees = InferOutput<
  typeof calculateGasArbitrumFeesSchema
>

const EMPTY_BYTES = parse(bytesSchema, "0x")

function to_compact_uint(_padded: `0x${string}`): Uint {
  return parse(
    uintSchema,
    `0x${BigInt(_padded).toString(16)}`,
  )
}

export function calculate_gas_arbitrum(
  _parameters: CalculateGasArbitrumParameters,
): Readable<CalculateGasArbitrumFees> {
  return async (
    resolved: ResolvedReader,
  ): Promise<CalculateGasArbitrumFees> => {
    const parameters = parse(
      calculateGasArbitrumParametersSchema,
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
      { to: NODE_INTERFACE_PREDEPLOY, input: callable.data },
    ])(resolved)
    const [gas_estimate, _gas_l1, base_fee, l1_base_fee] =
      callable.decode(result)
    return parse(calculateGasArbitrumFeesSchema, {
      kind: "arbitrum",
      gas_estimate: to_compact_uint(gas_estimate),
      l1_base_fee_estimate: to_compact_uint(l1_base_fee),
      l2_base_fee: to_compact_uint(base_fee),
    })
  }
}
