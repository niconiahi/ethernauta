// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-estimatefee
// Non-standard JSON-RPC method served by zkSync Era nodes. Takes a
// generic transaction (same shape as eth_call's input) and returns
// the four fee components zkSync charges. Lives inside @ethernauta/
// gas because the method is zkSync-specific and the only consumer
// is the v4 gas helper — per M11 it does NOT belong under
// @ethernauta/eth's standard `eth_*` namespace.

import { UintSchema } from "@ethernauta/core"
import { GenericTransactionSchema } from "@ethernauta/eth"
import {
  CallSchema,
  type Readable,
  type ResolvedReader,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"

export const ZksFeeSchema = object({
  gas_limit: UintSchema,
  gas_per_pubdata_limit: UintSchema,
  max_fee_per_gas: UintSchema,
  max_priority_fee_per_gas: UintSchema,
})
export type ZksFee = InferOutput<typeof ZksFeeSchema>

type ZksTransaction = InferOutput<
  typeof GenericTransactionSchema
>

export function zks_estimate_fee(
  _tx: ZksTransaction,
): Readable<ZksFee> {
  return async (
    resolved: ResolvedReader,
  ): Promise<ZksFee> => {
    const tx = parse(GenericTransactionSchema, _tx)
    const call = parse(CallSchema, [
      "zks_estimateFee",
      [tx],
    ])
    const [transports] = resolved
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(ZksFeeSchema, response.result)
  }
}
