// https://specs.optimism.io/protocol/predeploys.html#optimism-mintable-erc20-factory

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const OPTIMISM_MINTABLE_ERC20_FACTORY_ADDRESS: Address =
  parse(
    AddressSchema,
    "0x4200000000000000000000000000000000000012",
  )
