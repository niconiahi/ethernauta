// https://specs.optimism.io/protocol/predeploys.html#weth

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const WETH_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000006",
)
