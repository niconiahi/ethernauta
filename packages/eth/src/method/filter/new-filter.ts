import type { Uint } from "@ethernauta/core"
import { UintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { FilterSchema } from "../../core/filter"

const ParametersSchema = union([
  tuple([FilterSchema]),
  object({ filter: FilterSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns The created filter's identifier
 */
export function eth_newFilter(
  _parameters: Parameters,
): Readable<Uint> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Uint> => {
    const method = "eth_newFilter"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(UintSchema, response.result)
    return result
  }
}
