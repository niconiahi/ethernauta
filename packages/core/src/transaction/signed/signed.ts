import { Transaction1559Signed } from "../1559";
import { Transaction2930Signed } from "../2930";
import { Transaction4844Signed } from "../4844";
import { TransactionLegacySigned } from "../legacy";

export type TransactionSigned = Transaction4844Signed | Transaction1559Signed | Transaction2930Signed | TransactionLegacySigned;
