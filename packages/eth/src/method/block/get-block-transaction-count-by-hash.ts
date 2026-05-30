import type { NotFound, Uint } from "@ethernauta/core"
import {
  Hash32Schema,
  NotFoundSchema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const ParametersSchema = union([
  tuple([Hash32Schema]),
  object({ blockHash: Hash32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
export function eth_getBlockTransactionCountByHash(
  _parameters: Parameters,
): Readable<Uint | NotFound> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint | NotFound> => {
    const method = "eth_getBlockTransactionCountByHash"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([UintSchema, NotFoundSchema]),
      response.result,
    )
    return result
  }
}
