import { Address, Base16, AccessList } from "@ethernauta/core";

export interface Transaction2930Unsigned {
  type: Base16;
  nonce: Base16;
  to: Address | null; // Contract Creation or Address
  gas: Base16;
  value: Base16;
  input: Base16;
  gasPrice: Base16;
  accessList: AccessList;
  chainId: Base16;
}


export interface Transaction2930Signed extends Transaction2930Unsigned {
  yParity: Base16;
  // v?: Base16; // Deprecated, use yParity
  r: Base16;
  s: Base16;
}
