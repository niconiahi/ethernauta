import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { NotFound, Uint } from "@ethernauta/core"
import { blockNumberOrTagSchema, notFoundSchema, uintSchema } from "@ethernauta/core"
import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

const parametersSchema = union([
  tuple([blockNumberOrTagSchema]),
  object({ blockHashOrTag: blockNumberOrTagSchema }),
])
type Parameters = Input<typeof parametersSchema>
export function getBlockTransactionCountByNumber(_parameters: Parameters): Readable<Uint | NotFound> {
  return async (reader: Reader): Promise<Uint | NotFound> => {
    const method = "eth_getBlockTransactionCountByNumber"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await reader(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(union([uintSchema, notFoundSchema]), response.result)
    return result
  }
}
