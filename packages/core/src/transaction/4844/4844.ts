import { AccessList, Address, Base32, Base16 } from "@ethernauta/core";

export interface Transaction4844Unsigned {
  type: string; // pattern: ^0x1$
  nonce: Base16;
  to: Address;
  gas: Base16;
  value: Base16;
  input: Base16;
  maxPriorityFeePerGas: Base16;
  maxFeePerGas: Base16;
  maxFeePerBlobGas: Base16;
  accessList: AccessList;
  blobVersionedHashes: Base32[];
  chainId: Base16;
}

export interface Transaction4844Signed extends Transaction4844Unsigned {
  yParity: Base16;
  r: Base16;
  s: Base16;
}

