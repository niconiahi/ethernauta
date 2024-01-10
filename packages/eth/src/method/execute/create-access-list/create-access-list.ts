import type { Input } from "valibot"
import { object, parse, string, tuple, union } from "valibot"

import type { Writable, Writer } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import { uintSchema } from "../../../core/base"
import { blockNumberOrTagOrHashSchema } from "../../../core/block"
import { accessListSchema, genericTransactionSchema } from "../../../core/transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  tuple([genericTransactionSchema, blockNumberOrTagOrHashSchema]),
  object({ transaction: genericTransactionSchema }),
  object({ transaction: genericTransactionSchema, blockNumberOrTagOrHash: blockNumberOrTagOrHashSchema }),
])
type Parameters = Input<typeof parametersSchema>
const accessListResultSchema = object({
  accessList: accessListSchema,
  error: string(),
  gasUsed: uintSchema,
})
type Response = Input<typeof accessListResultSchema>
export function eth_createAccessList(_parameters: Parameters): Writable<Response> {
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
