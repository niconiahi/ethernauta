// https://specs.optimism.io/protocol/predeploys.html#legacy-message-passer

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const LEGACY_MESSAGE_PASSER_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000000",
)
