import { Address, Hexadecimal, AccessList } from "@ethernauta/core";

export interface Transaction1559Unsigned {
  type: string; // pattern: ^0x2$
  nonce: Hexadecimal;
  to: Address | null; // Contract Creation or Address
  gas: Hexadecimal;
  value: Hexadecimal;
  input: Hexadecimal;
  maxPriorityFeePerGas: Hexadecimal;
  maxFeePerGas: Hexadecimal;
  gasPrice: Hexadecimal;
  accessList: AccessList;
  chainId: Hexadecimal;
}

export interface Transaction1559Signed extends Transaction1559Unsigned {
  yParity: Hexadecimal;
  // v?: Hexadecimal; // Deprecated, use yParity
  r: Hexadecimal;
  s: Hexadecimal;
}
