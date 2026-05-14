import { parametersSchema } from "@ethernauta/transport"
import { signal } from "@preact/signals"
import {
  type InferOutput,
  object,
  optional,
  string,
} from "valibot"
import { FunctionSidecarSchema } from "./event"

export const TransactionSchema = object({
  id: string(),
  method: string(),
  params: parametersSchema,
  to: optional(string()),
  _function: optional(FunctionSidecarSchema),
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
