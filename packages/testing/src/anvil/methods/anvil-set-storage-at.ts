// https://getfoundry.sh/anvil/custom-methods#balance-and-code-manipulation
//
// Anvil signature: `anvil_set_storage_at(address: Address,
// slot: U256, val: B256) -> Result<bool>` (see
// `crates/anvil/src/eth/api.rs`). Overwrites a single 32-byte
// storage slot. The slot key is a `U256` (the keccak of the
// Solidity storage layout, accepted as compact hex per the
// uint encoding); the value is a `B256` 32-byte word. Returns
// `true` on success.

import {
  AddressSchema,
  Bytes32Schema,
  UintSchema,
} from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"

const ParametersSchema = union([
  tuple([AddressSchema, UintSchema, Bytes32Schema]),
  object({
    address: AddressSchema,
    slot: UintSchema,
    value: Bytes32Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function anvil_setStorageAt(
  _parameters: Parameters,
): Writable<boolean> {
  return async ([
    transports,
    _context,
  ]: ResolvedWriter): Promise<boolean> => {
    const method = "anvil_setStorageAt"
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
