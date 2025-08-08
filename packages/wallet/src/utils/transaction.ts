import { signal } from "@preact/signals"
import {
  array,
  object,
  string,
  unknown,
  type InferOutput,
} from "valibot"

export const TransactionSchema = object({
  id: string(),
  method: string(),
  params: array(unknown()),
})
export type Transaction = InferOutput<
  typeof TransactionSchema
>
export const transaction_request = signal<Transaction>({
  id: "some-id",
  method: "hello_world",
  params: [],
})
