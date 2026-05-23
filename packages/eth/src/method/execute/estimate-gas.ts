import type { Uint } from "@ethernauta/core"
import { uintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { blockNumberOrTagSchema } from "../../core/block"
import { genericTransactionSchema } from "../../core/transaction"

const parametersSchema = union([
  tuple([genericTransactionSchema]),
  tuple([genericTransactionSchema, blockNumberOrTagSchema]),
  object({ transaction: genericTransactionSchema }),
  object({
    transaction: genericTransactionSchema,
    blockNumberOrTag: blockNumberOrTagSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
export function eth_estimateGas(
  _parameters: Parameters,
): Readable<Uint> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Uint> => {
    const method = "eth_estimateGas"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(uintSchema, response.result)
    return result
  }
}
