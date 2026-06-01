// https://specs.optimism.io/protocol/predeploys.html#l2tol1messagepasser

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const L2_TO_L1_MESSAGE_PASSER_ADDRESS: Address =
  parse(
    AddressSchema,
    "0x4200000000000000000000000000000000000016",
  )
