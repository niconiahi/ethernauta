import {
  AddressSchema,
  BytesMax32Schema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { array, object, parse, tuple, union } from "valibot"
import { BlockNumberOrTagOrHashSchema } from "../../core/block"
import type { AccountProof } from "../../core/state"
import { AccountProofSchema } from "../../core/state"

const ParametersSchema = union([
  tuple([
    AddressSchema,
    array(BytesMax32Schema),
    BlockNumberOrTagOrHashSchema,
  ]),
  object({
    address: AddressSchema,
    storageKeys: array(BytesMax32Schema),
    blockNumberOrTagOrHash: BlockNumberOrTagOrHashSchema,
  }),
])

type Parameters = InferOutput<typeof ParametersSchema>
/**
 * @returns The merkle proof for a given account and optionally some storage keys
 */
export function eth_getProof(
  _parameters: Parameters,
): Readable<AccountProof> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<AccountProof> => {
    const method = "eth_getProof"
    const parameters = parse(ParametersSchema, _parameters)
    const call = parse(CallSchema, [method, parameters])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const result = parse(
      AccountProofSchema,
      response.result,
    )
    return result
  }
}
