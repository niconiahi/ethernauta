import { signal } from "@preact/signals"
import {
  array,
  type InferOutput,
  object,
  optional,
  string,
  union,
  unknown,
} from "valibot"

export const TransactionSchema = object({
  id: string(),
  method: string(),
  params: union([array(unknown())]),
  to: optional(string()),
})
export type Transaction = InferOutput<
  typeof TransactionSchema
>
export const transaction_request = signal<Transaction>({
  id: "some-id",
  method: "hello_world",
  params: [],
})
export const connection_request = signal<{
  id: string
} | null>(null)
