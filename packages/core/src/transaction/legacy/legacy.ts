import type { Address, Bytes, Uint } from "../../base"

/**
 * Unsigned Legacy transaction.
 */
export interface TransactionLegacyUnsigned {
  type: string
  nonce: Uint
  to: Address | null
  gas: Uint
  value: Uint
  input: Bytes
  gasPrice: Uint
  chainId: Uint
}

/**
 * Signed Legacy transaction.
 */
export interface TransactionLegacySigned extends TransactionLegacyUnsigned {
  v: Uint
  r: Uint
  s: Uint
}
