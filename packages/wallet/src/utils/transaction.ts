import { signal } from "@preact/signals"
import {
  array,
  type InferOutput,
  object,
  string,
  union,
  unknown,
} from "valibot"

export const TransactionSchema = object({
  id: string(),
  method: string(),
  params: union([array(unknown())]),
})
export type Transaction = InferOutput<
  typeof TransactionSchema
>
export const transaction_request = signal<Transaction>({
  id: "some-id",
  method: "hello_world",
  params: [],
})
