import { hash32Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { literal, object, union } from "valibot"

/**
 * A transaction that has been submitted to the network, in
 * one of three lifecycle states observed client-side via
 * eth_getTransactionReceipt. Discriminated by `status` so
 * consumers can narrow inside switch / match.
 *
 * This is NOT an Ethereum-spec transaction object — for that
 * see TransactionInfo, Transaction1559Signed, etc. This is the
 * minimal {hash, status} record dapps use to drive UI off a
 * receipt poll.
 */

export const submittedTransactionSchema = union([
  object({
    hash: hash32Schema,
    status: literal("pending"),
  }),
  object({
    hash: hash32Schema,
    status: literal("mined"),
  }),
  object({
    hash: hash32Schema,
    status: literal("reverted"),
  }),
])

export type SubmittedTransaction = InferOutput<
  typeof submittedTransactionSchema
>
