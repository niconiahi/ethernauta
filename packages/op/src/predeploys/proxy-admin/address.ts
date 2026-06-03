// https://specs.optimism.io/protocol/predeploys.html#proxy-admin

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const PROXY_ADMIN_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000018",
)
