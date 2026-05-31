// https://specs.optimism.io/protocol/predeploys.html#l1feevault

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const L1_FEE_VAULT_ADDRESS: Address = parse(
  AddressSchema,
  "0x420000000000000000000000000000000000001A",
)
