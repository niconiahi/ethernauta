// https://book.getfoundry.sh/reference/anvil/#custom-methods
//
// `evm_mine` mines the requested number of blocks (one when no
// argument is given) and advances the chain timestamp by the
// configured block-time or the explicit `timestamp` override.
// Anvil returns `null` on success.

import { UintSchema } from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  null_,
  object,
  optional,
  parse,
  tuple,
  union,
} from "valibot"

const OptionsSchema = object({
  timestamp: optional(UintSchema),
  blocks: optional(UintSchema),
})

const ParametersSchema = union([
  tuple([]),
  tuple([OptionsSchema]),
  object({
    timestamp: optional(UintSchema),
    blocks: optional(UintSchema),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function evm_mine(
  _parameters: Parameters = [],
): Writable<null> {
  return async ([
    transports,
    _context,
  ]: ResolvedWriter): Promise<null> => {
    const method = "evm_mine"
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
