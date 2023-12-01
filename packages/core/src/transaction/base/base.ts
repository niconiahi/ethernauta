import { Address, Base32, Base16, Transaction1559Signed, Transaction1559Unsigned, Transaction2930Signed, Transaction2930Unsigned, Transaction4844Signed, Transaction4844Unsigned, TransactionLegacySigned } from "@ethernauta/core";

interface AccessListEntry {
  address: Address;
  storageKeys: Base32[];
}
export type AccessList = AccessListEntry[];
export interface BaseTransaction {
  type: Base16;
  nonce: Base16;
  to: Address | null;
  gas: Base16;
  value: Base16;
  input: Base16;
  gasPrice?: Base16;
  maxPriorityFeePerGas?: Base16;
  maxFeePerGas?: Base16;
  maxFeePerBlobGas?: Base16;
  accessList?: AccessList;
  blobVersionedHashes?: Base32[];
  blobs?: Base16[];
  chainId: Base16;
}
export type TransactionUnsigned = Transaction4844Unsigned | Transaction1559Unsigned | Transaction2930Unsigned | Transaction1559Unsigned;
export type TransactionSigned = Transaction4844Signed | Transaction1559Signed | Transaction2930Signed | TransactionLegacySigned;
export interface TransactionInfo {
  blockHash: Base32;
  blockNumber: Base16;
  from: Address;
  hash: Base32;
  transactionIndex: Base16;
}
