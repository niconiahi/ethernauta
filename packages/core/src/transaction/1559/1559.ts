import { Address, Base16, AccessList } from "@ethernauta/core";

export interface Transaction1559Unsigned {
  type: string; // pattern: ^0x2$
  nonce: Base16;
  to: Address | null; // Contract Creation or Address
  gas: Base16;
  value: Base16;
  input: Base16;
  maxPriorityFeePerGas: Base16;
  maxFeePerGas: Base16;
  gasPrice: Base16;
  accessList: AccessList;
  chainId: Base16;
}

export interface Transaction1559Signed extends Transaction1559Unsigned {
  yParity: Base16;
  // v?: Base16; // Deprecated, use yParity
  r: Base16;
  s: Base16;
}
