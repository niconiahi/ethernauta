import type { Uint } from "@ethernauta/core"
import { AddressSchema, UintSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { BlockNumberOrTagOrHashSchema } from "../../core/block"

const ParametersSchema = union([
  tuple([AddressSchema, BlockNumberOrTagOrHashSchema]),
  object({
    address: AddressSchema,
    blockNumberOrTagOrHash: BlockNumberOrTagOrHashSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns The number of transactions sent from an address
 */
export function eth_getTransactionCount(
  _parameters: Parameters,
): Readable<Uint> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Uint> => {
    const method = "eth_getTransactionCount"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.race(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(UintSchema, response.result)
    return result
  }
}
