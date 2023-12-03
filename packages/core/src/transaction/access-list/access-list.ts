import { Address, Hash32, addressSchema, hash32Schema } from "../../base";
import { array, object } from "valibot";

/**
 * Access list entry object.
 */
export interface AccessListEntry {
  address: Address;
  storageKeys: Hash32[];
}
export const accessListEntrySchema = object({
  address: addressSchema,
  storageKeys: array(hash32Schema)
})
/**
 * Array of access list entries.
 */
export type AccessList = AccessListEntry[];
export const accessListSchema = array(accessListEntrySchema)
