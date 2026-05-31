// https://docs.arbitrum.io/build-decentralized-apps/precompiles/reference

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const ARB_OWNER_PUBLIC_ADDRESS: Address = parse(
  AddressSchema,
  "0x000000000000000000000000000000000000006B",
)
