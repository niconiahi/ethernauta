import { Address, Uint, Bytes } from "../../base";
import { AccessList } from "../../transaction";

/**
 * Unsigned EIP-1559 transaction.
 */
export interface Transaction1559Unsigned {
  type: string;
  nonce: Uint;
  to: Address | null;
  gas: Uint;
  value: Uint;
  input: Bytes;
  maxPriorityFeePerGas: Uint;
  maxFeePerGas: Uint;
  gasPrice: Uint;
  accessList: AccessList;
  chainId: Uint;
}

/**
 * Signed EIP-1559 transaction.
 */
export interface Transaction1559Signed extends Transaction1559Unsigned {
  yParity: Uint;
  r: Uint;
  s: Uint;
}
