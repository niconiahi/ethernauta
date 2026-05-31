// https://specs.optimism.io/protocol/predeploys.html#l2standardbridge

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const L2_STANDARD_BRIDGE_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000010",
)
