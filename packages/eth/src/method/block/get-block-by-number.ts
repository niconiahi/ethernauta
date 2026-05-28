import type { NotFound } from "@ethernauta/core"
import { NotFoundSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"
import type { Block } from "../../core/block"
import {
  BlockNumberOrTagSchema,
  BlockSchema,
} from "../../core/block"

const ParametersSchema = union([
  tuple([BlockNumberOrTagSchema, boolean()]),
  object({
    blockNumberOrTag: BlockNumberOrTagSchema,
    hydratedTransactions: boolean(),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>
export function eth_getBlockByNumber(
  _parameters: Parameters,
): Readable<Block | NotFound> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Block | NotFound> => {
    const method = "eth_getBlockByNumber"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      union([BlockSchema, NotFoundSchema]),
      response.result,
    )
    return result
  }
}
