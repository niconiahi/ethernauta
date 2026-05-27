import { ratioSchema, uintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
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
import { blockNumberOrTagSchema } from "../../core/block"

const percentileSchema = pipe(
  number(),
  minValue(0),
  maxValue(100),
)
const rewardPercentilesSchema = array(percentileSchema)
const parametersSchema = union([
  tuple([
    uintSchema,
    blockNumberOrTagSchema,
    rewardPercentilesSchema,
  ]),
  object({
    blockCount: uintSchema,
    newestBlock: blockNumberOrTagSchema,
    rewardPercentiles: rewardPercentilesSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
const rewardSchema = array(uintSchema)
const feeHistoryResultsSchema = object({
  oldestBlock: uintSchema,
  baseFeePerGas: array(uintSchema),
  gasUsedRatio: array(ratioSchema),
  reward: array(rewardSchema),
})
export type FeeHistoryResults = InferOutput<
  typeof feeHistoryResultsSchema
>
/**
 * @returns Fee history for the returned block range. This can be a subsection of the requested range if not all blocks are available
 */
export function eth_feeHistory(
  _parameters: Parameters,
): Readable<FeeHistoryResults> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<FeeHistoryResults> => {
    const method = "eth_feeHistory"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      feeHistoryResultsSchema,
      response.result,
    )
    return result
  }
}
