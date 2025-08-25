import type { InferOutput } from "valibot"
import { array, null_, object, union } from "valibot"

import {
  addressesSchema,
  addressSchema,
  bytes32Schema,
  Hash32Schema,
  uintSchema,
} from "./base"
import { logSchema } from "./receipt"

export const filterTopicSchema = union([
  null_(),
  bytes32Schema,
  array(bytes32Schema),
])
export type FilterTopic = InferOutput<
  typeof filterTopicSchema
>

export const filterTopicsSchema = array(filterTopicSchema)
export type FilterTopics = InferOutput<
  typeof filterTopicsSchema
>

export const filterSchema = object({
  fromBlock: uintSchema,
  toBlock: uintSchema,
  address: union([addressSchema, addressesSchema]),
  topics: filterTopicsSchema,
})
export type Filter = InferOutput<typeof filterSchema>

export const filterResultsSchema = union([
  array(Hash32Schema),
  array(logSchema),
])
export type FilterResults = InferOutput<
  typeof filterResultsSchema
>
