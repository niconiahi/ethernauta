// https://specs.optimism.io/protocol/predeploys.html#base-fee-vault

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const BASE_FEE_VAULT_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000019",
)
