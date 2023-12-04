import type { Address, Byte, Bytes, Hash32, Uint } from '../../base'
import type { AccessList } from '../../transaction'

/**
 * Unsigned EIP-4844 transaction.
 */
export interface Transaction4844Unsigned {
  type: Byte
  nonce: Uint
  to: Address
  gas: Uint
  value: Uint
  input: Bytes
  maxPriorityFeePerGas: Uint
  maxFeePerGas: Uint
  maxFeePerBlobGas: Uint
  accessList: AccessList
  blobVersionedHashes: Hash32[]
  chainId: Uint
}

/**
 * Signed EIP-4844 transaction.
 */
export interface Transaction4844Signed extends Transaction4844Unsigned {
  yParity: Uint
  r: Uint
  s: Uint
}
