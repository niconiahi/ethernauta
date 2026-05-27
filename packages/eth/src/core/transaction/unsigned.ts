import type { Transaction1559Unsigned } from "@ethernauta/eip/1559"
import type { Transaction2930Unsigned } from "@ethernauta/eip/2930"
import type { Transaction4844Unsigned } from "@ethernauta/eip/4844"
import type { Transaction7702Unsigned } from "@ethernauta/eip/7702"
import type { TransactionLegacyUnsigned } from "./legacy"

export type TransactionUnsigned =
  | Transaction4844Unsigned
  | Transaction1559Unsigned
  | Transaction2930Unsigned
  | Transaction7702Unsigned
  | TransactionLegacyUnsigned
