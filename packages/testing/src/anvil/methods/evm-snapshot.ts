// https://getfoundry.sh/anvil/custom-methods#state-snapshots
//
// Anvil signature: `evm_snapshot() -> Result<U256>` (see
// `crates/anvil/src/eth/api.rs` in foundry-rs/foundry). Freezes
// the current EVM state and returns an opaque U256 id encoded as
// hex; pass that id to `evm_revert` to roll the chain back. The
// id is opaque to callers, so we parse with `BytesSchema` rather
// than `UintSchema` — anvil's hex encoding has no leading-zero
// guarantees the strict uint regex requires.

import { type Bytes, BytesSchema } from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

export function evm_snapshot(): Readable<Bytes> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Bytes> => {
    const method = "evm_snapshot"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(BytesSchema, response.result)
    return result
  }
}
