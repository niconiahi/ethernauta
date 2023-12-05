import { blockNumberOrTag, ratioSchema, uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { array, maxValue, minValue, number, object, parse, tuple } from "valibot"

const percentileSchema = number([minValue(0), maxValue(100)])
const rewardsSchema = array(percentileSchema)
const parametersSchema = tuple([uintSchema, blockNumberOrTag, array(percentileSchema)])
type Parameters = Input<typeof parametersSchema>
const feeHistoryResultsSchema = object({
  oldestBlock: uintSchema,
  baseFeePerGas: array(uintSchema),
  gasUsedRatio: array(ratioSchema),
  reward: array(rewardsSchema),
})
export type FeeHistoryResults = Input<typeof feeHistoryResultsSchema>
/**
 * Returns code at a given address
 * @param blockCount Requested range of blocks. Clients will return less than the requested range if not all blocks are available
 * @param newestBlock Highest block of the requested range
 * @param rewardPercentiles A monotonically increasing list of percentile values. For each block in the requested range, the transactions will be sorted in ascending order by effective tip per gas and the coresponding effective tip for the percentile will be determined, accounting for gas consumed
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
