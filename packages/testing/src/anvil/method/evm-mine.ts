// https://getfoundry.sh/anvil/custom-methods#mining-control
//
// Anvil signature: `evm_mine(opts: Option<MineOptions>) ->
// Result<String>` (see `crates/anvil/src/eth/api.rs`). Mines the
// requested block(s) regardless of mining mode and advances the
// chain timestamp. Anvil hard-codes the response to the
// placeholder string `"0x0"` (a ganache compatibility quirk —
// the foundry source explicitly notes ganache reserved this
// slot for future meta-data). We parse with `BytesSchema`
// because the value is opaque and the caller never inspects it.

import { BytesSchema, UintSchema } from "@ethernauta/core"
import type { Bytes } from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
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
): Writable<Bytes> {
  return async ([
    transports,
    _context,
  ]: ResolvedWriter): Promise<Bytes> => {
    const method = "evm_mine"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(BytesSchema, response.result)
    return result
  }
}
