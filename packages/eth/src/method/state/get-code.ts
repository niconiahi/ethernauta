import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Uint } from "@ethernauta/core"
import { addressSchema, uintSchema } from "@ethernauta/core"
import { blockNumberOrTagOrHashSchema } from "../../core/block"

const parametersSchema = union([
  tuple([addressSchema]),
  tuple([addressSchema, blockNumberOrTagOrHashSchema]),
  object({
    address: addressSchema,
    blockNumberOrTagOrHash: blockNumberOrTagOrHashSchema,
  }),
  object({ address: addressSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns Code at a given address
 */
export function eth_getCode(
  _parameters: Parameters,
): Readable<Uint> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Uint> => {
    const method = "eth_getCode"
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
