import { Address, Hash32 } from "../../base";

/**
 * Access list entry object.
 */
export interface AccessListEntry {
  address: Address;
  storageKeys: Hash32[];
}
/**
 * Array of access list entries.
 */
export type AccessList = AccessListEntry[];
