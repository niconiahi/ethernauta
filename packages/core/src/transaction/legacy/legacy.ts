import { Address, Hexadecimal } from "@ethernauta/core";

interface TransactionLegacyUnsigned {
  type: string; // pattern: ^0x0$
  nonce: Hexadecimal;
  to: Address | null; // Contract Creation or Address
  gas: Hexadecimal;
  value: Hexadecimal;
  input: Hexadecimal;
  gasPrice: Hexadecimal;
  chainId?: Hexadecimal; // Not required in legacy transactions but included for compatibility
}

export interface TransactionLegacySigned extends TransactionLegacyUnsigned {
  v: Hexadecimal;
  r: Hexadecimal;
  s: Hexadecimal;
}
