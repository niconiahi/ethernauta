import type { NotFound } from "@ethernauta/core"
import {
  hash32Schema,
  notFoundSchema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"
import type { Block } from "../../core/block"
import { blockSchema } from "../../core/block"

const parametersSchema = union([
  tuple([hash32Schema, boolean()]),
  object({
    blockHash: hash32Schema,
    hydratedTransactions: boolean(),
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function eth_getBlockByHash(
  _parameters: Parameters,
): Readable<Block | NotFound> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Block | NotFound> => {
    const method = "eth_getBlockByHash"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([blockSchema, notFoundSchema]),
      response.result,
    )
    return result
  }
}
