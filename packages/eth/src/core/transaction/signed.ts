import { transaction1559SignedSchema } from "@ethernauta/eip/1559"
import { transaction2930SignedSchema } from "@ethernauta/eip/2930"
import { transaction4844SignedSchema } from "@ethernauta/eip/4844"
import { transaction7702SignedSchema } from "@ethernauta/eip/7702"
import { variant } from "valibot"
import { transactionLegacySignedSchema } from "./legacy"

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml#L452
export const TransactionSignedSchema = variant("type", [
  transaction1559SignedSchema,
  transaction2930SignedSchema,
  transaction4844SignedSchema,
  transaction7702SignedSchema,
  transactionLegacySignedSchema,
])
