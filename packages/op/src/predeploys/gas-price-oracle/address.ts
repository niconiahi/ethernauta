// https://specs.optimism.io/protocol/predeploys.html#gaspriceoracle

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const GAS_PRICE_ORACLE_ADDRESS: Address = parse(
  AddressSchema,
  "0x420000000000000000000000000000000000000F",
)
