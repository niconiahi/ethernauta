import type { Transaction1559Unsigned } from "../1559"
import type { Transaction2930Unsigned } from "../2930"
import type { Transaction4844Unsigned } from "../4844"
import type { TransactionLegacyUnsigned } from "../legacy"

export type TransactionUnsigned = Transaction4844Unsigned | Transaction1559Unsigned | Transaction2930Unsigned | TransactionLegacyUnsigned
