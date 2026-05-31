// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getblockdetails
// Per-L2-block metadata + commit/prove/execute lifecycle status.
// Returns null while the block is still unknown to the node.

import {
  AddressSchema,
  Uint64Schema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  nullable,
  object,
  optional,
  parse,
  tuple,
  union,
} from "valibot"

import { BlockDetailsBaseSchema } from "../core"

const ParametersSchema = union([
  tuple([Uint64Schema]),
  object({ blockNumber: Uint64Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

// `#[serde(flatten)] base: BlockDetailsBase` upstream — the wire
// merges all base fields into the parent object. Compose by spread
// rather than nesting.
export const BlockDetailsSchema = object({
  number: Uint64Schema,
  l1BatchNumber: Uint64Schema,
  ...BlockDetailsBaseSchema.entries,
  operatorAddress: AddressSchema,
  protocolVersion: optional(nullable(Uint64Schema)),
})
export type BlockDetails = InferOutput<
  typeof BlockDetailsSchema
>

export function zks_getBlockDetails(
  _parameters: Parameters,
): Readable<BlockDetails | null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<BlockDetails | null> => {
    const method = "zks_getBlockDetails"
    const parameters = parse(ParametersSchema, _parameters)
    const positional = Array.isArray(parameters)
      ? parameters
      : [parameters.blockNumber]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      nullable(BlockDetailsSchema),
      response.result,
    )
  }
}
