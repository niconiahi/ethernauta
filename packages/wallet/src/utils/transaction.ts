import { TypedDataSchema } from "@ethernauta/eip/712"
import { SwitchEthereumChainParameterSchema } from "@ethernauta/eip/3326"
import { SendCallsParameterSchema } from "@ethernauta/eip/5792"
import { SendSetCodeTransactionParametersSchema } from "@ethernauta/eip/7702"
import { signal } from "@preact/signals"
import {
  type InferOutput,
  object,
  optional,
  string,
} from "valibot"
import type { EthernautaRequest } from "./event"
import { RpcParamsSchema } from "./event"

export const TransactionSchema = object({
  id: string(),
  method: string(),
  params: RpcParamsSchema,
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
  typed_data: TypedDataSchema,
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

export const SwitchChainRequestSchema = object({
  id: string(),
  parameter: SwitchEthereumChainParameterSchema,
})
export type SwitchChainRequest = InferOutput<
  typeof SwitchChainRequestSchema
>
export const switch_chain_request =
  signal<SwitchChainRequest | null>(null)

export const SetCodeRequestSchema = object({
  id: string(),
  parameters: SendSetCodeTransactionParametersSchema,
})
export type SetCodeRequest = InferOutput<
  typeof SetCodeRequestSchema
>
export const set_code_request =
  signal<SetCodeRequest | null>(null)

export const SendCallsRequestSchema = object({
  id: string(),
  parameter: SendCallsParameterSchema,
})
export type SendCallsRequest = InferOutput<
  typeof SendCallsRequestSchema
>
export const send_calls_request =
  signal<SendCallsRequest | null>(null)

export const pending_request =
  signal<EthernautaRequest | null>(null)
