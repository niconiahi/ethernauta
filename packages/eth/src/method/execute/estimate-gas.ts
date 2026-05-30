import type { Uint } from "@ethernauta/core"
import { UintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { BlockNumberOrTagSchema } from "../../core/block"
import { GenericTransactionSchema } from "../../core/transaction"

const ParametersSchema = union([
  tuple([GenericTransactionSchema]),
  tuple([GenericTransactionSchema, BlockNumberOrTagSchema]),
  object({ transaction: GenericTransactionSchema }),
  object({
    transaction: GenericTransactionSchema,
    blockNumberOrTag: BlockNumberOrTagSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>
export function eth_estimateGas(
  _parameters: Parameters,
): Readable<Uint> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint> => {
    const method = "eth_estimateGas"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(UintSchema, response.result)
    return result
  }
}
