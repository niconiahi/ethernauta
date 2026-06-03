// https://specs.optimism.io/protocol/predeploys.html#deployer-whitelist

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const DEPLOYER_WHITELIST_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000002",
)
