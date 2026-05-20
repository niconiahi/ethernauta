// https://eips.ethereum.org/EIPS/eip-712

import {
  addressSchema,
  bytes32Schema,
  uint256Schema,
} from "@ethernauta/core"
import {
  array,
  bigint,
  type InferOutput,
  number,
  object,
  optional,
  record,
  string,
  union,
  unknown,
} from "valibot"

export const typedDataDomainSchema = object({
  name: optional(string()),
  version: optional(string()),
  chainId: optional(
    union([bigint(), number(), uint256Schema]),
  ),
  verifyingContract: optional(addressSchema),
  salt: optional(bytes32Schema),
})
export type TypedDataDomain = InferOutput<
  typeof typedDataDomainSchema
>

export const typedDataFieldSchema = object({
  name: string(),
  type: string(),
})
export type TypedDataField = InferOutput<
  typeof typedDataFieldSchema
>

export const typedDataTypesSchema = record(
  string(),
  array(typedDataFieldSchema),
)
export type TypedDataTypes = InferOutput<
  typeof typedDataTypesSchema
>

export const typedDataSchema = object({
  domain: typedDataDomainSchema,
  types: typedDataTypesSchema,
  primaryType: string(),
  message: record(string(), unknown()),
})
export type TypedData = InferOutput<typeof typedDataSchema>
