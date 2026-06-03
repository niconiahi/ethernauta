// https://github.com/ethereum-optimism/op-geth/blob/optimism/core/types/receipt.go
//
// Deposit-tx receipts on op-geth carry two extra fields post-
// Canyon — `depositNonce` and `depositReceiptVersion` — that
// the base `ReceiptInfoSchema` strips. Regular-tx receipts
// carry neither, so both fields stay optional.
//
// `intersect` lets the OP shape add the extras without
// duplicating the base receipt's field list (and without
// fighting valibot over field overrides — the base schema's
// fields are exactly what op-geth still emits on top of the
// additions).

import { UintSchema } from "@ethernauta/core"
import { ReceiptInfoSchema } from "@ethernauta/eth"
import type { InferOutput } from "valibot"
import { intersect, object, optional } from "valibot"

export const OpReceiptInfoSchema = intersect([
  ReceiptInfoSchema,
  object({
    depositNonce: optional(UintSchema),
    depositReceiptVersion: optional(UintSchema),
  }),
])
export type OpReceiptInfo = InferOutput<
  typeof OpReceiptInfoSchema
>
