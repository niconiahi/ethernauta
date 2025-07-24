import type { InferOutput } from "valibot"
import { array, object } from "valibot"

import { addressSchema, hash32Schema } from "../../base"

/**
 * Access list entry object.
 */
export const accessListEntrySchema = object({
  address: addressSchema,
  storageKeys: array(hash32Schema),
})
export type AccessListEntry = InferOutput<typeof accessListEntrySchema>
/**
 * Array of access list entries.
 */
export const accessListSchema = array(accessListEntrySchema)
export type AccessList = InferOutput<typeof accessListSchema>
