// https://book.getfoundry.sh/reference/anvil/#custom-methods
//
// `anvil_setCode` overwrites the deployed bytecode at an
// address. The `code` argument is the runtime bytecode as
// 0x-prefixed hex. Useful for swapping a contract's
// implementation in-place during a test without redeploying.
// Anvil returns `null` on success.

import { AddressSchema, BytesSchema } from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { null_, object, parse, tuple, union } from "valibot"

const ParametersSchema = union([
  tuple([AddressSchema, BytesSchema]),
  object({ address: AddressSchema, code: BytesSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function anvil_setCode(
  _parameters: Parameters,
): Writable<null> {
  return async ([
    transports,
    _context,
  ]: ResolvedWriter): Promise<null> => {
    const method = "anvil_setCode"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(null_(), response.result)
    return result
  }
}
