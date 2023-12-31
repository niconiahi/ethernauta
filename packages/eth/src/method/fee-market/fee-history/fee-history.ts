import type { Input } from "valibot"
import { array, maxValue, minValue, number, object, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { ratioSchema, uintSchema } from "../../../base"
import { blockNumberOrTagSchema } from "../../../block"

const percentileSchema = number([minValue(0), maxValue(100)])
const rewardsSchema = array(percentileSchema)
const parametersSchema = union([
  tuple([uintSchema, blockNumberOrTagSchema, array(percentileSchema)]),
  object({
    blockCount: uintSchema,
    newestBlock: blockNumberOrTagSchema,
    rewardPercentiles: rewardsSchema,
  }),
])
type Parameters = Input<typeof parametersSchema>
const feeHistoryResultsSchema = object({
  oldestBlock: uintSchema,
  baseFeePerGas: array(uintSchema),
  gasUsedRatio: array(ratioSchema),
  reward: array(rewardsSchema),
})
export type FeeHistoryResults = Input<typeof feeHistoryResultsSchema>
/**
 * @returns Fee history for the returned block range. This can be a subsection of the requested range if not all blocks are available
 */
export function feeHistory(_parameters: Parameters): Readable<FeeHistoryResults> {
  return async (reader: Reader): Promise<FeeHistoryResults> => {
    const method = "eth_feeHistory"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(feeHistoryResultsSchema, response.result)
    return result
  }
}
