// https://docs.arbitrum.io/build-decentralized-apps/precompiles/reference

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const NODE_INTERFACE_ADDRESS: Address = parse(
  AddressSchema,
  "0x00000000000000000000000000000000000000C8",
)
