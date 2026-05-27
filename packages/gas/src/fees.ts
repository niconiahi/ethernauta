// Discriminated-union return schema for `calculate_gas`. Mirrors
// `parameters.ts` — same `kind` discriminator, one arm per family.

import type { InferOutput } from "valibot"
import { literal, object, variant } from "valibot"

import { calculateGasArbitrumFeesSchema } from "./chains/arbitrum/calculate-gas-arbitrum"
import { calculateGasOpStackFeesSchema } from "./chains/op-stack/calculate-gas-op-stack"
import { calculateGasZksyncFeesSchema } from "./chains/zksync/calculate-gas-zksync"
import { fees1559Schema } from "./estimate-1559-fees"

const fees1559ReturnSchema = object({
  kind: literal("1559"),
  ...fees1559Schema.entries,
})

export const calculateGasFeesSchema = variant("kind", [
  fees1559ReturnSchema,
  calculateGasOpStackFeesSchema,
  calculateGasArbitrumFeesSchema,
  calculateGasZksyncFeesSchema,
])
export type CalculateGasFees = InferOutput<
  typeof calculateGasFeesSchema
>
