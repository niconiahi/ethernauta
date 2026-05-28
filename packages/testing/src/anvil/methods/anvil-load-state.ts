// https://github.com/foundry-rs/foundry/blob/master/crates/anvil/src/eth/api.rs
// (the official getfoundry.sh "custom methods" page does not
// document anvil_dumpState/loadState as of writing; the source
// is the authoritative reference.)
//
// Anvil signature: `anvil_load_state(buf: Bytes) -> Result<bool>`.
// Restores chain state from a blob produced by
// `anvil_dumpState`. Returns `true` on success. Loading merges
// into the current state rather than replacing it — call
// `anvil_reset` (not currently wrapped) first if a clean swap
// is needed.

import { BytesSchema } from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const ParametersSchema = union([
  tuple([BytesSchema]),
  object({ state: BytesSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function anvil_loadState(
  _parameters: Parameters,
): Writable<boolean> {
  return async ([
    transports,
    _context,
  ]: ResolvedWriter): Promise<boolean> => {
    const method = "anvil_loadState"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(boolean(), response.result)
    return result
  }
}
