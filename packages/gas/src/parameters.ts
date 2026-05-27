// Discriminated-union input schema for `calculate_gas`. Each family
// is one arm; the `kind` discriminator picks the matching arm at
// runtime and gives consumers exhaustive type-narrowing.

import type { InferOutput } from "valibot"
import { literal, object, variant } from "valibot"

import { calculateGasArbitrumParametersSchema } from "./chains/arbitrum/calculate-gas-arbitrum"
import { calculateGasOpStackParametersSchema } from "./chains/op-stack/calculate-gas-op-stack"
import { calculateGasZksyncParametersSchema } from "./chains/zksync/calculate-gas-zksync"
import { estimate1559FeesParametersSchema } from "./estimate-1559-fees"

const fees1559InputSchema = object({
  kind: literal("1559"),
  ...estimate1559FeesParametersSchema.entries,
})

const opStackInputSchema = object({
  kind: literal("op-stack"),
  ...calculateGasOpStackParametersSchema.entries,
})

const arbitrumInputSchema = object({
  kind: literal("arbitrum"),
  ...calculateGasArbitrumParametersSchema.entries,
})

const zksyncInputSchema = object({
  kind: literal("zksync"),
  ...calculateGasZksyncParametersSchema.entries,
})

export const calculateGasParametersSchema = variant("kind", [
  fees1559InputSchema,
  opStackInputSchema,
  arbitrumInputSchema,
  zksyncInputSchema,
])
export type CalculateGasParameters = InferOutput<
  typeof calculateGasParametersSchema
>
