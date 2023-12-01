import { Address, Duotrigesimal, Hexadecimal, Transaction1559Signed, Transaction1559Unsigned, Transaction2930Signed, Transaction2930Unsigned, Transaction4844Signed, Transaction4844Unsigned, TransactionLegacySigned } from "@ethernauta/core";

interface AccessListEntry {
  address: Address;
  storageKeys: Duotrigesimal[];
}
export type AccessList = AccessListEntry[];
export interface BaseTransaction {
  type: Hexadecimal;
  nonce: Hexadecimal;
  to: Address | null;
  gas: Hexadecimal;
  value: Hexadecimal;
  input: Hexadecimal;
  gasPrice?: Hexadecimal;
  maxPriorityFeePerGas?: Hexadecimal;
  maxFeePerGas?: Hexadecimal;
  maxFeePerBlobGas?: Hexadecimal;
  accessList?: AccessList;
  blobVersionedHashes?: Duotrigesimal[];
  blobs?: Hexadecimal[];
  chainId: Hexadecimal;
}
export type TransactionUnsigned = Transaction4844Unsigned | Transaction1559Unsigned | Transaction2930Unsigned | Transaction1559Unsigned;
export type TransactionSigned = Transaction4844Signed | Transaction1559Signed | Transaction2930Signed | TransactionLegacySigned;
export interface TransactionInfo {
  blockHash: Duotrigesimal;
  blockNumber: Hexadecimal;
  from: Address;
  hash: Duotrigesimal;
  transactionIndex: Hexadecimal;
}
