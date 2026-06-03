// https://specs.optimism.io/protocol/predeploys.html#governance-token

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const GOVERNANCE_TOKEN_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000042",
)
