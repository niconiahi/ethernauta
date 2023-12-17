import type { Bytes } from "@ethernauta/core"
import { filterSchema, uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

const parametersSchema = union([
  tuple([filterSchema]),
  object({ filter: filterSchema }),
])
type Parameters = Input<typeof parametersSchema>
/**
 * @returns The created filter
 */
export function newFilter(_parameters: Parameters): Readable<Bytes> {
  return async (reader: Reader): Promise<Bytes> => {
    const method = "eth_newFilter"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
