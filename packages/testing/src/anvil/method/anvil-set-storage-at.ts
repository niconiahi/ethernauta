// https://book.getfoundry.sh/reference/anvil/#custom-methods
//
// `anvil_setStorageAt` overwrites a single 32-byte storage slot
// on an account. The slot key is a 32-byte hash (the keccak of
// the Solidity storage layout); the value is a 32-byte word.
// Anvil returns `true` on success.

import {
  AddressSchema,
  Bytes32Schema,
} from "@ethernauta/core"
import type {
  ResolvedWriter,
  Writable,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"

const ParametersSchema = union([
  tuple([AddressSchema, Bytes32Schema, Bytes32Schema]),
  object({
    address: AddressSchema,
    slot: Bytes32Schema,
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
