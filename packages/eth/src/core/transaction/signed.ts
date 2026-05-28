import { Transaction1559SignedSchema } from "@ethernauta/eip/1559"
import { Transaction2930SignedSchema } from "@ethernauta/eip/2930"
import { Transaction4844SignedSchema } from "@ethernauta/eip/4844"
import { Transaction7702SignedSchema } from "@ethernauta/eip/7702"
import { variant } from "valibot"
import { TransactionLegacySignedSchema } from "./legacy"

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml#L452
export const TransactionSignedSchema = variant("type", [
  Transaction1559SignedSchema,
  Transaction2930SignedSchema,
  Transaction4844SignedSchema,
  Transaction7702SignedSchema,
  TransactionLegacySignedSchema,
])
