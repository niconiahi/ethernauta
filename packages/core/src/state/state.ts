import { Address, Bytes, BytesMax32, Hash32, Uint256, Uint64 } from "../base";

/**
 * Storage proof object.
 */
export interface StorageProof {
  /**
   * The key in the storage of the contract.
   */
  key: BytesMax32;
  /**
   * The value associated with the key in the contract's storage.
   */
  value: Uint256;
  /**
   * Array of bytes that proves the value is in the trie.
   */
  proof: Bytes[];
}

/**
 * Account proof object.
 */
export interface AccountProof {
  /**
   * Ethereum address of the account.
   */
  address: Address;
  /**
   * Array of bytes that proves the account is in the trie.
   */
  accountProof: Bytes[];
  /**
   * Balance of the account in Wei.
   */
  balance: Uint256;
  /**
   * Hash of the EVM bytecode of the account's contract.
   */
  codeHash: Hash32;
  /**
   * Number of transactions sent from this account.
   */
  nonce: Uint64;
  /**
   * Hash of the root of the storage trie of the account.
   */
  storageHash: Hash32;
  /**
   * Array of storage proofs for the account.
   */
  storageProof: StorageProof[];
}
