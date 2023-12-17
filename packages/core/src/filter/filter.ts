import type { Input } from "valibot"
import { array, null_, object, union } from "valibot"

import { addressSchema, addressesSchema, bytes32Schema, hash32Schema, uintSchema } from "../base"
import { logSchema } from "../receipt"

export const filterTopicSchema = union([null_(), bytes32Schema, array(bytes32Schema)])
export type FilterTopic = Input<typeof filterTopicSchema>

export const filterTopicsSchema = array(filterTopicSchema)
export type FilterTopics = Input<typeof filterTopicsSchema>

export const filterSchema = object({
  fromBlock: uintSchema,
  toBlock: uintSchema,
  address: union([addressSchema, addressesSchema]),
  topics: filterTopicsSchema,
})
export type Filter = Input<typeof filterSchema>

export const filterResultsSchema = union([array(hash32Schema), array(logSchema)])
export type FilterResults = Input<typeof filterResultsSchema>
