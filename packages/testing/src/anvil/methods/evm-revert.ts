// https://getfoundry.sh/anvil/custom-methods#state-snapshots
//
// Anvil signature: `evm_revert(id: U256) -> Result<bool>` (see
// `crates/anvil/src/eth/api.rs`). Rolls the chain back to the
// state captured by a prior `evm_snapshot`. Returns `true` if
// the id was valid, `false` otherwise — anvil discards a
// snapshot once it is reverted. The parameter is the opaque
// hex id `evm_snapshot` returned; we accept it as `Bytes` to
// match `evm_snapshot`'s return shape.

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
  object({ snapshotId: BytesSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function evm_revert(
  _parameters: Parameters,
): Writable<boolean> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedWriter): Promise<boolean> => {
    const method = "evm_revert"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(boolean(), response.result)
    return result
  }
}
