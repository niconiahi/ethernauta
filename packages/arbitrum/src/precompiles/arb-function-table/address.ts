// https://docs.arbitrum.io/build-decentralized-apps/precompiles/reference

import {
  type Address,
  AddressSchema,
} from "@ethernauta/core"
import { parse } from "valibot"

export const ARB_FUNCTION_TABLE_ADDRESS: Address = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000068",
)
