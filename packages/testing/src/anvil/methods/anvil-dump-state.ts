// https://github.com/foundry-rs/foundry/blob/master/crates/anvil/src/eth/api.rs
// (the official getfoundry.sh "custom methods" page does not
// document anvil_dumpState/loadState as of writing; the source
// is the authoritative reference.)
//
// Anvil signature: `anvil_dump_state(preserve_historical_states:
// Option<bool>) -> Result<Bytes>`. Serialises the entire anvil
// chain state to a 0x-prefixed hex blob that can be fed back
// into `anvil_loadState` to restore it. Pass `true` to also
// preserve historical block states (default `false`). The blob
// is opaque to the consumer; do not parse it.

import { type Bytes, BytesSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  optional,
  parse,
  tuple,
  union,
} from "valibot"

const ParametersSchema = union([
  tuple([]),
  tuple([boolean()]),
  object({ preserveHistoricalStates: optional(boolean()) }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function anvil_dumpState(
  _parameters: Parameters = [],
): Readable<Bytes> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Bytes> => {
    const method = "anvil_dumpState"
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
