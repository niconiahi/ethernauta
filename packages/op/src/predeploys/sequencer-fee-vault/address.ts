// https://specs.optimism.io/protocol/predeploys.html#sequencerfeevault

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const SEQUENCER_FEE_VAULT_ADDRESS: Address = parse(
  AddressSchema,
  "0x4200000000000000000000000000000000000011",
)
