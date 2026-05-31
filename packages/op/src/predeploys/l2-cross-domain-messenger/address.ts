// https://specs.optimism.io/protocol/predeploys.html#l2crossdomainmessenger

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const L2_CROSS_DOMAIN_MESSENGER_ADDRESS: Address =
  parse(
    AddressSchema,
    "0x4200000000000000000000000000000000000007",
  )
