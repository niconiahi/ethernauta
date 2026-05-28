import type { NotFound, Uint } from "@ethernauta/core"
import {
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
import { BlockNumberOrTagSchema } from "../../core/block"

const ParametersSchema = union([
  tuple([BlockNumberOrTagSchema]),
  object({ blockHashOrTag: BlockNumberOrTagSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
export function eth_getBlockTransactionCountByNumber(
  _parameters: Parameters,
): Readable<Uint | NotFound> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Uint | NotFound> => {
    const method = "eth_getBlockTransactionCountByNumber"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
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
