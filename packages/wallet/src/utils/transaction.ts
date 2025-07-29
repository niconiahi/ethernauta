import { signal } from "@preact/signals"
import * as v from "valibot"

export const TransactionSchema = v.object({
  method: v.string(),
  params: v.array(v.unknown()),
})
type Transaction = v.InferOutput<typeof TransactionSchema>
export const transaction = signal<Transaction>({
  method: "hello_world",
  params: [],
})
