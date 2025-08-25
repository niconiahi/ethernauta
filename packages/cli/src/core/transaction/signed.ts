import { variant } from "valibot"
import { transaction1559SignedSchema } from "./1559"
import { transaction2930SignedSchema } from "./2930"
import { transaction4844SignedSchema } from "./4844"
import { transaction7702SignedSchema } from "./7702"
import { transactionLegacySignedSchema } from "./legacy"

// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml#L452
export const TransactionSignedSchema = variant("type", [
  transaction1559SignedSchema,
  transaction2930SignedSchema,
  transaction4844SignedSchema,
  transaction7702SignedSchema,
  transactionLegacySignedSchema,
])
