import type { Bytes } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { blockNumberOrTagOrHashSchema } from "../../core/block"

const parametersSchema = union([
  tuple([addressSchema, blockNumberOrTagOrHashSchema]),
  object({
    address: addressSchema,
    blockNumberOrTagOrHash: blockNumberOrTagOrHashSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>
/**
 * @returns Code at a given address. EOAs return `"0x"` (empty bytes).
 */
export function eth_getCode(
  _parameters: Parameters,
): Readable<Bytes> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<Bytes> => {
    const method = "eth_getCode"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }

    const result = parse(bytesSchema, response.result)

    return result
  }
}
