import { array, object } from 'valibot'
import type { Address, Hash32 } from '../../base'
import { addressSchema, hash32Schema } from '../../base'

/**
 * Access list entry object.
 */
export interface AccessListEntry {
  address: Address
  storageKeys: Hash32[]
}
export const accessListEntrySchema = object({
  address: addressSchema,
  storageKeys: array(hash32Schema),
})
/**
 * Array of access list entries.
 */
export type AccessList = AccessListEntry[]
export const accessListSchema = array(accessListEntrySchema)
