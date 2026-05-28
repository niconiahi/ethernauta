// https://eips.ethereum.org/EIPS/eip-712

import {
  AddressSchema,
  Bytes32Schema,
  Uint256Schema,
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

export const TypedDataDomainSchema = object({
  name: optional(string()),
  version: optional(string()),
  chainId: optional(
    union([bigint(), number(), Uint256Schema]),
  ),
  verifyingContract: optional(AddressSchema),
  salt: optional(Bytes32Schema),
})
export type TypedDataDomain = InferOutput<
  typeof TypedDataDomainSchema
>

export const TypedDataFieldSchema = object({
  name: string(),
  type: string(),
})
export type TypedDataField = InferOutput<
  typeof TypedDataFieldSchema
>

export const TypedDataTypesSchema = record(
  string(),
  array(TypedDataFieldSchema),
)
export type TypedDataTypes = InferOutput<
  typeof TypedDataTypesSchema
>

export const TypedDataSchema = object({
  domain: TypedDataDomainSchema,
  types: TypedDataTypesSchema,
  primaryType: string(),
  message: record(string(), unknown()),
})
export type TypedData = InferOutput<typeof TypedDataSchema>
