import { Address, Hexadecimal, AccessList } from "@ethernauta/core";

export interface Transaction2930Unsigned {
  type: Hexadecimal;
  nonce: Hexadecimal;
  to: Address | null; // Contract Creation or Address
  gas: Hexadecimal;
  value: Hexadecimal;
  input: Hexadecimal;
  gasPrice: Hexadecimal;
  accessList: AccessList;
  chainId: Hexadecimal;
}


export interface Transaction2930Signed extends Transaction2930Unsigned {
  yParity: Hexadecimal;
  // v?: Hexadecimal; // Deprecated, use yParity
  r: Hexadecimal;
  s: Hexadecimal;
}
