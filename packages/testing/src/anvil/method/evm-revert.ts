// https://book.getfoundry.sh/reference/anvil/#custom-methods
//
// `evm_revert` rolls the chain back to the state captured by a
// prior `evm_snapshot`. Anvil returns `true` if the snapshot id
// was valid and the revert succeeded, `false` otherwise (the id
// was unknown or already consumed — anvil discards a snapshot
// once it is reverted).

import { BytesSchema } from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"

const ParametersSchema = union([
  tuple([BytesSchema]),
  object({ snapshotId: BytesSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function evm_revert(
  _parameters: Parameters,
): Writable<boolean> {
  return async ([
    transports,
    _context,
  ]: ResolvedWriter): Promise<boolean> => {
    const method = "evm_revert"
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
