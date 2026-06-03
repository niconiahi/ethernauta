// https://specs.optimism.io/protocol/predeploys.html#eas

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const EAS_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000021",
)
