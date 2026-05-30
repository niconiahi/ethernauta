// https://eips.ethereum.org/EIPS/eip-1559

import { type Uint, UintSchema } from "@ethernauta/core"
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
import { eth_feeHistory } from "../method/fee-market/fee-history"

const PercentileSchema = pipe(
  number(),
  minValue(0),
  maxValue(100),
)
export const EstimatePriorityFeeParametersSchema = object({
  block_count: UintSchema,
  percentile: PercentileSchema,
})
export type EstimatePriorityFeeParameters = InferOutput<
  typeof EstimatePriorityFeeParametersSchema
>

const RewardRowSchema = tupleWithRest(
  [UintSchema],
  UintSchema,
)
const RewardMatrixSchema = tupleWithRest(
  [RewardRowSchema],
  RewardRowSchema,
)

export function estimate_priority_fee(
  _parameters: EstimatePriorityFeeParameters,
): Readable<Uint> {
  return async (
    resolved: ResolvedReader,
  ): Promise<Uint> => {
    const parameters = parse(
      EstimatePriorityFeeParametersSchema,
      _parameters,
    )
    const fee_history = await eth_feeHistory({
      blockCount: parameters.block_count,
      newestBlock: "latest",
      rewardPercentiles: [parameters.percentile],
    })(resolved)
    const matrix = parse(
      RewardMatrixSchema,
      fee_history.reward,
    )
    const samples = matrix.map((row) => BigInt(row[0]))
    const sum = samples.reduce((a, b) => a + b, 0n)
    const average = sum / BigInt(samples.length)
    return parse(UintSchema, bigint_to_hex(average))
  }
}
