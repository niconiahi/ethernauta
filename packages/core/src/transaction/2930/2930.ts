import type { Address, Bytes, Uint } from '../../base'
import type { AccessList } from '../../transaction'

/**
 * Unsigned EIP-2930 transaction.
 */
export interface Transaction2930Unsigned {
  type: string
  nonce: Uint
  to: Address | null
  gas: Uint
  value: Uint
  input: Bytes
  gasPrice: Uint
  accessList: AccessList
  chainId: Uint
}

/**
 * Signed EIP-2930 transaction.
 */
export interface Transaction2930Signed extends Transaction2930Unsigned {
  yParity: Uint
  r: Uint
  s: Uint
}
