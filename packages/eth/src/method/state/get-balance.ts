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
  tuple([AddressSchema]),
  object({
    address: AddressSchema,
    blockNumberOrTagOrHash: BlockNumberOrTagOrHashSchema,
  }),
  object({ address: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns The account's balance
 */
export function eth_getBalance(
  _parameters: Parameters,
): Readable<Uint> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Uint> => {
    const method = "eth_getBalance"
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
