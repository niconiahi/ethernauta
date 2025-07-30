import { signal } from "@preact/signals"
import * as v from "valibot"

export const TransactionSchema = v.object({
  method: v.string(),
  params: v.array(v.unknown()),
})
export type Transaction = v.InferOutput<
  typeof TransactionSchema
>
export const transaction_request = signal<Transaction>({
  method: "hello_world",
  params: [],
})
