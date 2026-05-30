import type { Uint } from "@ethernauta/core"
import {
  AddressSchema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { BlockNumberOrTagOrHashSchema } from "../../core/block"

const ParametersSchema = union([
  tuple([
    AddressSchema,
    Uint256Schema,
    BlockNumberOrTagOrHashSchema,
  ]),
  tuple([AddressSchema, Uint256Schema]),
  object({
    address: AddressSchema,
    storageSlot: Uint256Schema,
  }),
  object({
    address: AddressSchema,
    storageSlot: Uint256Schema,
    blockNumberOrTagOrHash: BlockNumberOrTagOrHashSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns The value from a storage position at a given address
 */
export function eth_getStorageAt(
  _parameters: Parameters,
): Readable<Uint> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Uint> => {
    const method = "eth_getStorageAt"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(UintSchema, response.result)
    return result
  }
}
