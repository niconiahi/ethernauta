// https://specs.optimism.io/protocol/predeploys.html#l1block

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const L1_BLOCK_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000015",
)
