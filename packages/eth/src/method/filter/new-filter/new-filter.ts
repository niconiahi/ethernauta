import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Http, Readable } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { uintSchema } from "../../../core/base"
import type { Bytes } from "../../../core/base"
import { filterSchema } from "../../../core/filter"

const parametersSchema = union([
  tuple([filterSchema]),
  object({ filter: filterSchema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The created filter
 */
export function eth_newFilter(_parameters: Parameters): Readable<Bytes> {
  return async (transports: Http[]): Promise<Bytes> => {
    const method = "eth_newFilter"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map(transport => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
