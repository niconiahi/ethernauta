import type { Hash32 } from "@ethernauta/core"
import { BytesSchema, Hash32Schema } from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const ParametersSchema = union([
  tuple([BytesSchema]),
  object({ transaction: BytesSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns The transaction hash
 */
export function eth_sendRawTransaction(
  _parameters: Parameters,
): Writable<Hash32> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedWriter): Promise<Hash32> => {
    const method = "eth_sendRawTransaction"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(Hash32Schema, response.result)
    return result
  }
}
