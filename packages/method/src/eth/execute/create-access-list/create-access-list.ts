import { accessListSchema, blockNumberOrTagOrHash, genericTransactionSchema, uintSchema } from "@ethernauta/core"
import type { Writable, Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { Input } from "valibot"
import { object, parse, string, tuple, union } from "valibot"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  tuple([genericTransactionSchema, blockNumberOrTagOrHash]),
])
type Parameters = Input<typeof parametersSchema>
const accessListResultSchema = object({
  accessList: accessListSchema,
  error: string(),
  gasUsed: uintSchema,
})
type Response = Input<typeof accessListResultSchema>
/**
 * Executes a new message call immediately without creating a transaction on the block chain
 * @param transaction The transaction object to be sent
 * @param blockNumberOrTag The block number or tag where to execute the call
 * @returns The returned data
 */
export function createAccessList(_parameters: Parameters): Writable<Response> {
  return async (writer: Writer): Promise<Response> => {
    const method = "eth_createAccessList"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await writer(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }

    const result = parse(accessListResultSchema, response.result)

    return result
  }
}
