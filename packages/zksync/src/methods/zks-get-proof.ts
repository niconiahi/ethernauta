// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getproof
// Storage proof for one or more slots of a single account at a
// sealed L1 batch. Returns null until the requested batch is sealed.

import type { Address, Hash32 } from "@ethernauta/core"
import {
  AddressSchema,
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
  array,
  nullable,
  object,
  parse,
  tuple,
  union,
} from "valibot"

import { StorageProofSchema } from "../core"

const ParametersSchema = union([
  tuple([AddressSchema, array(Hash32Schema), Uint64Schema]),
  object({
    address: AddressSchema,
    keys: array(Hash32Schema),
    l1BatchNumber: Uint64Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export const ProofSchema = object({
  address: AddressSchema,
  storageProof: array(StorageProofSchema),
})
export type Proof = InferOutput<typeof ProofSchema>

export function zks_getProof(
  _parameters: Parameters,
): Readable<Proof | null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<Proof | null> => {
    const method = "zks_getProof"
    const parameters = parse(ParametersSchema, _parameters)
    const positional: [
      Address,
      Hash32[],
      InferOutput<typeof Uint64Schema>,
    ] = Array.isArray(parameters)
      ? parameters
      : [
          parameters.address,
          parameters.keys,
          parameters.l1BatchNumber,
        ]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(nullable(ProofSchema), response.result)
  }
}
