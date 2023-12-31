import type { Input } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import type { NotFound } from "../../../base"
import { notFoundSchema } from "../../../base"
import { blockNumberOrTagSchema, blockSchema } from "../../../block"
import type { Block } from "../../../block"

const parametersSchema = union([
  tuple([blockNumberOrTagSchema, boolean()]),
  object({
    blockNumberOrTag: blockNumberOrTagSchema,
    hydratedTransactions: boolean(),
  }),
])
type Parameters = Input<typeof parametersSchema>
export function getBlockByNumber(_parameters: Parameters): Readable<Block | NotFound> {
  return async (reader: Reader): Promise<Block | NotFound> => {
    const method = "eth_getBlockByNumber"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([blockSchema, notFoundSchema]), response.result)
    return result
  }
}
