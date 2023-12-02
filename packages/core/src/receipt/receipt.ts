import { Address, Bytes, Hash32, Uint, Bytes32, Byte } from "../base";

/**
 * Log object representing a single log entry in a transaction.
 */
export interface Log {
  removed: boolean;
  logIndex: Uint;
  transactionIndex: Uint;
  transactionHash: Hash32;
  blockHash: Hash32;
  blockNumber: Uint;
  address: Address;
  data: Bytes;
  topics: Bytes32[];
}

/**
 * Receipt information object for a transaction.
 */
export interface ReceiptInfo {
  type?: Byte; // Optional as it might not be present in all receipts
  transactionHash: Hash32;
  transactionIndex: Uint;
  blockHash: Hash32;
  blockNumber: Uint;
  from: Address;
  to: Address | null;
  cumulativeGasUsed: Uint;
  gasUsed: Uint;
  blobGasUsed?: Uint; // Optional, only for blob transactions
  contractAddress: Address | null;
  logs: Log[];
  logsBloom: Bytes;
  root?: Hash32; // Optional, only for pre-Byzantium transactions
  status?: Uint; // Optional, only for post-Byzantium transactions
  effectiveGasPrice: Uint;
  blobGasPrice?: Uint; // Optional, only for blob transactions
}
