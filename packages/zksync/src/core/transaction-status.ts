// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/api/mod.rs
// Lifecycle of an L2 transaction. `pending` → `included` →
// `verified` is the normal path; `precommitted` / `fastFinalized`
// are gateway-mode intermediate states; `failed` is terminal.

import type { InferOutput } from "valibot"
import { picklist } from "valibot"

export const TransactionStatusSchema = picklist([
  "pending",
  "included",
  "fastFinalized",
  "precommitted",
  "verified",
  "failed",
])
export type TransactionStatus = InferOutput<
  typeof TransactionStatusSchema
>
