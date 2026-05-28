// https://getfoundry.sh/anvil/custom-methods#account-impersonation
//
// Anvil signature: `anvil_impersonate_account(address: Address)
// -> Result<()>` (see `crates/anvil/src/eth/api.rs`). Adds an
// address to anvil's unlocked set, letting tests submit
// transactions as that account without holding its private key.
// Returns JSON `null` on success. The companion
// `anvil_stopImpersonatingAccount` reverses it; we only ship
// the `impersonate` direction in v1 because the typical test
// pattern impersonates once and tears the whole anvil down at
// the end of the run.

import { AddressSchema } from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { null_, object, parse, tuple, union } from "valibot"

const ParametersSchema = union([
  tuple([AddressSchema]),
  object({ address: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function anvil_impersonateAccount(
  _parameters: Parameters,
): Writable<null> {
  return async ([
    transports,
    _context,
  ]: ResolvedWriter): Promise<null> => {
    const method = "anvil_impersonateAccount"
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
