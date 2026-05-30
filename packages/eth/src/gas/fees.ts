// https://eips.ethereum.org/EIPS/eip-1559

import { UintSchema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { object } from "valibot"

export const Fees1559Schema = object({
  base_fee_per_gas: UintSchema,
  max_priority_fee_per_gas: UintSchema,
  max_fee_per_gas: UintSchema,
})
export type Fees1559 = InferOutput<typeof Fees1559Schema>
