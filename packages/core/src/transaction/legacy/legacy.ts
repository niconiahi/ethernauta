import { Address, Base16 } from "@ethernauta/core";

interface TransactionLegacyUnsigned {
  type: string; // pattern: ^0x0$
  nonce: Base16;
  to: Address | null; // Contract Creation or Address
  gas: Base16;
  value: Base16;
  input: Base16;
  gasPrice: Base16;
  chainId?: Base16; // Not required in legacy transactions but included for compatibility
}

export interface TransactionLegacySigned extends TransactionLegacyUnsigned {
  v: Base16;
  r: Base16;
  s: Base16;
}
