import { typedDataSchema } from "@ethernauta/eip/712"
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

export const TypedDataRequestSchema = object({
  id: string(),
  address: string(),
  typed_data: typedDataSchema,
})
export type TypedDataRequest = InferOutput<
  typeof TypedDataRequestSchema
>
export const typed_data_request =
  signal<TypedDataRequest | null>(null)
