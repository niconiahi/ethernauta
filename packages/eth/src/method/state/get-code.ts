import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
} from "@ethernauta/core"
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
 * @returns Code at a given address. EOAs return `"0x"` (empty bytes).
 */
export function eth_getCode(
  _parameters: Parameters,
): Readable<Bytes> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Bytes> => {
    const method = "eth_getCode"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }

    const result = parse(BytesSchema, response.result)

    return result
  }
}
