import type { Input } from "valibot"
import { array, object } from "valibot"

import { addressSchema, hash32Schema } from "../../base"

/**
 * Access list entry object.
 */
export const accessListEntrySchema = object({
  address: addressSchema,
  storageKeys: array(hash32Schema),
})
export type AccessListEntry = Input<typeof accessListEntrySchema>
/**
 * Array of access list entries.
 */
export const accessListSchema = array(accessListEntrySchema)
export type AccessList = Input<typeof accessListSchema>
