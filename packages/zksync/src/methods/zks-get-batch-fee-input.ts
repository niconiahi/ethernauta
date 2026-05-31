// https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getbatchfeeinput
// Inputs to the chain's pubdata-independent batch fee model:
// `fair_l2_gas_price`, `fair_pubdata_price`, `l1_gas_price`.

import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import { parse } from "valibot"

import type { PubdataIndependentBatchFeeModelInput } from "../core"
import { PubdataIndependentBatchFeeModelInputSchema } from "../core"

export function zks_getBatchFeeInput(): Readable<PubdataIndependentBatchFeeModelInput> {
  return async ([
    dispatcher,
    _context,
  ]: ResolvedReader): Promise<PubdataIndependentBatchFeeModelInput> => {
    const method = "zks_getBatchFeeInput"
    const call = parse(CallSchema, [method])
    const response = await dispatcher(call)
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    return parse(
      PubdataIndependentBatchFeeModelInputSchema,
      response.result,
    )
  }
}
