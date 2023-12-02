import { Address, Addresses, Bytes32, Hash32, Uint } from "../base";
import { Log } from "../receipt";

/**
 * Represents a filter topic, which can be a null, a single topic, or an array of topics.
 */
export type FilterTopic = null | Bytes32 | Bytes32[];

/**
 * Array of filter topics.
 */
export type FilterTopics = FilterTopic[];

/**
 * Filter object used to specify block range, address(es), and topics for a filter.
 */
export interface Filter {
  fromBlock: Uint;
  toBlock: Uint;
  address: Address | Addresses;
  topics: FilterTopics;
}

/**
 * Represents filter results, which can be new block hashes, new transaction hashes, or new logs.
 */
export type FilterResults = Hash32[] | Log[];
