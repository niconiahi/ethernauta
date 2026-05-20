import { typedDataSchema } from "@ethernauta/eip/712"
import { addEthereumChainParameterSchema } from "@ethernauta/eip/3085"
import { sendSetCodeTransactionParametersSchema } from "@ethernauta/eip/7702"
import { parametersSchema } from "@ethernauta/transport"
import { signal } from "@preact/signals"
import {
  type InferOutput,
  object,
  optional,
  string,
} from "valibot"

export const TransactionSchema = object({
  id: string(),
  method: string(),
  params: parametersSchema,
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

export const PersonalSignRequestSchema = object({
  id: string(),
  address: string(),
  message: string(),
})
export type PersonalSignRequest = InferOutput<
  typeof PersonalSignRequestSchema
>
export const personal_sign_request =
  signal<PersonalSignRequest | null>(null)

export const AddChainRequestSchema = object({
  id: string(),
  chain: addEthereumChainParameterSchema,
})
export type AddChainRequest = InferOutput<
  typeof AddChainRequestSchema
>
export const add_chain_request =
  signal<AddChainRequest | null>(null)

export const SetCodeRequestSchema = object({
  id: string(),
  parameters: sendSetCodeTransactionParametersSchema,
})
export type SetCodeRequest = InferOutput<
  typeof SetCodeRequestSchema
>
export const set_code_request =
  signal<SetCodeRequest | null>(null)
