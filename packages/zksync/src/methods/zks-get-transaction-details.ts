// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-gettransactiondetails
// Settlement-layer lifecycle of an L2 transaction: commit / prove /
// execute (and precommit) L1 tx hashes plus the L2 status enum.

import {
  AddressSchema,
  Hash32Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import {
  boolean,
  nullable,
  object,
  optional,
  parse,
  string,
  tuple,
  union,
} from "valibot"

import { TransactionStatusSchema } from "../core"

const ParametersSchema = union([
  tuple([Hash32Schema]),
  object({ hash: Hash32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export const TransactionDetailsSchema = object({
  isL1Originated: boolean(),
  status: TransactionStatusSchema,
  fee: Uint256Schema,
  gasPerPubdata: Uint256Schema,
  initiatorAddress: AddressSchema,
  receivedAt: string(),
  ethCommitTxHash: nullable(Hash32Schema),
  ethProveTxHash: nullable(Hash32Schema),
  ethExecuteTxHash: nullable(Hash32Schema),
  ethPrecommitTxHash: optional(nullable(Hash32Schema)),
})
export type TransactionDetails = InferOutput<
  typeof TransactionDetailsSchema
>

export function zks_getTransactionDetails(
  _parameters: Parameters,
): Readable<TransactionDetails | null> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<TransactionDetails | null> => {
    const method = "zks_getTransactionDetails"
    const parameters = parse(ParametersSchema, _parameters)
    const positional = Array.isArray(parameters)
      ? parameters
      : [parameters.hash]
    const call = parse(CallSchema, [method, positional])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      nullable(TransactionDetailsSchema),
      response.result,
    )
  }
}
