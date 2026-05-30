import { RatioSchema, UintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  array,
  maxValue,
  minValue,
  number,
  object,
  parse,
  pipe,
  tuple,
  union,
} from "valibot"
import { BlockNumberOrTagSchema } from "../../core/block"

const PercentileSchema = pipe(
  number(),
  minValue(0),
  maxValue(100),
)
const RewardPercentilesSchema = array(PercentileSchema)
const ParametersSchema = union([
  tuple([
    UintSchema,
    BlockNumberOrTagSchema,
    RewardPercentilesSchema,
  ]),
  object({
    blockCount: UintSchema,
    newestBlock: BlockNumberOrTagSchema,
    rewardPercentiles: RewardPercentilesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>
const RewardSchema = array(UintSchema)
const FeeHistoryResultsSchema = object({
  oldestBlock: UintSchema,
  baseFeePerGas: array(UintSchema),
  gasUsedRatio: array(RatioSchema),
  reward: array(RewardSchema),
})
export type FeeHistoryResults = InferOutput<
  typeof FeeHistoryResultsSchema
>
/**
 * @returns Fee history for the returned block range. This can be a subsection of the requested range if not all blocks are available
 */
export function eth_feeHistory(
  _parameters: Parameters,
): Readable<FeeHistoryResults> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<FeeHistoryResults> => {
    const method = "eth_feeHistory"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      FeeHistoryResultsSchema,
      response.result,
    )
    return result
  }
}
