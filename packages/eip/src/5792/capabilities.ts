// https://eips.ethereum.org/EIPS/eip-5792

import { addressSchema, uintSchema } from "@ethernauta/core"
import {
  array,
  type InferOutput,
  literal,
  object,
  optional,
  record,
  string,
  union,
  unknown,
} from "valibot"

export const capabilitiesSchema = record(string(), object({}))
export type Capabilities = InferOutput<
  typeof capabilitiesSchema
>

export const sendCallsCallSchema = object({
  to: optional(addressSchema),
  data: optional(string()),
  value: optional(uintSchema),
})
export type SendCallsCall = InferOutput<
  typeof sendCallsCallSchema
>

export const sendCallsParameterSchema = object({
  version: string(),
  chainId: uintSchema,
  from: optional(addressSchema),
  calls: array(sendCallsCallSchema),
  capabilities: optional(
    record(string(), unknown()),
  ),
})
export type SendCallsParameter = InferOutput<
  typeof sendCallsParameterSchema
>

export const sendCallsParametersSchema = array(
  sendCallsParameterSchema,
)
export type SendCallsParameters = InferOutput<
  typeof sendCallsParametersSchema
>

export const callsStatusSchema = object({
  status: union([
    literal("CONFIRMED"),
    literal("PENDING"),
  ]),
  receipts: optional(array(record(string(), unknown()))),
})
export type CallsStatus = InferOutput<
  typeof callsStatusSchema
>
