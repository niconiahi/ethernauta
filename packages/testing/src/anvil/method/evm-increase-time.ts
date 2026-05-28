// https://book.getfoundry.sh/reference/anvil/#custom-methods
//
// `evm_increaseTime` jumps the block-timestamp clock forward by
// the requested number of seconds. Anvil returns the new
// timestamp as a hex-encoded integer; we parse with `UintSchema`
// to keep the value in the project's hex-string brand rather
// than unboxing to JS bigint.

import { UintSchema, type Uint } from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const ParametersSchema = union([
  tuple([UintSchema]),
  object({ seconds: UintSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function evm_increaseTime(
  _parameters: Parameters,
): Writable<Uint> {
  return async ([
    transports,
    _context,
  ]: ResolvedWriter): Promise<Uint> => {
    const method = "evm_increaseTime"
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
