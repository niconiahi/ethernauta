import { AccessList, Address, Duotrigesimal, Hexadecimal } from "@ethernauta/core";

export interface Transaction4844Unsigned {
  type: string; // pattern: ^0x1$
  nonce: Hexadecimal;
  to: Address;
  gas: Hexadecimal;
  value: Hexadecimal;
  input: Hexadecimal;
  maxPriorityFeePerGas: Hexadecimal;
  maxFeePerGas: Hexadecimal;
  maxFeePerBlobGas: Hexadecimal;
  accessList: AccessList;
  blobVersionedHashes: Duotrigesimal[];
  chainId: Hexadecimal;
}

export interface Transaction4844Signed extends Transaction4844Unsigned {
  yParity: Hexadecimal;
  r: Hexadecimal;
  s: Hexadecimal;
}

