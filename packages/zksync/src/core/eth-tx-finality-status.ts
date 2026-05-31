// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/api/mod.rs
// Settlement-layer (L1 / gateway) tx finality state. Emitted by
// `BlockDetailsBase.commit_tx_finality` / `prove_tx_finality` /
// `execute_tx_finality` / `precommit_tx_finality`.

import type { InferOutput } from "valibot"
import { picklist } from "valibot"

export const EthTxFinalityStatusSchema = picklist([
  "pending",
  "fastFinalized",
  "finalized",
])
export type EthTxFinalityStatus = InferOutput<
  typeof EthTxFinalityStatusSchema
>
