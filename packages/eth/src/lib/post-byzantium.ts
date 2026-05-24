// https://eips.ethereum.org/EIPS/eip-658
//
// Post-Byzantium tightening of `receiptInfoSchema`. EIP-658 (shipped
// in the Byzantium hard fork, mainnet block 4_370_000, Oct 2017)
// replaced the pre-Byzantium intermediate state root with an
// explicit transaction status field encoded as `"0x0"` (reverted)
// or `"0x1"` (success).
//
// `receiptInfoSchema` itself stays loose because both eras produce
// legitimate JSON-RPC responses; consumers that know they're
// post-Byzantium discriminate via `is_post_byzantium(receipt)` and
// then read `receipt.status` as a `ReceiptStatus` literal — no
// magic-string compare, no `hex_to_number` round-trip.

import type { InferOutput } from "valibot"
import { object, picklist, safeParse } from "valibot"
import type { ReceiptInfo } from "../core/receipt"
import { receiptInfoSchema } from "../core/receipt"

export const RECEIPT_STATUS = {
  REVERTED: "0x0",
  SUCCESS: "0x1",
} as const
export type ReceiptStatus =
  (typeof RECEIPT_STATUS)[keyof typeof RECEIPT_STATUS]
export const receiptStatusSchema = picklist(
  Object.values(RECEIPT_STATUS),
)

export const postByzantiumReceiptSchema = object({
  ...receiptInfoSchema.entries,
  status: receiptStatusSchema,
})
export type PostByzantiumReceiptInfo = InferOutput<
  typeof postByzantiumReceiptSchema
>

export function is_post_byzantium(
  _receipt: ReceiptInfo,
): _receipt is PostByzantiumReceiptInfo {
  return safeParse(postByzantiumReceiptSchema, _receipt)
    .success
}
