// https://getfoundry.sh/anvil/custom-methods#balance-and-code-manipulation
//
// Anvil signature: `anvil_set_balance(address: Address, balance:
// U256) -> Result<()>` (see `crates/anvil/src/eth/api.rs`).
// Overwrites an account's native-ETH balance to the requested
// wei amount. Returns JSON `null` on success. Useful for
// funding test accounts against a fork where the default
// pre-funded mnemonic accounts do not exist.

import { AddressSchema, UintSchema } from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { null_, object, parse, tuple, union } from "valibot"

const ParametersSchema = union([
  tuple([AddressSchema, UintSchema]),
  object({ address: AddressSchema, balance: UintSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function anvil_setBalance(
  _parameters: Parameters,
): Writable<null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedWriter): Promise<null> => {
    const method = "anvil_setBalance"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(null_(), response.result)
    return result
  }
}
