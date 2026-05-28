import type { Bytes } from "@ethernauta/core"
import { BytesSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { BlockNumberOrTagOrHashSchema } from "../../core/block"
import { GenericTransactionSchema } from "../../core/transaction"

const ParametersSchema = union([
  tuple([GenericTransactionSchema]),
  tuple([
    GenericTransactionSchema,
    BlockNumberOrTagOrHashSchema,
  ]),
  object({ transaction: GenericTransactionSchema }),
  object({
    transaction: GenericTransactionSchema,
    blockNumberOrTagOrHash: BlockNumberOrTagOrHashSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>
export function eth_call(
  _parameters: Parameters,
): Readable<Bytes> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Bytes> => {
    const method = "eth_call"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(BytesSchema, response.result)
    return result
  }
}
