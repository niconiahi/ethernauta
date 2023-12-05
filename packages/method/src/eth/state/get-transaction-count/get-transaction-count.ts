import type { Uint } from "@ethernauta/core"
import { blockNumberOrTag, hash32Schema, uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { parse, tuple, union } from "valibot"

const parametersSchema = union([
  tuple([hash32Schema]),
  tuple([hash32Schema, blockNumberOrTag]),
])
type Parameters = Input<typeof parametersSchema>
/**
 * Returns the number of transactions sent from an address.
 * @param address The address being requested
 * @param blockNumberOrTagOrHash The block number or tag or hash being requested
 * @returns The account's balance
 */
export function getTransactionCount(_parameters: Parameters): Readable<Uint> {
  return async (reader: Reader): Promise<Uint> => {
    const method = "eth_getTransactionCount"
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
