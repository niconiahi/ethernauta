import type { Input } from 'valibot'
import { array, null_, object, union } from 'valibot'
import { addressSchema, addressesSchema, bytes32Schema, hash32Schema, uintSchema } from '../base'
import { logSchema } from '../receipt'

/**
 * Represents a filter topic, which can be a null, a single topic, or an array of topics.
 */
export const filterTopicSchema = union([null_(), bytes32Schema, array(bytes32Schema)])
export type FilterTopic = Input<typeof filterTopicSchema>

/**
 * Array of filter topics.
 */
export const filterTopicsSchema = array(filterTopicSchema)
export type FilterTopics = Input<typeof filterTopicsSchema>

/**
 * Filter object used to specify block range, address(es), and topics for a filter.
 */
export const filterSchema = object({
  fromBlock: uintSchema,
  toBlock: uintSchema,
  address: union([addressSchema, addressesSchema]),
  topics: filterTopicsSchema,
})
export type Filter = Input<typeof filterSchema>

/**
 * Represents filter results, which can be new block hashes, new transaction hashes, or new logs.
 */
export const filterResultsSchema = union([array(hash32Schema), array(logSchema)])
export type FilterResults = Input<typeof filterResultsSchema>
