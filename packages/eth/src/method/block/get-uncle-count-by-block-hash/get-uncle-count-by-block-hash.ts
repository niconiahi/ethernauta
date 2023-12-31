import type { Input } from "valibot"
import { object, parse, tuple, union } from "valibot"

import type { Readable, Reader } from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"

import type { NotFound, Uint } from "../../../base"
import { hash32Schema, notFoundSchema, uintSchema } from "../../../base"

const parametersSchema = union([
  tuple([hash32Schema]),
  object({ blockHash: hash32Schema }),
])
type Parameters = Input<typeof parametersSchema>
export function getUncleCountByBlockHash(_parameters: Parameters): Readable<Uint | NotFound> {
  return async (reader: Reader): Promise<Uint | NotFound> => {
    const method = "eth_getUncleCountByBlockHash"
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
