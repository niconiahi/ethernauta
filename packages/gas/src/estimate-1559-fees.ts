// https://eips.ethereum.org/EIPS/eip-1559

import { type Uint, uintSchema } from "@ethernauta/core"
import { eth_feeHistory } from "@ethernauta/eth"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { bigint_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  maxValue,
  minValue,
  number,
  object,
  parse,
  pipe,
  tupleWithRest,
} from "valibot"

const percentileSchema = pipe(
  number(),
  minValue(0),
  maxValue(100),
)
const multiplierSchema = pipe(number(), minValue(1))

export const estimate1559FeesParametersSchema = object({
  base_fee_multiplier: multiplierSchema,
  priority_percentile: percentileSchema,
})
export type Estimate1559FeesParameters = InferOutput<
  typeof estimate1559FeesParametersSchema
>

export const fees1559Schema = object({
  base_fee_per_gas: uintSchema,
  max_priority_fee_per_gas: uintSchema,
  max_fee_per_gas: uintSchema,
})
export type Fees1559 = InferOutput<typeof fees1559Schema>

// Sample window matches viem's default: enough blocks to
// smooth single-block volatility, few enough to react quickly.
const SAMPLE_BLOCK_COUNT: Uint = parse(uintSchema, "0x4")
// Fixed-point precision for the base-fee × multiplier step.
// 1e6 keeps the multiplier resolution at 6 decimal digits
// while staying within safe-integer math.
const MULTIPLIER_PRECISION = 1_000_000n

const rewardRowSchema = tupleWithRest(
  [uintSchema],
  uintSchema,
)
const rewardMatrixSchema = tupleWithRest(
  [rewardRowSchema],
  rewardRowSchema,
)
const baseFeeListSchema = tupleWithRest(
  [uintSchema],
  uintSchema,
)

export function estimate_1559_fees(
  _parameters: Estimate1559FeesParameters,
): Readable<Fees1559> {
  return async (
    resolved: ResolvedReader,
  ): Promise<Fees1559> => {
    const parameters = parse(
      estimate1559FeesParametersSchema,
      _parameters,
    )
    const fee_history = await eth_feeHistory({
      blockCount: SAMPLE_BLOCK_COUNT,
      newestBlock: "latest",
      rewardPercentiles: [parameters.priority_percentile],
    })(resolved)
    const matrix = parse(
      rewardMatrixSchema,
      fee_history.reward,
    )
    const samples = matrix.map((row) => BigInt(row[0]))
    const sum = samples.reduce((a, b) => a + b, 0n)
    const priority = sum / BigInt(samples.length)
    // baseFeePerGas is ordered oldest → newest; the last
    // entry is the next-block predicted fee. Reverse so the
    // tuple schema can pin its non-emptiness at [0].
    const reversed_base_fees = parse(
      baseFeeListSchema,
      [...fee_history.baseFeePerGas].reverse(),
    )
    const base = BigInt(reversed_base_fees[0])
    const scaled_multiplier = BigInt(
      Math.round(
        parameters.base_fee_multiplier *
          Number(MULTIPLIER_PRECISION),
      ),
    )
    const max_fee =
      (base * scaled_multiplier) / MULTIPLIER_PRECISION +
      priority
    return parse(fees1559Schema, {
      base_fee_per_gas: bigint_to_hex(base),
      max_priority_fee_per_gas: bigint_to_hex(priority),
      max_fee_per_gas: bigint_to_hex(max_fee),
    })
  }
}
