import {
  AddressesSchema,
  AddressSchema,
  Bytes32Schema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { array, null_, object, union } from "valibot"
import { LogSchema } from "./receipt"

export const FilterTopicSchema = union([
  null_(),
  Bytes32Schema,
  array(Bytes32Schema),
])
export type FilterTopic = InferOutput<
  typeof FilterTopicSchema
>

export const FilterTopicsSchema = array(FilterTopicSchema)
export type FilterTopics = InferOutput<
  typeof FilterTopicsSchema
>

export const FilterSchema = object({
  fromBlock: UintSchema,
  toBlock: UintSchema,
  address: union([AddressSchema, AddressesSchema]),
  topics: FilterTopicsSchema,
})
export type Filter = InferOutput<typeof FilterSchema>

export const FilterResultsSchema = union([
  array(Hash32Schema),
  array(LogSchema),
])
export type FilterResults = InferOutput<
  typeof FilterResultsSchema
>
