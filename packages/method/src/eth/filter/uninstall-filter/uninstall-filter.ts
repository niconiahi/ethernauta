import { uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { boolean, parse, tuple } from "valibot"

const parametersSchema = tuple([uintSchema])
type Parameters = Input<typeof parametersSchema>
/**
 * Uninstalls a filter with given id
 * @param filterIdentifier The filter identifier
 * @returns A boolean representing the success or failure of the action
 */
export function uninstallFilter(_parameters: Parameters): Readable<boolean> {
  return async (reader: Reader): Promise<boolean> => {
    const method = "eth_uninstallFilter"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(boolean(), response.result)
    return result
  }
}
