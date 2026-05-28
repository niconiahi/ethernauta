// https://book.getfoundry.sh/reference/anvil/#custom-methods
//
// `anvil_setBalance` overwrites an account's native-ETH balance
// to the requested wei amount. Useful for funding test accounts
// against a fork where the default pre-funded mnemonic accounts
// do not exist. Anvil returns `null` on success.

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
    transports,
    _context,
  ]: ResolvedWriter): Promise<null> => {
    const method = "anvil_setBalance"
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
