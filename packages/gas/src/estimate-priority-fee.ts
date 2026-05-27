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
export const estimatePriorityFeeParametersSchema = object({
  block_count: uintSchema,
  percentile: percentileSchema,
})
export type EstimatePriorityFeeParameters = InferOutput<
  typeof estimatePriorityFeeParametersSchema
>

const rewardRowSchema = tupleWithRest(
  [uintSchema],
  uintSchema,
)
const rewardMatrixSchema = tupleWithRest(
  [rewardRowSchema],
  rewardRowSchema,
)

export function estimate_priority_fee(
  _parameters: EstimatePriorityFeeParameters,
): Readable<Uint> {
  return async (
    resolved: ResolvedReader,
  ): Promise<Uint> => {
    const parameters = parse(
      estimatePriorityFeeParametersSchema,
      _parameters,
    )
    const fee_history = await eth_feeHistory({
      blockCount: parameters.block_count,
      newestBlock: "latest",
      rewardPercentiles: [parameters.percentile],
    })(resolved)
    const matrix = parse(
      rewardMatrixSchema,
      fee_history.reward,
    )
    const samples = matrix.map((row) => BigInt(row[0]))
    const sum = samples.reduce((a, b) => a + b, 0n)
    const average = sum / BigInt(samples.length)
    return parse(uintSchema, bigint_to_hex(average))
  }
}
