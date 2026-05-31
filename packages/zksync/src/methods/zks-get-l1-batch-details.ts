// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getl1batchdetails
// Per-L1-batch metadata: commitment + the lifecycle base fields
// (commit / prove / execute on the settlement layer). Returns null
// until the batch is sealed.

import {
  Hash32Schema,
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
  parse,
  tuple,
  union,
} from "valibot"

import { BlockDetailsBaseSchema } from "../core"

const ParametersSchema = union([
  tuple([Uint64Schema]),
  object({ batch: Uint64Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

// `#[serde(flatten)] base: BlockDetailsBase` upstream — spread the
// base entries into the parent object to match the wire shape.
export const L1BatchDetailsSchema = object({
  number: Uint64Schema,
  commitment: nullable(Hash32Schema),
  ...BlockDetailsBaseSchema.entries,
})
export type L1BatchDetails = InferOutput<
  typeof L1BatchDetailsSchema
>

export function zks_getL1BatchDetails(
  _parameters: Parameters,
): Readable<L1BatchDetails | null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<L1BatchDetails | null> => {
    const method = "zks_getL1BatchDetails"
    const parameters = parse(ParametersSchema, _parameters)
    const positional = Array.isArray(parameters)
      ? parameters
      : [parameters.batch]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      nullable(L1BatchDetailsSchema),
      response.result,
    )
  }
}
